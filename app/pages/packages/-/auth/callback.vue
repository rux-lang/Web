<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import type { AuthenticationFlowFailure } from "~/types/auth";
import { callbackFailure, clearReturnPath, consumeReturnPath, storedReturnPath } from "~/utils/auth";
definePageMeta({ layout: "packages" });

useSeoMeta({
  title: "Completing sign in · Rux Package Registry",
  description: "Completing GitHub sign in for the Rux package registry.",
  robots: "noindex, nofollow",
});

const route = useRoute();
const auth = useCurrentUser();
const flowFailure = ref<AuthenticationFlowFailure | null>(callbackFailure(route.query.error));
const processing = ref(flowFailure.value === null);
const apiFailure = computed(() => (auth.status.value === "unavailable" ? auth.failure.value : null));

function browserStorage(): Storage | null {
  return typeof sessionStorage === "undefined" ? null : sessionStorage;
}

function pendingReturnPath(): string {
  const storage = browserStorage();
  return storage ? storedReturnPath(storage, window.location.origin) : "/packages";
}

async function finishSignIn() {
  processing.value = true;
  flowFailure.value = null;
  const session = await auth.refresh();
  if (session) {
    const storage = browserStorage();
    const returnPath = storage ? consumeReturnPath(storage, window.location.origin) : "/packages";
    await navigateTo(returnPath, { replace: true });
    return;
  }

  processing.value = false;
  if (auth.status.value !== "unavailable") {
    flowFailure.value = {
      title: "Sign-in did not complete",
      description: "The registry could not find an active session. Start a new GitHub sign-in attempt.",
      retryable: true,
    };
  }
}

function retryOAuth() {
  return auth.startSignIn(pendingReturnPath());
}

function returnHome() {
  const storage = browserStorage();
  if (storage) clearReturnPath(storage);
  return navigateTo("/packages", { replace: true });
}

onMounted(() => {
  if (!flowFailure.value) void finishSignIn();
});
</script>

<template>
  <UContainer class="flex min-h-[70vh] items-center justify-center py-12 sm:py-20">
    <div class="w-full max-w-xl">
      <AppLoadingState v-if="processing" label="Completing GitHub sign in" />

      <ApiProblemAlert v-else-if="apiFailure" :failure="apiFailure" @retry="finishSignIn" />

      <UAlert
        v-else-if="flowFailure"
        as="section"
        role="alert"
        aria-live="assertive"
        color="error"
        variant="subtle"
        icon="i-lucide-circle-alert"
        :title="flowFailure.title"
        :description="flowFailure.description"
      >
        <template #actions>
          <UButton
            v-if="flowFailure.retryable"
            label="Try GitHub sign-in again"
            color="error"
            variant="outline"
            icon="i-lucide-refresh-cw"
            @click="retryOAuth"
          />
          <UButton label="Return home" color="neutral" variant="ghost" @click="returnHome" />
        </template>
      </UAlert>
    </div>
  </UContainer>
</template>
