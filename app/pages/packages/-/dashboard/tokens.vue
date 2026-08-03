<script setup lang="ts">
import { computed, ref, watch } from "vue";
import type { ApiFailure } from "~/types/api";
import type { ApiTokenDocument, ApiTokenListResponse } from "~/types/token";
import { normalizeApiError } from "~/utils/api-problem";
import { apiTokenScopeLabel, apiTokenStatusPresentation, formatApiTokenTimestamp } from "~/utils/token";

definePageMeta({ layout: "packages", middleware: "authenticated" });

useSeoMeta({
  title: "API tokens · Rux Package Registry",
  description: "Create and revoke scoped API tokens for Rux registry automation.",
  robots: "noindex, nofollow",
});

const auth = useCurrentUser();
const api = useRegistryApi();
const toast = useToast();
const tokens = ref<ApiTokenDocument[] | null>(null);
const failure = ref<ApiFailure | null>(null);
const revokeFailure = ref<ApiFailure | null>(null);
const loading = ref(false);
const createOpen = ref(false);
const revokeTarget = ref<ApiTokenDocument | null>(null);
const failedRevoke = ref<ApiTokenDocument | null>(null);
const revokingPrefix = ref<string | null>(null);
let activeLoad: Promise<void> | null = null;

const visibleFailure = computed(() => {
  if (auth.status.value === "unavailable") return auth.failure.value;
  return failure.value;
});

async function signInAgain() {
  return navigateTo({
    path: "/packages/-/auth/sign-in",
    query: { return_to: "/packages/-/dashboard/tokens" },
  });
}

async function loadTokens() {
  if (activeLoad || auth.status.value !== "authenticated") return activeLoad;

  activeLoad = (async () => {
    loading.value = true;
    failure.value = null;
    try {
      const response = await api.sessionGet<ApiTokenListResponse>("/v1/tokens");
      tokens.value = response.data;
    } catch (error) {
      const normalized = normalizeApiError(error);
      if (normalized.problem?.code === "authentication_required") {
        const session = await auth.refresh();
        if (!session) await signInAgain();
        else queueMicrotask(() => void loadTokens());
        return;
      }
      failure.value = normalized;
    } finally {
      loading.value = false;
      activeLoad = null;
    }
  })();

  return activeLoad;
}

async function retry() {
  if (auth.status.value === "unavailable") await auth.refresh();
  await loadTokens();
}

async function recoverMutationAuthentication() {
  const session = await auth.refresh();
  if (!session) {
    await signInAgain();
    return;
  }
  toast.add({
    title: "Session refreshed",
    description: "Try the API token action again.",
    color: "info",
    icon: "i-lucide-refresh-cw",
  });
}

function tokenCreated(token: ApiTokenDocument) {
  if (tokens.value) tokens.value.unshift(token);
  else tokens.value = [token];
  toast.add({
    title: "API token created",
    description: `${token.display_name} is ready to use after you save its credential.`,
    color: "success",
    icon: "i-lucide-circle-check",
  });
}

function requestRevoke(token: ApiTokenDocument) {
  if (token.status !== "active" || revokingPrefix.value) return;
  revokeTarget.value = token;
}

async function revokeToken() {
  const token = revokeTarget.value;
  const session = auth.session.value;
  if (!token || !session || revokingPrefix.value) return;

  revokingPrefix.value = token.token_prefix;
  revokeFailure.value = null;
  failedRevoke.value = null;
  try {
    await api.sessionMutation(`/v1/tokens/${encodeURIComponent(token.token_prefix)}`, "DELETE", session.csrf_token);
    token.status = "revoked";
    token.revoked_at = new Date().toISOString();
    revokeTarget.value = null;
    toast.add({
      title: "API token revoked",
      description: `${token.display_name} can no longer authenticate registry requests.`,
      color: "success",
      icon: "i-lucide-shield-check",
    });
  } catch (error) {
    const normalized = normalizeApiError(error);
    if (normalized.problem?.code === "authentication_required") {
      await recoverMutationAuthentication();
      return;
    }
    revokeTarget.value = null;
    revokeFailure.value = normalized;
    failedRevoke.value = token;
  } finally {
    revokingPrefix.value = null;
  }
}

function retryRevoke() {
  if (!failedRevoke.value) return;
  requestRevoke(failedRevoke.value);
}

watch(
  () => auth.status.value,
  (status) => {
    if (status === "authenticated" && tokens.value === null) void loadTokens();
  },
  { immediate: true },
);
</script>

<template>
  <UContainer class="py-8 sm:py-12">
    <UPageHeader
      headline="Owner experience"
      title="API tokens"
      description="Create scoped credentials for the Rux CLI and automated workflows."
    >
      <template #links>
        <UButton
          label="Dashboard"
          icon="i-lucide-arrow-left"
          color="neutral"
          variant="outline"
          to="/packages/-/dashboard"
        />
        <UButton label="Create token" icon="i-lucide-key-round" @click="createOpen = true" />
      </template>
    </UPageHeader>

    <AppLoadingState v-if="loading && tokens === null" label="Loading API tokens" />

    <ApiProblemAlert v-else-if="visibleFailure" :failure="visibleFailure" @retry="retry" />

    <div v-else-if="tokens" class="space-y-8">
      <UAlert
        color="warning"
        variant="subtle"
        icon="i-lucide-triangle-alert"
        title="Treat API tokens like passwords"
        description="Store credentials in a secret manager, grant only required scopes, and revoke tokens that are unused or exposed. Complete credentials are shown only once."
      />

      <section aria-labelledby="api-token-history-heading">
        <div class="mb-5">
          <h2 id="api-token-history-heading" class="text-xl font-semibold text-highlighted">Token history</h2>
          <p class="mt-1 text-sm text-muted">
            Active, expired, and revoked tokens remain visible without exposing their credentials.
          </p>
        </div>

        <ApiProblemAlert v-if="revokeFailure" class="mb-4" :failure="revokeFailure" @retry="retryRevoke" />

        <UEmpty
          v-if="tokens.length === 0"
          icon="i-lucide-key-round"
          title="No API tokens"
          description="Create a scoped token when you are ready to use the CLI or automation."
          variant="subtle"
        >
          <template #actions>
            <UButton label="Create token" icon="i-lucide-plus" @click="createOpen = true" />
          </template>
        </UEmpty>

        <UCard v-else>
          <ul class="divide-y divide-default" aria-label="API token history">
            <li v-for="token in tokens" :key="token.token_prefix" class="py-5 first:pt-0 last:pb-0">
              <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div class="min-w-0">
                  <div class="flex flex-wrap items-center gap-2">
                    <h3 class="font-semibold text-highlighted">
                      {{ token.display_name }}
                    </h3>
                    <UBadge
                      :label="apiTokenStatusPresentation(token.status).label"
                      :color="apiTokenStatusPresentation(token.status).color"
                      variant="subtle"
                    />
                  </div>
                  <code class="mt-1 block break-all text-sm text-muted">{{ token.token_prefix }}…</code>
                  <div class="mt-3 flex flex-wrap gap-2" :aria-label="`Scopes for ${token.display_name}`">
                    <UBadge
                      v-for="scope in token.scopes"
                      :key="scope"
                      :label="apiTokenScopeLabel(scope)"
                      color="neutral"
                      variant="outline"
                    />
                  </div>
                </div>

                <UButton
                  v-if="token.status === 'active'"
                  label="Revoke"
                  icon="i-lucide-shield-x"
                  color="error"
                  variant="soft"
                  size="sm"
                  :loading="revokingPrefix === token.token_prefix"
                  :disabled="revokingPrefix !== null"
                  :aria-label="`Revoke API token ${token.display_name}`"
                  @click="requestRevoke(token)"
                />
              </div>

              <dl class="mt-4 grid gap-x-6 gap-y-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <dt class="text-muted">Created</dt>
                  <dd class="mt-0.5 text-default">
                    <time :datetime="token.created_at">{{ formatApiTokenTimestamp(token.created_at) }} UTC</time>
                  </dd>
                </div>
                <div>
                  <dt class="text-muted">Last used</dt>
                  <dd class="mt-0.5 text-default">
                    <time v-if="token.last_used_at" :datetime="token.last_used_at">
                      {{ formatApiTokenTimestamp(token.last_used_at) }}
                      UTC
                    </time>
                    <span v-else>Never</span>
                  </dd>
                </div>
                <div>
                  <dt class="text-muted">Expires</dt>
                  <dd class="mt-0.5 text-default">
                    <time v-if="token.expires_at" :datetime="token.expires_at">
                      {{ formatApiTokenTimestamp(token.expires_at) }}
                      UTC
                    </time>
                    <span v-else>Never</span>
                  </dd>
                </div>
                <div>
                  <dt class="text-muted">Revoked</dt>
                  <dd class="mt-0.5 text-default">
                    <time v-if="token.revoked_at" :datetime="token.revoked_at">
                      {{ formatApiTokenTimestamp(token.revoked_at) }}
                      UTC
                    </time>
                    <span v-else>—</span>
                  </dd>
                </div>
              </dl>
            </li>
          </ul>
        </UCard>
      </section>
    </div>

    <CreateApiTokenModal
      v-model:open="createOpen"
      @created="tokenCreated"
      @authentication-required="recoverMutationAuthentication"
    />

    <ConfirmActionModal
      :open="revokeTarget !== null"
      title="Revoke API token"
      :description="
        revokeTarget
          ? `Revoke ${revokeTarget.display_name} (${revokeTarget.token_prefix}…)? Any CLI or workflow using it will immediately lose access.`
          : ''
      "
      confirm-label="Revoke token"
      :pending="revokingPrefix !== null"
      destructive
      @update:open="
        (open) => {
          if (!open) revokeTarget = null;
        }
      "
      @confirm="revokeToken"
    />
  </UContainer>
</template>
