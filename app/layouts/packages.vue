<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";
import { computed } from "vue";

const route = useRoute();
const canonicalUrl = computed(() => new URL(route.path, "https://rux-lang.dev").toString());
const privateRoute = computed(() => /^\/packages\/-\/(?:auth|dashboard|search)(?:\/|$)/.test(route.path));

useHead(() => ({
  link: [{ rel: "canonical", href: canonicalUrl.value }],
  meta: privateRoute.value ? [{ name: "robots", content: "noindex, nofollow" }] : [],
}));

const navigationItems = computed<NavigationMenuItem[]>(() => [
  {
    label: "Overview",
    icon: "i-lucide-package",
    to: "/packages",
    exact: true,
  },
  {
    label: "Search",
    icon: "i-lucide-search",
    to: "/packages/-/search",
  },
  {
    label: "Keywords",
    icon: "i-lucide-tags",
    to: "/packages/-/keywords",
  },
  {
    label: "Dashboard",
    icon: "i-lucide-layout-dashboard",
    to: "/packages/-/dashboard",
    active: route.path.startsWith("/packages/-/dashboard"),
  },
]);
</script>

<template>
  <div class="registry-shell min-h-[60vh]">
    <a class="skip-link" href="#registry-content">Skip to registry content</a>

    <div class="border-b border-default bg-default/80 backdrop-blur">
      <UContainer class="flex min-h-14 items-center justify-between gap-4 py-2">
        <UNavigationMenu aria-label="Package registry navigation" :items="navigationItems" class="min-w-0" />
        <AppAccountMenu />
      </UContainer>
    </div>

    <div id="registry-content" tabindex="-1">
      <NuxtErrorBoundary>
        <slot />

        <template #error="{ clearError }">
          <UContainer class="py-12 sm:py-20">
            <AppErrorState
              title="This registry page could not be displayed"
              description="An unexpected error interrupted this page. Try again, or return to packages."
              retryable
              @retry="clearError"
              @home="
                () => {
                  clearError();
                  navigateTo('/packages');
                }
              "
            />
          </UContainer>
        </template>
      </NuxtErrorBoundary>
    </div>
  </div>
</template>
