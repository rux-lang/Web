<script setup lang="ts">
definePageMeta({ layout: "packages" });
const route = useRoute();
const keyword = computed(() => {
  const value = route.params.keyword;
  return Array.isArray(value) ? (value[0] ?? "") : value;
});

useSeoMeta({
  title: () => `${keyword.value} packages · Rux Package Registry`,
  description: () => `Browse Rux packages tagged with ${keyword.value}.`,
});
</script>

<template>
  <UContainer class="py-8 sm:py-12">
    <UPageHeader headline="Keyword" :title="keyword" :description="`Packages tagged with ${keyword}.`">
      <template #links>
        <UButton
          label="All keywords"
          to="/packages/-/keywords"
          color="neutral"
          variant="outline"
          icon="i-lucide-tags"
        />
      </template>
    </UPageHeader>

    <CatalogExplorer :path="route.path" :fixed-keyword="keyword" show-query :show-keyword="false" />
  </UContainer>
</template>
