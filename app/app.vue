<script setup lang="ts">
const { data: navigation } = await useAsyncData("navigation", () => queryCollectionNavigation("docs"));
provide("navigation", navigation);

// The search index is fetched client-side on first use rather than
// baked into all 549 prerendered payloads. The content DB is ~515 KB for the
// whole site, comfortably under the threshold that would force narrowing.
const { data: searchFiles } = useLazyAsyncData("search", () => queryCollectionSearchSections("docs"), {
  server: false,
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

// Tints the browser chrome on mobile to match the page. The dark value is the
// `.dark --ui-bg` from main.css (neutral-950) resolved to a literal, because a
// var() reference is meaningless to the OS reading this meta tag.
const themeColor = computed(() => (colorMode.value === "dark" ? "#020617" : "white"));

useHead({
  htmlAttrs: { lang: "en" },
  meta: [{ key: "theme-color", name: "theme-color", content: themeColor }],
});
</script>

<template>
  <!--
    The header/footer chrome lives in layouts/default.vue, as on nuxt.com, so a
    page can opt out of it (or nest another layout inside it) through
    definePageMeta rather than by special-casing the root component.
  -->
  <UApp :tooltip="{ delayDuration: 300 }">
    <NuxtLoadingIndicator color="var(--ui-primary)" />

    <!--
      motion-v defaults to `never`, i.e. it animates regardless of the OS
      setting. `user` makes every <Motion> in the app honour
      prefers-reduced-motion by jumping straight to the final values — the
      staggered entrances on the home page are decorative, so there is nothing
      to lose by skipping them for people who asked not to see movement.
    -->
    <MotionConfig reduced-motion="user">
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </MotionConfig>

    <ClientOnly>
      <LazyUContentSearch :files="searchFiles" :navigation="navigation" />
    </ClientOnly>
  </UApp>
</template>
