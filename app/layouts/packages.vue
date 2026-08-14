<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";
import { computed } from "vue";

const route = useRoute();
const canonicalUrl = computed(() => new URL(route.path, "https://rux-lang.dev").toString());
const privateRoute = computed(() => /^\/packages\/-\/(?:auth|dashboard)(?:\/|$)/.test(route.path));

useHead(() => ({
  link: [{ rel: "canonical", href: canonicalUrl.value }],
  meta: privateRoute.value ? [{ name: "robots", content: "noindex, nofollow" }] : [],
}));

const { user } = useCurrentUser();

/**
 * Dashboard is only reachable with a session — the route is behind the
 * `authenticated` middleware — so it is hidden until one exists rather than
 * offered and then bounced to sign-in.
 *
 * `user` is null during prerender and until the session check resolves, so the
 * static HTML never ships the link and it appears after hydration for signed-in
 * visitors.
 */
const navigationItems = computed<NavigationMenuItem[]>(() => [
  {
    label: "Browse",
    icon: "i-lucide-package",
    to: "/packages",
    // Matched on the path alone: the catalog carries its search, filters, sort
    // and page in the query string, and an exact match would drop the highlight
    // the moment any of them was set.
    active: route.path === "/packages",
  },
  {
    label: "Keywords",
    icon: "i-lucide-tags",
    to: "/packages/-/keywords",
  },
  ...(user.value
    ? [
        {
          label: "Dashboard",
          icon: "i-lucide-layout-dashboard",
          to: "/packages/-/dashboard",
          active: route.path.startsWith("/packages/-/dashboard"),
        },
      ]
    : []),
]);
</script>

<template>
  <NuxtLayout name="default">
    <!--
      The site chrome lives in the `default` layout, and Nuxt applies exactly one
      layout per page — so without nesting it here the registry would render with
      no header or footer. `default` renders its <slot/>, which is what this fills.
    -->
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
  </NuxtLayout>
</template>
