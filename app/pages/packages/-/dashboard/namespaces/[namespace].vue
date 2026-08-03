<script setup lang="ts">
import { computed, ref, watch } from "vue";
import type { ApiFailure } from "~/types/api";
import type {
  NamespaceDocument,
  NamespaceInvitation,
  NamespaceInvitationsResponse,
  NamespaceListResponse,
  NamespaceMember,
  NamespaceMemberResponse,
  NamespaceMembersResponse,
  NamespaceRole,
} from "~/types/namespace";
import { normalizeApiError } from "~/utils/api-problem";
import { safeAvatarUrl, userInitials } from "~/utils/auth";
import { catalogNamespacePath, normalizedIdentity } from "~/utils/catalog";
import { dashboardRoleLabel, formatDashboardTimestamp } from "~/utils/dashboard";
import { namespaceApiPath, namespaceRoleOptions, namespaceUserLabel } from "~/utils/namespace";

definePageMeta({ layout: "packages", middleware: "authenticated" });

type Confirmation =
  | { kind: "role"; member: NamespaceMember; role: NamespaceRole }
  | { kind: "remove"; member: NamespaceMember }
  | { kind: "revoke"; invitation: NamespaceInvitation };

const route = useRoute();
const auth = useCurrentUser();
const api = useRegistryApi();
const toast = useToast();
const routeNamespace = computed(() => {
  const value = route.params.namespace;
  return typeof value === "string" ? value : (value?.[0] ?? "");
});
const namespace = ref<NamespaceDocument | null>(null);
const members = ref<NamespaceMember[]>([]);
const invitations = ref<NamespaceInvitation[]>([]);
const failure = ref<ApiFailure | null>(null);
const actionFailure = ref<ApiFailure | null>(null);
const loading = ref(false);
const inviteOpen = ref(false);
const pendingAction = ref<string | null>(null);
const confirmation = ref<Confirmation | null>(null);
let activeLoad: Promise<void> | null = null;

const isOwner = computed(() => namespace.value?.role === "owner");
const ownerCount = computed(() => members.value.filter((member) => member.role === "owner").length);
const currentLogin = computed(() => auth.user.value?.github_login ?? "");
const currentMember = computed(
  () =>
    members.value.find((member) => member.user.github_login.toLowerCase() === currentLogin.value.toLowerCase()) ?? null,
);
const isLastOwner = computed(() => currentMember.value?.role === "owner" && ownerCount.value <= 1);
const visibleActionFailure = computed<ApiFailure | null>(() =>
  actionFailure.value ? { ...actionFailure.value, retryable: false } : null,
);

const confirmationContent = computed(() => {
  const value = confirmation.value;
  if (!value) return { title: "", description: "", label: "", destructive: false };
  if (value.kind === "role") {
    const target = namespaceUserLabel(value.member.user);
    return {
      title: `Change ${target}'s role`,
      description:
        value.role === "owner"
          ? `Grant ${target} owner access to ${namespace.value?.name ?? routeNamespace.value}? Owners can manage all members and invitations.`
          : `Change ${target} to maintainer? They will no longer be able to manage members or invitations.`,
      label: `Change to ${dashboardRoleLabel(value.role)}`,
      destructive: value.role === "maintainer",
    };
  }
  if (value.kind === "remove") {
    const self = isCurrentUser(value.member);
    return {
      title: self ? "Leave namespace" : "Remove namespace member",
      description: self
        ? `Leave ${namespace.value?.name ?? routeNamespace.value}? You will lose access until an owner invites you again.`
        : `Remove ${namespaceUserLabel(value.member.user)} from ${namespace.value?.name ?? routeNamespace.value}? They will lose publication and management access.`,
      label: self ? "Leave namespace" : "Remove member",
      destructive: true,
    };
  }
  return {
    title: "Revoke namespace invitation",
    description: `Revoke the invitation for ${namespaceUserLabel(value.invitation.invited_user)}? You can send another invitation later.`,
    label: "Revoke invitation",
    destructive: true,
  };
});

useSeoMeta({
  title: () => `${namespace.value?.name ?? routeNamespace.value} management · Rux Package Registry`,
  description: () =>
    `Manage members and invitations for the ${namespace.value?.name ?? routeNamespace.value} namespace.`,
  robots: "noindex, nofollow",
});

function unavailableFailure(): ApiFailure {
  return {
    title: "Namespace unavailable",
    detail: "This namespace does not exist or you are not a current member.",
    errors: [],
    retryable: false,
  };
}

async function signInAgain() {
  return navigateTo({
    path: "/packages/-/auth/sign-in",
    query: { return_to: route.fullPath },
  });
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

async function loadNamespace() {
  if (activeLoad || auth.status.value !== "authenticated") return activeLoad;

  activeLoad = (async () => {
    loading.value = true;
    failure.value = null;
    actionFailure.value = null;
    try {
      const list = await api.sessionGet<NamespaceListResponse>("/v1/namespaces");
      const membership = list.data.find(
        (item) => normalizedIdentity(item.name) === normalizedIdentity(routeNamespace.value),
      );
      if (!membership) {
        namespace.value = null;
        members.value = [];
        invitations.value = [];
        failure.value = unavailableFailure();
        return;
      }

      namespace.value = membership;
      const basePath = namespaceApiPath(membership.name);
      const memberRequest = api.sessionGet<NamespaceMembersResponse>(`${basePath}/members`);
      const invitationRequest =
        membership.role === "owner"
          ? api.sessionGet<NamespaceInvitationsResponse>(`${basePath}/invitations`)
          : Promise.resolve<NamespaceInvitationsResponse>({
              data: [],
            });
      const [memberResponse, invitationResponse] = await Promise.all([memberRequest, invitationRequest]);
      members.value = memberResponse.data;
      invitations.value = invitationResponse.data;
    } catch (error) {
      const normalized = normalizeApiError(error);
      if (normalized.problem?.code === "authentication_required") {
        const session = await auth.refresh();
        if (!session) await signInAgain();
        else queueMicrotask(() => void loadNamespace());
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

function isCurrentUser(member: NamespaceMember): boolean {
  return member.user.github_login.toLowerCase() === currentLogin.value.toLowerCase();
}

function memberActionDisabled(member: NamespaceMember): boolean {
  if (pendingAction.value) return true;
  if (isCurrentUser(member)) return member.role === "owner" && ownerCount.value <= 1;
  return !isOwner.value;
}

function roleActionDisabled(member: NamespaceMember): boolean {
  return Boolean(pendingAction.value) || !isOwner.value || (member.role === "owner" && ownerCount.value <= 1);
}

function memberActionLabel(member: NamespaceMember): string {
  return isCurrentUser(member) ? "Leave" : "Remove";
}

function requestRoleChange(member: NamespaceMember, role: NamespaceRole) {
  if (role === member.role || roleActionDisabled(member)) return;
  confirmation.value = { kind: "role", member, role };
}

function requestRemoval(member: NamespaceMember) {
  if (memberActionDisabled(member)) return;
  confirmation.value = { kind: "remove", member };
}

function requestRevocation(invitation: NamespaceInvitation) {
  if (!isOwner.value || pendingAction.value) return;
  confirmation.value = { kind: "revoke", invitation };
}

function replaceMember(updated: NamespaceMember) {
  const login = updated.user.github_login.toLowerCase();
  members.value = members.value.map((member) => (member.user.github_login.toLowerCase() === login ? updated : member));
}

async function performRoleChange(value: Extract<Confirmation, { kind: "role" }>) {
  const session = auth.session.value;
  if (!session || !namespace.value) return;
  pendingAction.value = `role:${value.member.user.github_login}`;
  try {
    const response = await api.sessionMutation<NamespaceMemberResponse>(
      `${namespaceApiPath(namespace.value.name)}/members/${encodeURIComponent(value.member.user.github_login)}`,
      "PATCH",
      session.csrf_token,
      { role: value.role },
    );
    replaceMember(response.data);
    if (isCurrentUser(response.data)) {
      namespace.value.role = response.data.role;
      if (response.data.role !== "owner") invitations.value = [];
    }
    confirmation.value = null;
    toast.add({
      title: "Member role updated",
      description: `${namespaceUserLabel(response.data.user)} is now a ${dashboardRoleLabel(response.data.role).toLowerCase()}.`,
      color: "success",
      icon: "i-lucide-circle-check",
    });
  } catch (error) {
    const normalized = normalizeApiError(error);
    if (normalized.problem?.code === "authentication_required") {
      await recoverMutationAuthentication();
      return;
    }
    if (normalized.problem?.code === "last_owner_required") await loadNamespace();
    actionFailure.value = normalized;
    confirmation.value = null;
  } finally {
    pendingAction.value = null;
  }
}

async function performRemoval(value: Extract<Confirmation, { kind: "remove" }>) {
  const session = auth.session.value;
  if (!session || !namespace.value) return;
  pendingAction.value = `remove:${value.member.user.github_login}`;
  try {
    await api.sessionMutation(
      `${namespaceApiPath(namespace.value.name)}/members/${encodeURIComponent(value.member.user.github_login)}`,
      "DELETE",
      session.csrf_token,
    );
    confirmation.value = null;
    if (isCurrentUser(value.member)) {
      toast.add({
        title: "Namespace left",
        description: `You are no longer a member of ${namespace.value.name}.`,
        color: "success",
        icon: "i-lucide-circle-check",
      });
      await navigateTo("/packages/-/dashboard");
      return;
    }
    members.value = members.value.filter((member) => member !== value.member);
    toast.add({
      title: "Member removed",
      description: `${namespaceUserLabel(value.member.user)} no longer has access to ${namespace.value.name}.`,
      color: "success",
      icon: "i-lucide-circle-check",
    });
  } catch (error) {
    const normalized = normalizeApiError(error);
    if (normalized.problem?.code === "authentication_required") {
      await recoverMutationAuthentication();
      return;
    }
    if (normalized.problem?.code === "last_owner_required") await loadNamespace();
    actionFailure.value = normalized;
    confirmation.value = null;
  } finally {
    pendingAction.value = null;
  }
}

async function performRevocation(value: Extract<Confirmation, { kind: "revoke" }>) {
  const session = auth.session.value;
  if (!session || !namespace.value) return;
  pendingAction.value = `revoke:${value.invitation.invited_user.github_login}`;
  try {
    await api.sessionMutation(
      `${namespaceApiPath(namespace.value.name)}/invitations/${encodeURIComponent(value.invitation.invited_user.github_login)}`,
      "DELETE",
      session.csrf_token,
    );
    invitations.value = invitations.value.filter((invitation) => invitation !== value.invitation);
    confirmation.value = null;
    toast.add({
      title: "Invitation revoked",
      description: `The invitation for ${namespaceUserLabel(value.invitation.invited_user)} was removed.`,
      color: "success",
      icon: "i-lucide-circle-check",
    });
  } catch (error) {
    const normalized = normalizeApiError(error);
    if (normalized.problem?.code === "authentication_required") {
      await recoverMutationAuthentication();
      return;
    }
    actionFailure.value = normalized;
    confirmation.value = null;
  } finally {
    pendingAction.value = null;
  }
}

async function confirmAction() {
  const value = confirmation.value;
  if (!value || pendingAction.value) return;
  actionFailure.value = null;
  if (value.kind === "role") await performRoleChange(value);
  else if (value.kind === "remove") await performRemoval(value);
  else await performRevocation(value);
}

function memberInvited(invitation: NamespaceInvitation) {
  invitations.value.unshift(invitation);
  toast.add({
    title: "Invitation sent",
    description: `${namespaceUserLabel(invitation.invited_user)} was invited as a ${dashboardRoleLabel(invitation.role).toLowerCase()}.`,
    color: "success",
    icon: "i-lucide-circle-check",
  });
}

async function retry() {
  if (auth.status.value === "unavailable") await auth.refresh();
  await loadNamespace();
}

watch(
  [() => auth.status.value, routeNamespace],
  ([status]) => {
    if (status === "authenticated") void loadNamespace();
  },
  { immediate: true },
);
</script>

<template>
  <UContainer class="py-8 sm:py-12">
    <UPageHeader
      headline="Namespace management"
      :title="namespace?.name ?? routeNamespace"
      :description="
        namespace ? `Manage access to the ${namespace.name} namespace.` : 'Manage namespace members and invitations.'
      "
    >
      <template #links>
        <UButton
          label="Back to dashboard"
          to="/packages/-/dashboard"
          color="neutral"
          variant="outline"
          icon="i-lucide-arrow-left"
        />
        <UButton
          v-if="namespace"
          label="View packages"
          :to="catalogNamespacePath(namespace.name)"
          color="neutral"
          variant="outline"
          icon="i-lucide-package-search"
        />
      </template>
    </UPageHeader>

    <AppLoadingState v-if="loading && !namespace" label="Loading namespace management" />

    <ApiProblemAlert v-else-if="failure" :failure="failure" @retry="retry" />

    <div v-else-if="namespace" class="space-y-10">
      <UAlert
        v-if="!isOwner"
        color="info"
        variant="subtle"
        icon="i-lucide-info"
        title="Maintainer access"
        description="You can view members, publish packages, and leave this namespace. Only owners can manage roles and invitations."
      />
      <UAlert
        v-else-if="isLastOwner"
        color="warning"
        variant="subtle"
        icon="i-lucide-shield-alert"
        title="Another owner is required"
        description="Invite or promote another owner before you demote yourself or leave this namespace."
      />
      <ApiProblemAlert v-if="visibleActionFailure" :failure="visibleActionFailure" />

      <section aria-labelledby="namespace-members-heading">
        <div class="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 id="namespace-members-heading" class="text-xl font-semibold text-highlighted">Members</h2>
            <p class="mt-1 text-sm text-muted">
              Owners administer access; maintainers can publish packages and manage releases.
            </p>
          </div>
          <UBadge color="neutral" variant="subtle"> Your role: {{ dashboardRoleLabel(namespace.role) }} </UBadge>
        </div>

        <UCard>
          <ul class="divide-y divide-default" aria-label="Namespace members">
            <li
              v-for="member in members"
              :key="member.user.github_login.toLowerCase()"
              class="py-4 first:pt-0 last:pb-0"
            >
              <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div class="flex min-w-0 items-center gap-3">
                  <UAvatar
                    :src="safeAvatarUrl(member.user.avatar_url)"
                    :alt="`${namespaceUserLabel(member.user)} avatar`"
                    :text="userInitials(member.user.display_name, member.user.github_login)"
                    size="sm"
                    :ui="{ fallback: 'text-default' }"
                  />
                  <div class="min-w-0">
                    <p class="truncate font-medium text-highlighted">
                      {{ namespaceUserLabel(member.user) }}
                      <span v-if="isCurrentUser(member)" class="text-sm font-normal text-muted">(you)</span>
                    </p>
                    <p class="truncate text-sm text-muted">@{{ member.user.github_login }}</p>
                    <p class="mt-1 text-xs text-muted">
                      Joined
                      <time :datetime="member.created_at">{{ formatDashboardTimestamp(member.created_at) }} UTC</time>
                    </p>
                  </div>
                </div>

                <div class="flex flex-wrap items-center gap-2 lg:justify-end">
                  <USelect
                    :model-value="member.role"
                    :items="namespaceRoleOptions"
                    value-key="value"
                    label-key="label"
                    class="w-36"
                    :disabled="roleActionDisabled(member)"
                    :aria-label="`Role for ${namespaceUserLabel(member.user)}`"
                    @update:model-value="(role) => requestRoleChange(member, role as NamespaceRole)"
                  />
                  <UButton
                    :label="memberActionLabel(member)"
                    color="error"
                    variant="outline"
                    size="sm"
                    :disabled="memberActionDisabled(member)"
                    :aria-label="`${memberActionLabel(member)} ${namespaceUserLabel(member.user)} from ${namespace.name}`"
                    @click="requestRemoval(member)"
                  />
                </div>
              </div>
              <p v-if="!isOwner && !isCurrentUser(member)" class="mt-2 text-xs text-muted lg:text-right">
                Only namespace owners can change or remove this member.
              </p>
              <p v-else-if="member.role === 'owner' && ownerCount <= 1" class="mt-2 text-xs text-muted lg:text-right">
                The final owner cannot be demoted or removed.
              </p>
            </li>
          </ul>
        </UCard>
      </section>

      <section aria-labelledby="namespace-invitations-heading">
        <div class="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 id="namespace-invitations-heading" class="text-xl font-semibold text-highlighted">
              Pending invitations
            </h2>
            <p class="mt-1 text-sm text-muted">Invitations expire seven days after they are sent.</p>
          </div>
          <UButton
            label="Invite member"
            icon="i-lucide-user-plus"
            :disabled="!isOwner || pendingAction !== null"
            @click="inviteOpen = true"
          />
        </div>

        <UAlert
          v-if="!isOwner"
          color="neutral"
          variant="subtle"
          icon="i-lucide-lock"
          title="Owner access required"
          description="Pending invitations are visible only to namespace owners."
        />
        <UEmpty
          v-else-if="!invitations.length"
          icon="i-lucide-mail-check"
          title="No pending invitations"
          description="Invite an existing registry user when you are ready to collaborate."
          variant="subtle"
        />
        <UCard v-else>
          <ul class="divide-y divide-default" aria-label="Pending namespace invitations">
            <li
              v-for="invitation in invitations"
              :key="`${invitation.invited_user.github_login}:${invitation.created_at}`"
              class="py-4 first:pt-0 last:pb-0"
            >
              <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p class="font-medium text-highlighted">
                    {{ namespaceUserLabel(invitation.invited_user) }}
                  </p>
                  <p class="mt-1 text-sm text-muted">@{{ invitation.invited_user.github_login }}</p>
                  <p class="mt-2 text-xs text-muted">
                    Invited as
                    {{ dashboardRoleLabel(invitation.role).toLowerCase() }}
                    · Expires
                    <time :datetime="invitation.expires_at"
                      >{{ formatDashboardTimestamp(invitation.expires_at) }} UTC</time
                    >
                  </p>
                </div>
                <UButton
                  label="Revoke"
                  color="error"
                  variant="outline"
                  size="sm"
                  :disabled="pendingAction !== null"
                  :aria-label="`Revoke invitation for ${namespaceUserLabel(invitation.invited_user)}`"
                  @click="requestRevocation(invitation)"
                />
              </div>
            </li>
          </ul>
        </UCard>
      </section>
    </div>

    <InviteNamespaceMemberModal
      v-if="namespace"
      v-model:open="inviteOpen"
      :namespace="namespace.name"
      @invited="memberInvited"
      @authentication-required="recoverMutationAuthentication"
    />

    <ConfirmActionModal
      :open="confirmation !== null"
      :title="confirmationContent.title"
      :description="confirmationContent.description"
      :confirm-label="confirmationContent.label"
      :destructive="confirmationContent.destructive"
      :pending="pendingAction !== null"
      @update:open="
        (open) => {
          if (!open) confirmation = null;
        }
      "
      @confirm="confirmAction"
    />
  </UContainer>
</template>
