<script setup lang="ts">
import { computed, onMounted } from "vue";
import { safeReturnPath } from "~/utils/auth";
definePageMeta({ layout: "packages" });

useSeoMeta({
  title: "Sign in · Rux Package Registry",
  description: "Sign in to manage your Rux registry account.",
  robots: "noindex, nofollow",
});

const route = useRoute();
const auth = useCurrentUser();
const requestedReturn = computed(() => (Array.isArray(route.query.return_to) ? undefined : route.query.return_to));
const returnPath = computed(() => safeReturnPath(requestedReturn.value, window.location.origin));

onMounted(async () => {
  await auth.initialize();
  if (auth.status.value === "authenticated") {
    await navigateTo(returnPath.value, { replace: true });
  }
});

function signIn() {
  return auth.startSignIn(returnPath.value);
}
</script>

<template>
  <UContainer class="flex min-h-[70vh] items-center justify-center py-12 sm:py-20">
    <UPageCard
      class="w-full max-w-md"
      icon="i-lucide-shield-user"
      title="Sign in to Rux Packages"
      description="Use your GitHub account to manage namespaces, packages, and registry access."
    >
      <AppLoadingState
        v-if="auth.status.value === 'loading' || auth.status.value === 'authenticated'"
        label="Checking account status"
      />

      <ApiProblemAlert
        v-else-if="auth.status.value === 'unavailable' && auth.failure.value"
        :failure="auth.failure.value"
        @retry="auth.refresh"
      />

      <div v-else class="space-y-5">
        <UAlert
          v-if="auth.status.value === 'expired'"
          color="warning"
          variant="subtle"
          icon="i-lucide-clock-alert"
          title="Your registry session ended"
          description="Sign in again to continue with owner actions. Public package browsing was not interrupted."
        />

        <UButton block size="lg" label="Continue with GitHub" icon="i-simple-icons-github" @click="signIn" />

        <p class="text-center text-sm text-muted">
          GitHub returns only the identity details needed for your registry account.
        </p>

        <UButton block label="Return without signing in" color="neutral" variant="ghost" :to="returnPath" />
      </div>
    </UPageCard>
  </UContainer>
</template>
