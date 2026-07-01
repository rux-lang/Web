<script setup>
import {
  ref,
  reactive,
  computed,
  nextTick,
  onMounted,
  onBeforeUnmount,
} from "vue";

// In dev, go through the Vite proxy (see vite.server.proxy in config.mts) so
// requests are same-origin and not subject to the API's CORS allowlist.
const API_URL = import.meta.env.DEV
  ? "/api/registry/packages"
  : "https://api.rux-lang.dev/packages";
// Cloudflare test sitekey (always passes); replace with the real one in production.
const TURNSTILE_SITE_KEY = "0x4AAAAAADi4pG0GpDHyqAYp";
const TURNSTILE_SCRIPT_URL =
  "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

// The API returns the full package list as a plain array; we show all of them.
const packages = ref([]);
const loading = ref(true);
const error = ref(null);

const total = computed(() => packages.value.length);

const formVisible = ref(false);
const submitting = ref(false);
const submitError = ref(null);
const form = reactive({
  repository: "",
});

const copiedId = ref(null);
let copiedTimer = null;

async function copyInstallCommand(pkg) {
  try {
    await navigator.clipboard.writeText(pkg.name);
    copiedId.value = pkg.id;
    clearTimeout(copiedTimer);
    copiedTimer = setTimeout(() => (copiedId.value = null), 1500);
  } catch {
    // Clipboard is unavailable (insecure context or denied permission).
  }
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

async function loadPackages() {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }
  packages.value = await response.json();
}

const turnstileContainer = ref(null);
const turnstileToken = ref("");
let turnstileWidgetId = null;
let turnstileScriptPromise = null;

function loadTurnstileScript() {
  if (window.turnstile) {
    return Promise.resolve();
  }
  turnstileScriptPromise ??= new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = TURNSTILE_SCRIPT_URL;
    script.async = true;
    script.onload = resolve;
    script.onerror = () => {
      turnstileScriptPromise = null;
      reject(new Error("Failed to load the verification widget."));
    };
    document.head.appendChild(script);
  });
  return turnstileScriptPromise;
}

async function renderTurnstile() {
  try {
    await loadTurnstileScript();
  } catch (e) {
    submitError.value = e.message;
    return;
  }
  if (!turnstileContainer.value || turnstileWidgetId !== null) {
    return;
  }
  turnstileWidgetId = window.turnstile.render(turnstileContainer.value, {
    sitekey: TURNSTILE_SITE_KEY,
    theme: "auto",
    callback: (token) => (turnstileToken.value = token),
    "expired-callback": () => (turnstileToken.value = ""),
    "error-callback": () => (turnstileToken.value = ""),
  });
}

function destroyTurnstile() {
  if (turnstileWidgetId !== null && window.turnstile) {
    window.turnstile.remove(turnstileWidgetId);
  }
  turnstileWidgetId = null;
  turnstileToken.value = "";
}

function toggleForm() {
  formVisible.value = !formVisible.value;
  submitError.value = null;
  if (formVisible.value) {
    nextTick(renderTurnstile);
  } else {
    destroyTurnstile();
  }
}

onBeforeUnmount(destroyTurnstile);

async function readErrorMessage(response) {
  const text = await response.text();
  try {
    const data = JSON.parse(text);
    return data.title || data.detail || text;
  } catch {
    return text || `Request failed with status ${response.status}`;
  }
}

async function publishPackage() {
  if (!turnstileToken.value) {
    submitError.value = "Please complete the verification challenge first.";
    return;
  }
  submitting.value = true;
  submitError.value = null;
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        repository: form.repository.trim(),
        turnstileToken: turnstileToken.value,
      }),
    });
    if (!response.ok) {
      submitError.value = await readErrorMessage(response);
      // Tokens are single-use; request a fresh one for the next attempt.
      turnstileToken.value = "";
      if (turnstileWidgetId !== null && window.turnstile) {
        window.turnstile.reset(turnstileWidgetId);
      }
      return;
    }
    form.repository = "";
    formVisible.value = false;
    destroyTurnstile();
    await loadPackages();
  } catch (e) {
    submitError.value = e.message;
  } finally {
    submitting.value = false;
  }
}

onMounted(async () => {
  try {
    await loadPackages();
  } catch (e) {
    error.value = e.message;
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="package-registry">
    <div class="registry-toolbar">
      <button type="button" class="publish-toggle" @click="toggleForm">
        {{ formVisible ? "Cancel" : "Publish package" }}
      </button>
    </div>

    <form v-if="formVisible" class="publish-form" @submit.prevent="publishPackage">
      <label class="form-field">
        <span class="form-label">Repository</span>
        <input v-model="form.repository" type="url" required placeholder="https://github.com/user/my-package" />
      </label>
      <p class="form-hint">
        The package name and description are read from the
        <code>Rux.toml</code> manifest in the repository root, and the license
        is detected from the repository. Supported hosts: GitHub, GitLab,
        Bitbucket, Codeberg.
      </p>
      <div ref="turnstileContainer" class="turnstile-widget"></div>
      <div v-if="submitError" class="registry-error form-error">
        {{ submitError }}
      </div>
      <button type="submit" class="publish-submit" :disabled="submitting || !turnstileToken">
        {{ submitting ? "Publishing…" : "Publish" }}
      </button>
    </form>

    <div v-if="loading" class="registry-status">Loading packages…</div>

    <div v-else-if="error" class="registry-status registry-error">
      Failed to load packages: {{ error }}
    </div>

    <div v-else-if="packages.length === 0" class="registry-status">
      No packages in the registry yet.
    </div>

    <template v-else>
      <p class="registry-count">
        {{ total }} package{{ total === 1 ? "" : "s" }} available
      </p>
      <div class="package-list">
        <article v-for="pkg in packages" :key="pkg.id" class="package-card">
          <div class="package-header">
            <div class="package-title">
              <svg class="package-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                aria-hidden="true">
                <line x1="16.5" y1="9.4" x2="7.5" y2="4.21" />
                <path
                  d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                <line x1="12" y1="22.08" x2="12" y2="12" />
              </svg>
              <button type="button" class="package-name" :title="`Copy package name: ${pkg.name}`"
                @click="copyInstallCommand(pkg)">
                {{ pkg.name }}
              </button>
              <span v-if="copiedId === pkg.id" class="copied-note">Copied!</span>
            </div>
            <span class="package-license">{{ pkg.license }}</span>
          </div>
          <p class="package-description">{{ pkg.description }}</p>
          <div class="package-meta">
            <a class="package-repo" :href="pkg.repository" target="_blank" rel="noopener noreferrer">
              {{ pkg.repository.replace(/^https?:\/\//, "") }}
            </a>
            <span class="package-date">Published {{ formatDate(pkg.created) }}</span>
          </div>
        </article>
      </div>
    </template>
  </div>
</template>

<style scoped>
.package-registry {
  margin-top: 1.5rem;
}

.registry-status {
  padding: 2rem 0;
  color: var(--vp-c-text-2);
}

.registry-error {
  color: var(--vp-c-danger-1);
}

.registry-toolbar {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1rem;
}

.publish-toggle,
.publish-submit {
  padding: 0.375rem 1.25rem;
  border: 1px solid var(--vp-c-brand-1);
  border-radius: 20px;
  background-color: var(--vp-c-brand-3);
  color: var(--vp-c-white);
  font-size: 0.875rem;
  font-weight: 600;
  transition: background-color 0.25s;
}

.publish-toggle:hover,
.publish-submit:hover:not(:disabled) {
  background-color: var(--vp-c-brand-2);
}

.publish-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.publish-form {
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
  margin-bottom: 1.5rem;
  padding: 1.25rem 1.5rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background-color: var(--vp-c-bg-soft);
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.form-label {
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--vp-c-text-2);
}

.form-field input {
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background-color: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-size: 0.875rem;
  font-family: inherit;
  transition: border-color 0.25s;
}

.form-field input:focus {
  outline: none;
  border-color: var(--vp-c-brand-1);
}

.form-hint {
  margin: 0;
  font-size: 0.8125rem;
  color: var(--vp-c-text-3);
}

.turnstile-widget {
  min-height: 65px;
}

.form-error {
  font-size: 0.875rem;
}

.publish-form .publish-submit {
  align-self: flex-start;
}

.registry-count {
  margin: 0 0 1rem;
  color: var(--vp-c-text-2);
  font-size: 0.875rem;
}

.package-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.package-card {
  padding: 1.25rem 1.5rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background-color: var(--vp-c-bg-soft);
  transition: border-color 0.25s;
}

.package-card:hover {
  border-color: var(--vp-c-brand-1);
}

.package-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.package-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 0;
}

.package-icon {
  width: 1.25rem;
  height: 1.25rem;
  flex-shrink: 0;
  color: var(--vp-c-brand-1);
}

.package-name {
  padding: 0;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 1.125rem;
  font-weight: 600;
  font-family: inherit;
  color: var(--vp-c-brand-1);
}

.package-name:hover {
  text-decoration: underline;
}

.copied-note {
  flex-shrink: 0;
  color: var(--vp-c-green-1);
  font-size: 0.8125rem;
  font-weight: 500;
}

.package-license {
  flex-shrink: 0;
  padding: 0.125rem 0.625rem;
  border-radius: 0.5rem;
  background-color: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  font-size: 0.75rem;
  font-weight: 500;
}

.package-description {
  margin: 0.5rem 0 0.75rem;
  color: var(--vp-c-text-1);
  line-height: 1.6;
}

.package-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
  font-size: 0.8125rem;
}

@media (max-width: 640px) {
  .package-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.375rem;
  }
}

.package-repo {
  color: var(--vp-c-text-2);
  font-family: var(--vp-font-family-sans);
  text-decoration: none;
  overflow-wrap: anywhere;
}

.package-repo:hover {
  color: var(--vp-c-brand-1);
}

.package-date {
  flex-shrink: 0;
  color: var(--vp-c-text-3);
}
</style>
