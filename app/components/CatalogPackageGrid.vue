<script setup lang="ts">
import type { HighlightPackage, PackageSearchResult } from "~/types/catalog";

defineProps<{
  items: (PackageSearchResult | HighlightPackage)[];
  showDownloads?: boolean;
}>();
</script>

<template>
  <UPageGrid>
    <CatalogPackageCard
      v-for="item in items"
      :key="`${item.namespace}/${item.package}`"
      :item="item"
      :show-downloads="showDownloads"
    />
  </UPageGrid>
</template>
