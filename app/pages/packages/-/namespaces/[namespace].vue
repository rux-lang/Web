<script setup lang="ts">
definePageMeta({ layout: "packages" });
const route = useRoute();
const namespace = computed(() => {
  const value = route.params.namespace;
  return Array.isArray(value) ? (value[0] ?? "") : value;
});

useSeoMeta({
  title: () => `${namespace.value} packages · Rux Package Registry`,
  description: () => `Browse packages published in the ${namespace.value} namespace.`,
});
</script>

<template>
  <UContainer class="py-8 sm:py-12">
    <UPageHeader
      headline="Namespace"
      :title="namespace"
      :description="`Packages published in the ${namespace} namespace.`"
    >
      <template #links>
        <UButton
          label="Browse all packages"
          to="/packages"
          color="neutral"
          variant="outline"
          icon="i-lucide-package-search"
        />
      </template>
    </UPageHeader>

    <CatalogExplorer :path="route.path" :fixed-namespace="namespace" show-query :show-namespace="false" />
  </UContainer>
</template>
