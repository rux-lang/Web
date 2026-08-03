<script setup lang="ts">
import { computed, ref } from "vue";
import { formatSessionExpiry } from "~/utils/account";
import { safeAvatarUrl, userInitials } from "~/utils/auth";

definePageMeta({ layout: "packages", middleware: "authenticated" });

useSeoMeta({
  title: "Account settings · Rux Package Registry",
  description: "Review your registry account and manage its lifecycle.",
  robots: "noindex, nofollow",
});

const auth = useCurrentUser();
const toast = useToast();
const deleteOpen = ref(false);
const user = computed(() => auth.user.value);
const displayName = computed(() => user.value?.display_name?.trim() || user.value?.github_login || "");
const avatar = computed(() =>
  user.value
    ? {
        src: safeAvatarUrl(user.value.avatar_url),
        alt: `${displayName.value} avatar`,
        text: userInitials(user.value.display_name, user.value.github_login),
      }
    : undefined,
);

async function retryAccountStatus() {
  await auth.refresh();
}

async function recoverMutationAuthentication() {
  const session = await auth.refresh();
  if (!session) {
    await navigateTo({
      path: "/packages/-/auth/sign-in",
      query: { return_to: "/packages/-/dashboard/settings" },
    });
    return;
  }
  toast.add({
    title: "Session refreshed",
    description: "Review the deletion warning and confirm again when you are ready.",
    color: "info",
    icon: "i-lucide-refresh-cw",
  });
}

async function accountDeleted() {
  toast.add({
    title: "Account deleted",
    description: "Your registry identity was anonymized and your credentials were revoked.",
    color: "success",
    icon: "i-lucide-circle-check",
  });
  await navigateTo("/packages", { replace: true });
}
</script>

<template>
  <UContainer class="py-8 sm:py-12">
    <UPageHeader
      headline="Owner experience"
      title="Account settings"
      description="Review the GitHub identity connected to this registry account and manage its lifecycle."
    >
      <template #links>
        <UButton
          label="Dashboard"
          icon="i-lucide-arrow-left"
          color="neutral"
          variant="outline"
          to="/packages/-/dashboard"
        />
      </template>
    </UPageHeader>

    <ApiProblemAlert
      v-if="auth.status.value === 'unavailable' && auth.failure.value"
      :failure="auth.failure.value"
      @retry="retryAccountStatus"
    />

    <div v-else-if="user && auth.session.value" class="space-y-10">
      <section aria-labelledby="connected-account-heading">
        <div class="mb-5">
          <h2 id="connected-account-heading" class="text-xl font-semibold text-highlighted">Connected account</h2>
          <p class="mt-1 text-sm text-muted">Profile details are refreshed from GitHub when you sign in.</p>
        </div>

        <UCard>
          <div class="flex flex-col gap-5 sm:flex-row sm:items-center">
            <UAvatar v-bind="avatar" size="xl" :ui="{ fallback: 'text-default' }" />
            <div class="min-w-0 flex-1">
              <p class="truncate text-lg font-semibold text-highlighted">
                {{ displayName }}
              </p>
              <p class="truncate text-sm text-muted">@{{ user.github_login }}</p>
              <div class="mt-3 flex flex-wrap gap-2">
                <UBadge color="neutral" variant="subtle" icon="i-simple-icons-github"> Managed by GitHub </UBadge>
                <UBadge color="success" variant="subtle" icon="i-lucide-shield-check"> Signed in </UBadge>
              </div>
            </div>
          </div>

          <USeparator class="my-5" />

          <dl class="grid gap-4 text-sm sm:grid-cols-2">
            <div>
              <dt class="text-muted">Authentication provider</dt>
              <dd class="mt-1 font-medium text-default">GitHub</dd>
            </div>
            <div>
              <dt class="text-muted">Current session expires</dt>
              <dd class="mt-1 font-medium text-default">
                <time :datetime="auth.session.value.expires_at">
                  {{ formatSessionExpiry(auth.session.value.expires_at) }}
                  UTC
                </time>
              </dd>
            </div>
          </dl>
        </UCard>
      </section>

      <section aria-labelledby="account-tools-heading">
        <div class="mb-5">
          <h2 id="account-tools-heading" class="text-xl font-semibold text-highlighted">Account tools</h2>
          <p class="mt-1 text-sm text-muted">
            Manage the registry resources and credentials connected to this account.
          </p>
        </div>
        <div class="grid gap-4 sm:grid-cols-2">
          <UPageCard
            title="Owner dashboard"
            description="Review namespaces, packages, invitations, activity, and downloads."
            icon="i-lucide-layout-dashboard"
            to="/packages/-/dashboard"
          />
          <UPageCard
            title="API tokens"
            description="Create scoped credentials and revoke access that is no longer needed."
            icon="i-lucide-key-round"
            to="/packages/-/dashboard/tokens"
          />
        </div>
      </section>

      <section aria-labelledby="danger-zone-heading">
        <div class="mb-5">
          <h2 id="danger-zone-heading" class="text-xl font-semibold text-error">Danger zone</h2>
          <p class="mt-1 text-sm text-muted">Account deletion is permanent and cannot be reversed.</p>
        </div>

        <UCard :ui="{ root: 'ring-error/40' }">
          <div class="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div class="max-w-3xl">
              <h3 class="font-semibold text-highlighted">Delete registry account</h3>
              <p class="mt-2 text-sm text-muted">
                Your identity will be anonymized, credentials revoked, and memberships removed. Published package
                history remains public and immutable. If you are a namespace's final owner, add or promote another owner
                first.
              </p>
            </div>
            <UButton
              label="Delete account"
              icon="i-lucide-trash-2"
              color="error"
              variant="soft"
              class="shrink-0"
              @click="deleteOpen = true"
            />
          </div>
        </UCard>
      </section>
    </div>

    <DeleteAccountModal
      v-if="user"
      v-model:open="deleteOpen"
      :github-login="user.github_login"
      @deleted="accountDeleted"
      @authentication-required="recoverMutationAuthentication"
    />
  </UContainer>
</template>
