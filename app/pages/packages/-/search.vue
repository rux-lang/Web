<script setup lang="ts">
definePageMeta({ layout: "packages" });
useSeoMeta({
  title: "Search · Rux Package Registry",
  description: "Search the Rux package registry.",
  robots: "noindex",
});
</script>

<template>
  <UContainer class="py-8 sm:py-12">
    <UPageHeader
      headline="Catalog"
      title="Search packages"
      description="Find packages by name, namespace, or keyword."
    />
    <CatalogExplorer path="/packages/-/search" show-query require-query />
  </UContainer>
</template>
