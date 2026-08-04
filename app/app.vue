<script setup lang="ts">
const { data: navigation } = await useAsyncData("navigation", () => queryCollectionNavigation("docs"));
provide("navigation", navigation);

// The search index is fetched client-side on first use rather than
// baked into all 549 prerendered payloads. The content DB is ~515 KB for the
// whole site, comfortably under the threshold that would force narrowing.
const { data: searchFiles } = useLazyAsyncData("search", () => queryCollectionSearchSections("docs"), {
  server: false,
});

useHead({
  htmlAttrs: { lang: "en" },
});

// `d` toggles the theme from anywhere, as on nuxt.com — declared at the root so
// it works on every page, not only where the header button is in view.
// defineShortcuts ignores keystrokes aimed at an input, so typing a "d" into
// the search dialog or a registry form does not flip the site to dark.
const colorMode = useColorMode();

defineShortcuts({
  d: {
    handler: () => {
      colorMode.preference = colorMode.value === "dark" ? "light" : "dark";
    },
  },
});

// nuxt.com drives the hero wash from its `default.vue` layout; this app keeps
// the header/footer chrome in app.vue instead, so it is wired here. Pages opt
// into an opacity with `definePageMeta({ heroBackground: "opacity-30" })` —
// absent the key, the gradient renders at full strength.
const route = useRoute();
const heroBackgroundClass = computed(() => route.meta?.heroBackground ?? "");
</script>

<template>
  <UApp>
    <AppHeader />
    <UMain class="relative">
      <HeroBackground class="absolute -top-px -z-10 w-full shrink-0 text-primary" :class="heroBackgroundClass" />
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </UMain>
    <AppFooter />
    <ClientOnly>
      <LazyUContentSearch :files="searchFiles" :navigation="navigation" />
    </ClientOnly>
  </UApp>
</template>
