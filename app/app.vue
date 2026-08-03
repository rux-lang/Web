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
</script>

<template>
  <UApp>
    <AppHeader />
    <UMain>
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
