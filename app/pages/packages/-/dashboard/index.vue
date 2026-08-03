<script setup lang="ts">
import { computed, ref, watch } from "vue";
import type { ApiFailure } from "~/types/api";
import type { DashboardDocument, DashboardInvitation, DashboardResponse } from "~/types/dashboard";
import { normalizeApiError } from "~/utils/api-problem";
import { catalogNamespacePath, catalogPackagePath, normalizedIdentity } from "~/utils/catalog";
import {
  dashboardActivityText,
  dashboardRoleLabel,
  dashboardUserLabel,
  formatDashboardTimestamp,
} from "~/utils/dashboard";
import { namespaceManagementPath } from "~/utils/namespace";

definePageMeta({ layout: "packages", middleware: "authenticated" });

useSeoMeta({
  title: "Owner dashboard · Rux Package Registry",
  description: "Review your Rux registry namespaces, packages, invitations, activity, and downloads.",
  robots: "noindex, nofollow",
});

const auth = useCurrentUser();
const api = useRegistryApi();
const toast = useToast();
const data = ref<DashboardDocument | null>(null);
const failure = ref<ApiFailure | null>(null);
const invitationFailure = ref<ApiFailure | null>(null);
const loading = ref(false);
const claimOpen = ref(false);
const invitationAction = ref<string | null>(null);
const declineTarget = ref<DashboardInvitation | null>(null);
const failedInvitationAction = ref<{
  kind: "accept" | "decline";
  invitation: DashboardInvitation;
} | null>(null);
let activeLoad: Promise<void> | null = null;

const visibleFailure = computed(() => {
  if (auth.status.value === "unavailable") return auth.failure.value;
  return failure.value;
});
const summaries = computed(() =>
  data.value
    ? [
        {
          label: "Namespaces",
          value: data.value.counts.namespaces,
          icon: "i-lucide-box",
        },
        {
          label: "Packages",
          value: data.value.counts.packages,
          icon: "i-lucide-package",
        },
        {
          label: "Invitations",
          value: data.value.counts.invitations,
          icon: "i-lucide-mail",
        },
        {
          label: "Downloads in 30 days",
          value: data.value.downloads.total_30d,
          icon: "i-lucide-download",
        },
      ]
    : [],
);

async function signInAgain() {
  return navigateTo({
    path: "/packages/-/auth/sign-in",
    query: { return_to: "/packages/-/dashboard" },
  });
}

async function loadDashboard() {
  if (activeLoad || auth.status.value !== "authenticated") return activeLoad;

  activeLoad = (async () => {
    loading.value = true;
    failure.value = null;
    try {
      const response = await api.sessionGet<DashboardResponse>("/v1/dashboard");
      data.value = response.data;
    } catch (error) {
      const normalized = normalizeApiError(error);
      if (normalized.problem?.code === "authentication_required") {
        const session = await auth.refresh();
        if (!session) await signInAgain();
        else queueMicrotask(() => void loadDashboard());
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
  await loadDashboard();
}

async function recoverMutationAuthentication() {
  const session = await auth.refresh();
  if (!session) {
    await signInAgain();
    return;
  }
  toast.add({
    title: "Session refreshed",
    description: "Try the namespace action again.",
    color: "info",
    icon: "i-lucide-refresh-cw",
  });
}

async function acceptInvitation(invitation: DashboardInvitation) {
  const session = auth.session.value;
  const key = `accept:${normalizedIdentity(invitation.namespace)}`;
  if (!session || invitationAction.value) return;

  invitationAction.value = key;
  invitationFailure.value = null;
  failedInvitationAction.value = null;
  try {
    await api.sessionMutation(
      `/v1/invitations/${encodeURIComponent(normalizedIdentity(invitation.namespace))}/accept`,
      "POST",
      session.csrf_token,
    );
    toast.add({
      title: "Invitation accepted",
      description: `You are now a ${dashboardRoleLabel(invitation.role).toLowerCase()} of ${invitation.namespace}.`,
      color: "success",
      icon: "i-lucide-circle-check",
    });
    await loadDashboard();
  } catch (error) {
    const normalized = normalizeApiError(error);
    if (normalized.problem?.code === "authentication_required") {
      await recoverMutationAuthentication();
      return;
    }
    invitationFailure.value = normalized;
    failedInvitationAction.value = { kind: "accept", invitation };
  } finally {
    invitationAction.value = null;
  }
}

function requestDecline(invitation: DashboardInvitation) {
  declineTarget.value = invitation;
}

async function declineInvitation() {
  const invitation = declineTarget.value;
  const session = auth.session.value;
  const login = auth.user.value?.github_login;
  if (!invitation || !session || !login || invitationAction.value) return;

  const key = `decline:${normalizedIdentity(invitation.namespace)}`;
  invitationAction.value = key;
  invitationFailure.value = null;
  failedInvitationAction.value = null;
  try {
    await api.sessionMutation(
      `/v1/namespaces/${encodeURIComponent(normalizedIdentity(invitation.namespace))}/invitations/${encodeURIComponent(login)}`,
      "DELETE",
      session.csrf_token,
    );
    if (data.value) {
      data.value.invitations = data.value.invitations.filter((item) => item !== invitation);
      data.value.counts.invitations = Math.max(0, data.value.counts.invitations - 1);
    }
    declineTarget.value = null;
    toast.add({
      title: "Invitation declined",
      description: `The invitation to ${invitation.namespace} was removed.`,
      color: "success",
      icon: "i-lucide-circle-check",
    });
  } catch (error) {
    const normalized = normalizeApiError(error);
    if (normalized.problem?.code === "authentication_required") {
      await recoverMutationAuthentication();
      return;
    }
    declineTarget.value = null;
    invitationFailure.value = normalized;
    failedInvitationAction.value = { kind: "decline", invitation };
  } finally {
    invitationAction.value = null;
  }
}

function retryInvitationAction() {
  const failed = failedInvitationAction.value;
  if (!failed) return;
  if (failed.kind === "accept") void acceptInvitation(failed.invitation);
  else requestDecline(failed.invitation);
}

async function namespaceClaimed(namespace: string) {
  toast.add({
    title: "Namespace claimed",
    description: `${namespace} is ready to manage.`,
    color: "success",
    icon: "i-lucide-circle-check",
  });
  await navigateTo(namespaceManagementPath(namespace));
}

watch(
  () => auth.status.value,
  (status) => {
    if (status === "authenticated" && !data.value) void loadDashboard();
  },
  { immediate: true },
);
</script>

<template>
  <UContainer class="py-8 sm:py-12">
    <UPageHeader
      headline="Owner experience"
      title="Dashboard"
      description="A current view of the namespaces and packages you help maintain."
    >
      <template #links>
        <UButton
          label="API tokens"
          icon="i-lucide-key-round"
          color="neutral"
          variant="outline"
          to="/packages/-/dashboard/tokens"
        />
        <UButton label="Claim namespace" icon="i-lucide-plus" @click="claimOpen = true" />
      </template>
    </UPageHeader>

    <AppLoadingState v-if="loading && !data" label="Loading owner dashboard" />

    <ApiProblemAlert v-else-if="visibleFailure" :failure="visibleFailure" @retry="retry" />

    <div v-else-if="data" id="dashboard-content" class="space-y-12">
      <section aria-label="Dashboard totals" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <UCard v-for="summary in summaries" :key="summary.label">
          <div class="flex items-start justify-between gap-4">
            <div>
              <p class="text-sm font-medium text-muted">
                {{ summary.label }}
              </p>
              <p class="mt-2 text-3xl font-semibold text-highlighted">
                {{ summary.value.toLocaleString("en") }}
              </p>
            </div>
            <UIcon :name="summary.icon" class="size-5 text-primary" aria-hidden="true" />
          </div>
        </UCard>
      </section>

      <div class="grid gap-12 lg:grid-cols-2">
        <section aria-labelledby="dashboard-namespaces-heading">
          <div class="mb-5">
            <h2 id="dashboard-namespaces-heading" class="text-xl font-semibold text-highlighted">Owned namespaces</h2>
            <p class="mt-1 text-sm text-muted">Every namespace where you are an owner or maintainer.</p>
          </div>
          <UEmpty
            v-if="!data.namespaces.length"
            icon="i-lucide-box"
            title="No namespace memberships"
            description="Namespace memberships and accepted invitations will appear here."
            variant="subtle"
          />
          <div v-else class="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            <UPageCard
              v-for="namespace in data.namespaces"
              :key="normalizedIdentity(namespace.namespace)"
              :title="namespace.namespace"
              :description="`${namespace.package_count.toLocaleString('en')} ${namespace.package_count === 1 ? 'package' : 'packages'}`"
              icon="i-lucide-box"
            >
              <template #footer>
                <div class="flex flex-wrap items-center gap-2">
                  <UBadge color="neutral" variant="subtle">
                    {{ dashboardRoleLabel(namespace.role) }}
                  </UBadge>
                  <UButton label="Manage" size="xs" :to="namespaceManagementPath(namespace.namespace)" />
                  <UButton
                    label="View packages"
                    size="xs"
                    color="neutral"
                    variant="outline"
                    :to="catalogNamespacePath(namespace.namespace)"
                  />
                </div>
              </template>
            </UPageCard>
          </div>
        </section>

        <section aria-labelledby="dashboard-invitations-heading">
          <div class="mb-5">
            <h2 id="dashboard-invitations-heading" class="text-xl font-semibold text-highlighted">Invitations</h2>
            <p class="mt-1 text-sm text-muted">Pending namespace invitations are shown here until they expire.</p>
          </div>
          <ApiProblemAlert
            v-if="invitationFailure"
            class="mb-4"
            :failure="invitationFailure"
            @retry="retryInvitationAction"
          />
          <UEmpty
            v-if="!data.invitations.length"
            icon="i-lucide-mail-check"
            title="No pending invitations"
            description="You are up to date."
            variant="subtle"
          />
          <UCard v-else>
            <ul class="divide-y divide-default" aria-label="Pending namespace invitations">
              <li
                v-for="invitation in data.invitations"
                :key="`${invitation.namespace}:${invitation.created_at}`"
                class="py-4 first:pt-0 last:pb-0"
              >
                <div class="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <NuxtLink
                      :to="catalogNamespacePath(invitation.namespace)"
                      class="font-medium text-highlighted hover:text-primary"
                    >
                      {{ invitation.namespace }}
                    </NuxtLink>
                    <p class="mt-1 text-sm text-muted">
                      Invited by
                      {{ dashboardUserLabel(invitation.invited_by) }}
                    </p>
                  </div>
                  <UBadge color="neutral" variant="subtle">{{ dashboardRoleLabel(invitation.role) }}</UBadge>
                </div>
                <p class="mt-2 text-xs text-muted">
                  Expires
                  <time :datetime="invitation.expires_at"
                    >{{ formatDashboardTimestamp(invitation.expires_at) }} UTC</time
                  >
                </p>
                <div class="mt-3 flex flex-wrap gap-2">
                  <UButton
                    label="Accept"
                    size="xs"
                    icon="i-lucide-check"
                    :loading="invitationAction === `accept:${normalizedIdentity(invitation.namespace)}`"
                    :disabled="invitationAction !== null"
                    :aria-label="`Accept invitation to ${invitation.namespace}`"
                    @click="acceptInvitation(invitation)"
                  />
                  <UButton
                    label="Decline"
                    size="xs"
                    color="neutral"
                    variant="outline"
                    icon="i-lucide-x"
                    :disabled="invitationAction !== null"
                    :aria-label="`Decline invitation to ${invitation.namespace}`"
                    @click="requestDecline(invitation)"
                  />
                </div>
              </li>
            </ul>
          </UCard>
        </section>
      </div>

      <section aria-labelledby="dashboard-packages-heading">
        <div class="mb-5">
          <h2 id="dashboard-packages-heading" class="text-xl font-semibold text-highlighted">
            Recently published packages
          </h2>
          <p class="mt-1 text-sm text-muted">The ten most recently published packages across your namespaces.</p>
        </div>
        <UEmpty
          v-if="!data.packages.length"
          icon="i-lucide-package-open"
          title="No published packages"
          description="Packages published under your namespaces will appear here."
          variant="subtle"
        />
        <UCard v-else>
          <ul class="divide-y divide-default" aria-label="Recently published packages">
            <li
              v-for="item in data.packages"
              :key="`${item.namespace}:${item.package}`"
              class="py-4 first:pt-0 last:pb-0"
            >
              <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div class="min-w-0">
                  <NuxtLink :to="catalogPackagePath(item)" class="font-medium text-highlighted hover:text-primary">
                    {{ item.namespace }}/{{ item.package }}
                  </NuxtLink>
                  <p class="mt-1 text-sm text-muted">
                    {{ item.version_count.toLocaleString("en") }}
                    {{ item.version_count === 1 ? "version" : "versions" }}
                  </p>
                </div>
                <div class="flex flex-wrap items-center gap-2 sm:justify-end">
                  <UBadge color="neutral" variant="subtle">v{{ item.version }}</UBadge>
                  <UBadge v-if="item.yanked" color="neutral" variant="subtle">Yanked</UBadge>
                  <time :datetime="item.published_at" class="text-xs text-muted">
                    {{ formatDashboardTimestamp(item.published_at) }}
                    UTC
                  </time>
                </div>
              </div>
            </li>
          </ul>
        </UCard>
      </section>

      <div class="grid gap-12 lg:grid-cols-2">
        <section aria-labelledby="dashboard-activity-heading">
          <div class="mb-5">
            <h2 id="dashboard-activity-heading" class="text-xl font-semibold text-highlighted">Recent activity</h2>
            <p class="mt-1 text-sm text-muted">Recent changes visible for your current namespace roles.</p>
          </div>
          <UEmpty
            v-if="!data.activity.length"
            icon="i-lucide-activity"
            title="No recent activity"
            description="Publishing and namespace changes will appear here."
            variant="subtle"
          />
          <UCard v-else>
            <ol class="divide-y divide-default" aria-label="Recent namespace activity">
              <li
                v-for="item in data.activity"
                :key="`${item.kind}:${item.occurred_at}:${item.namespace}`"
                class="py-4 first:pt-0 last:pb-0"
              >
                <p class="text-sm text-default">
                  {{ dashboardActivityText(item) }}
                </p>
                <div class="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                  <NuxtLink :to="catalogNamespacePath(item.namespace)" class="text-muted hover:text-primary">
                    {{ item.namespace }}
                  </NuxtLink>
                  <NuxtLink
                    v-if="item.package"
                    :to="
                      catalogPackagePath({
                        namespace: item.namespace,
                        package: item.package,
                      })
                    "
                    class="text-muted hover:text-primary"
                  >
                    {{ item.package }}
                  </NuxtLink>
                  <time :datetime="item.occurred_at" class="text-muted"
                    >{{ formatDashboardTimestamp(item.occurred_at) }} UTC</time
                  >
                </div>
              </li>
            </ol>
          </UCard>
        </section>

        <section aria-labelledby="dashboard-downloads-heading">
          <div class="mb-5">
            <h2 id="dashboard-downloads-heading" class="text-xl font-semibold text-highlighted">Download summary</h2>
            <p class="mt-1 text-sm text-muted">
              Registry download requests across every version, including yanked releases.
            </p>
          </div>
          <UCard>
            <div class="grid gap-4 sm:grid-cols-2">
              <div>
                <p class="text-sm text-muted">Last {{ data.downloads.window_days }} days</p>
                <p class="mt-1 text-2xl font-semibold text-highlighted">
                  {{ data.downloads.total_30d.toLocaleString("en") }}
                </p>
              </div>
              <div>
                <p class="text-sm text-muted">All time</p>
                <p class="mt-1 text-2xl font-semibold text-highlighted">
                  {{ data.downloads.total_all_time.toLocaleString("en") }}
                </p>
              </div>
            </div>
            <USeparator class="my-5" />
            <h3 class="text-sm font-semibold text-highlighted">Leading packages in 30 days</h3>
            <p v-if="!data.downloads.top_packages.length" class="mt-3 text-sm text-muted">
              No downloads recorded in this period.
            </p>
            <ol v-else class="mt-3 space-y-3">
              <li
                v-for="leader in data.downloads.top_packages"
                :key="`${leader.namespace}:${leader.package}`"
                class="flex items-center justify-between gap-4 text-sm"
              >
                <NuxtLink :to="catalogPackagePath(leader)" class="min-w-0 truncate text-highlighted hover:text-primary">
                  {{ leader.namespace }}/{{ leader.package }}
                </NuxtLink>
                <span class="shrink-0 text-muted">{{ leader.downloads_30d.toLocaleString("en") }}</span>
              </li>
            </ol>
          </UCard>
        </section>
      </div>
    </div>

    <ClaimNamespaceModal v-model:open="claimOpen" @claimed="namespaceClaimed" />

    <ConfirmActionModal
      :open="declineTarget !== null"
      title="Decline namespace invitation"
      :description="
        declineTarget
          ? `Decline the invitation to ${declineTarget.namespace}? An owner must invite you again if you change your mind.`
          : ''
      "
      confirm-label="Decline invitation"
      :pending="invitationAction?.startsWith('decline:') ?? false"
      destructive
      @update:open="
        (open) => {
          if (!open) declineTarget = null;
        }
      "
      @confirm="declineInvitation"
    />
  </UContainer>
</template>
