<script setup>
import { ref, onMounted } from "vue";
import { ICONS } from "../osProfiles.js";

const RELEASES = "https://github.com/rux-lang/Rux/releases";
// `releases/latest/download/<asset>` always redirects to the newest published
// asset, so these links never go stale as new versions ship.
const LATEST = `${RELEASES}/latest/download`;

// Live CI status feed: the API stores the latest build/test conclusion per OS,
// fed by GitHub Actions webhooks. In dev we go through the Vite proxy so
// requests stay same-origin.
const API_BASE = import.meta.env.DEV ? "/api/registry" : "https://api.rux-lang.dev";
const API_URL = `${API_BASE}/workflows`;

// Curated per-OS install methods. Downloads reflect what actually ships for
// each platform today: direct binaries where they exist, package managers
// otherwise, source as the universal fallback. Each card also surfaces the live
// build/test conclusion for its platform via the CI status feed below.
const platforms = [
  {
    name: "BSD",
    icon: "freebsd",
    color: "#ab2b28",
    note: "FreeBSD 15.1, OpenBSD 7.9, NetBSD 10.1, and DragonFly 6.4 (x64)",
    statusMatch: ["freebsd", "openbsd", "netbsd", "dragonfly", "bsd"],
    files: [
      { label: "Download", ext: ".tar.gz", href: `${LATEST}/rux-bsd.tar.gz`, disabled: true },
    ],
    guide: "/start/build",
    guideLabel: "Build from source",
  },
  {
    name: "illumos",
    icon: "illumos",
    color: "#ff5b0f",
    note: "illumos, OmniOS r151058, and Solaris 11.4 (x64)",
    statusMatch: ["illumos", "omnios", "solaris"],
    files: [
      { label: "Download", ext: ".tar.gz", href: `${LATEST}/rux-illumos.tar.gz`, disabled: true },
    ],
    guide: "/start/build",
    guideLabel: "Build from source",
  },
  {
    name: "Linux",
    icon: "linux",
    color: "#d9a400",
    note: "Ubuntu 26.04, Debian 13, Fedora 43, Arch, openSUSE Leap 16 (x64)",
    statusMatch: ["linux", "ubuntu", "arch", "fedora", "debian"],
    files: [
      { label: "Download", ext: ".tar.gz", href: `${LATEST}/rux-linux.tar.gz` },
    ],
    command: "curl -fsSL https://rux-lang.dev/install.sh | sh",
    commandLabel: "Or install with the script",
    guide: "/start/install/linux",
  },
  {
    name: "macOS",
    icon: "macos",
    color: "var(--vp-c-text-1)",
    note: "macOS 26 (x64)",
    statusMatch: ["macos", "mac os", "darwin", "apple"],
    files: [
      { label: "Download", ext: ".tar.gz", href: `${LATEST}/rux-macos.tar.gz`, disabled: true },
    ],
    guide: "/start/build",
    guideLabel: "Build from source",
  },
  {
    name: "Windows",
    icon: "windows",
    color: "#0078d4",
    note: "Windows 11, Windows Server 2025 (x64)",
    statusMatch: ["windows"],
    files: [
      { label: "Download", ext: ".zip", href: `${LATEST}/rux-windows.zip` },
      { label: "Download", ext: ".msi", href: `${LATEST}/rux-windows.msi` },
    ],
    command: "scoop bucket add rux-lang https://github.com/rux-lang/Scoop\nscoop install rux",
    commandLabel: "Or install with Scoop",
    guide: "/start/install/windows",
  },
];

const STATUS_TEXT = {
  success: "Success",
  failure: "Failed",
  skipped: "Not run",
  unknown: "Not run",
};

function toConclusion(value) {
  switch (value) {
    case "success":
      return "success";
    case "skipped":
      return "skipped";
    case null:
    case undefined:
    case "":
      return "unknown";
    default:
      // failure, cancelled, timed_out, action_required, neutral, …
      return "failure";
  }
}

function relativeTime(iso) {
  if (!iso) return null;
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.round(diff / 60000);
  if (min < 1) return "just now";
  if (min < 60) return `${min} minute${min === 1 ? "" : "s"} ago`;
  const hr = Math.round(min / 60);
  if (hr < 24) return `${hr} hour${hr === 1 ? "" : "s"} ago`;
  const day = Math.round(hr / 24);
  if (day < 30) return `${day} day${day === 1 ? "" : "s"} ago`;
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// Live CI status, keyed by the workflow's OS name. Each download card looks up
// its matching workflow via `statusMatch` keywords; if nothing reports for a
// platform (or the request fails) the card simply omits the status block.
const workflows = ref([]);
function ciFor(platform) {
  const keys = platform.statusMatch ?? [];
  const w = workflows.value.find((entry) => {
    const n = (entry.name ?? "").toLowerCase();
    return keys.some((k) => n.includes(k));
  });
  if (!w) return null;
  return {
    build: toConclusion(w.buildConclusion),
    buildAt: w.buildCompleted,
    tests: toConclusion(w.testConclusion),
    testsAt: w.testCompleted,
  };
}

// Best-effort live version badge. api.github.com is CORS-enabled and public, so
// the browser can read the latest release tag directly; if the request fails
// (offline, rate-limited) we simply hide the badge rather than block the page.
const version = ref(null);
onMounted(async () => {
  try {
    const r = await fetch(`https://api.github.com/repos/rux-lang/Rux/releases/latest`);
    if (r.ok) {
      const data = await r.json();
      version.value = data.tag_name;
    }
  } catch {
    /* ignore — badge stays hidden */
  }

  try {
    const r = await fetch(API_URL);
    if (r.ok) {
      workflows.value = await r.json();
    }
  } catch {
    /* ignore — status block stays hidden */
  }
});

const copied = ref(null);
async function copy(text, key) {
  try {
    await navigator.clipboard.writeText(text);
    copied.value = key;
    setTimeout(() => {
      if (copied.value === key) copied.value = null;
    }, 1600);
  } catch {
    /* clipboard unavailable — no-op */
  }
}
</script>

<template>
  <div class="dl-meta">
    <a class="dl-version" :href="RELEASES" target="_blank" rel="noopener noreferrer">
      <span class="dl-version-dot"></span>
      <span v-if="version">Latest release {{ version }}</span>
      <span v-else>Latest release</span>
    </a>
    <a
      class="dl-changelog"
      href="https://github.com/rux-lang/Rux/blob/main/CHANGELOG.md"
      target="_blank"
      rel="noopener noreferrer"
    >
      Changelog
    </a>
  </div>

  <div class="dl-grid">
    <div v-for="p in platforms" :key="p.name" class="dl-card">
      <div class="dl-card-head">
        <span class="dl-os-mark" :style="{ color: p.color }" aria-hidden="true" v-html="ICONS[p.icon]"></span>
        <h3>{{ p.name }}</h3>
      </div>

      <p class="dl-note">{{ p.note }}</p>

      <div v-if="p.files" class="dl-files">
        <template v-for="f in p.files" :key="f.href">
          <a
            v-if="!f.disabled"
            class="dl-btn"
            :href="f.href"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span class="dl-btn-label">{{ f.label }}</span>
            <span class="dl-btn-ext">{{ f.ext }}</span>
          </a>
          <span
            v-else
            class="dl-btn dl-btn-disabled"
            role="button"
            aria-disabled="true"
            :title="`${p.name} binaries are coming soon — build from source for now`"
          >
            <span class="dl-btn-label">{{ f.label }}</span>
            <span class="dl-btn-ext">{{ f.ext }}</span>
          </span>
        </template>
      </div>

      <div v-if="p.command" class="dl-cmd-block">
        <span class="dl-cmd-label">{{ p.commandLabel }}</span>
        <div class="dl-cmd">
          <pre><code>{{ p.command }}</code></pre>
          <button
            class="dl-copy"
            type="button"
            :aria-label="`Copy ${p.name} install command`"
            @click="copy(p.command, p.name)"
          >
            {{ copied === p.name ? "Copied" : "Copy" }}
          </button>
        </div>
      </div>

      <div v-if="ciFor(p)" class="dl-ci">
        <div
          v-for="stage in [
            { label: 'Build', conclusion: ciFor(p).build, at: ciFor(p).buildAt },
            { label: 'Tests', conclusion: ciFor(p).tests, at: ciFor(p).testsAt },
          ]"
          :key="stage.label"
          class="dl-ci-row"
          :class="`is-${stage.conclusion}`"
        >
          <span class="dl-ci-stage">
            {{ stage.label }}
            <small v-if="relativeTime(stage.at)">{{ relativeTime(stage.at) }}</small>
          </span>
          <strong class="dl-ci-result">
            <svg
              v-if="stage.conclusion === 'success'"
              class="dl-ci-icon"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M20 6 9 17l-5-5" />
            </svg>
            {{ STATUS_TEXT[stage.conclusion] }}
          </strong>
        </div>
      </div>

      <a class="dl-guide" :href="p.guide">
        {{ p.guideLabel || "Installation guide" }}
        <span aria-hidden="true">→</span>
      </a>
    </div>
  </div>
</template>

<style scoped>
.dl-meta {
  display: flex;
  align-items: center;
  gap: 18px;
  margin: 0 0 28px;
}

.dl-version {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 14px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 999px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  font-size: 13px;
  font-weight: 600;
  text-decoration: none;
  transition: border-color 0.25s ease;
}

.dl-version:hover {
  border-color: var(--vp-c-brand-1);
}

.dl-version-dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: #28c840;
  box-shadow: 0 0 0 5px rgba(40, 200, 64, 0.12);
}

.dl-changelog {
  color: var(--vp-c-text-2);
  font-size: 13px;
  font-weight: 600;
  text-decoration: none;
}

.dl-changelog:hover {
  color: var(--vp-c-brand-1);
}

.dl-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 18px;
  margin: 24px 0 48px;
}

.dl-card {
  display: flex;
  flex-direction: column;
  min-width: 0;
  padding: 22px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 14px;
  background: var(--vp-c-bg-soft);
  animation: rux-fade-up 0.5s ease both;
  transition:
    translate 0.25s ease,
    border-color 0.25s ease,
    box-shadow 0.25s ease;
}

.dl-card:hover {
  translate: 0 -5px;
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 12px 32px rgba(142, 92, 217, 0.2);
}

.dl-card-head {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-bottom: 14px;
  border-bottom: 1px solid var(--vp-c-divider);
}

.dl-card-head h3 {
  margin: 0;
  border: 0;
  padding: 0;
  font-size: 18px;
}

.dl-os-mark {
  display: inline-flex;
  width: 2.5rem;
  height: 2.5rem;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  flex-shrink: 0;
  background-color: color-mix(in srgb, currentColor 10%, transparent);
}

.dl-os-mark :deep(svg) {
  width: 1.5rem;
  height: 1.5rem;
  fill: currentColor;
}

.dl-note {
  margin: 14px 0 0;
  color: var(--vp-c-text-2);
  font-size: 13px;
  line-height: 1.6;
}

.dl-files {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 16px;
}

.dl-files .dl-btn,
.dl-files .dl-btn:hover {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 8px 14px;
  border-radius: 8px;
  background: linear-gradient(120deg, #7c3aed 0%, #a855f7 100%);
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  box-shadow: 0 2px 10px rgba(124, 58, 237, 0.25);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    filter 0.2s ease;
}

.dl-files .dl-btn:hover {
  transform: translateY(-1px);
  filter: brightness(1.08);
  box-shadow: 0 6px 18px rgba(124, 58, 237, 0.35);
}

.dl-files .dl-btn-disabled,
.dl-files .dl-btn-disabled:hover {
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-3);
  border: 1px solid var(--vp-c-divider);
  box-shadow: none;
  cursor: not-allowed;
  transform: none;
  filter: none;
}

.dl-btn-ext {
  font-family: var(--vp-font-family-mono);
  font-size: 12px;
  opacity: 0.9;
}

.dl-cmd-block {
  margin-top: 16px;
}

.dl-cmd-label {
  display: block;
  margin-bottom: 6px;
  color: var(--vp-c-text-3);
  font-size: 12px;
}

.dl-cmd {
  position: relative;
  min-width: 0;
}

.dl-cmd pre {
  margin: 0;
  padding: 12px 56px 12px 14px;
  border-radius: 8px;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  overflow-x: auto;
}

.dl-cmd code {
  font-family: var(--vp-font-family-mono);
  font-size: 12.5px;
  line-height: 1.6;
  white-space: pre;
  color: var(--vp-c-text-1);
}

.dl-copy {
  position: absolute;
  top: 8px;
  right: 8px;
  padding: 4px 10px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  transition:
    color 0.2s ease,
    border-color 0.2s ease;
}

.dl-copy:hover {
  color: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
}

.dl-ci {
  margin-top: 18px;
  border-top: 1px solid var(--vp-c-divider);
}

.dl-ci-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 0;
}

.dl-ci-row + .dl-ci-row {
  border-top: 1px solid var(--vp-c-divider);
}

.dl-ci-stage {
  display: flex;
  flex-direction: column;
  gap: 2px;
  color: var(--vp-c-text-1);
  font-size: 14px;
  font-weight: 600;
}

.dl-ci-stage small {
  color: var(--vp-c-text-3);
  font-size: 11px;
  font-weight: 400;
  line-height: 1.2;
}

.dl-ci-result {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 13px;
  font-weight: 600;
}

.dl-ci-icon {
  width: 15px;
  height: 15px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2.5;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.dl-ci-row.is-success .dl-ci-result {
  color: #28c840;
}

.dl-ci-row.is-failure .dl-ci-result {
  color: var(--vp-c-danger-1, #f43f5e);
}

.dl-ci-row.is-skipped .dl-ci-result,
.dl-ci-row.is-unknown .dl-ci-result {
  color: var(--vp-c-text-3);
}

.dl-guide {
  margin-top: auto;
  padding-top: 18px;
  color: var(--vp-c-brand-1);
  font-size: 13px;
  font-weight: 600;
  text-decoration: none;
}

.dl-guide span {
  display: inline-block;
  transition: transform 0.2s ease;
}

.dl-guide:hover span {
  transform: translateX(3px);
}

@media (max-width: 760px) {
  .dl-grid {
    grid-template-columns: 1fr;
  }
}

@media (prefers-reduced-motion: reduce) {
  .dl-card {
    animation: none !important;
    transition: none !important;
  }
}
</style>
