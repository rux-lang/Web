<script setup lang="ts">
import { computed } from "vue";
import type { HighlightPackage, PackageSearchResult } from "~/types/catalog";
import { catalogNamespacePath, catalogPackagePath, formatPublishedAt, packageTypeLabel } from "~/utils/catalog";

const props = defineProps<{
  item: PackageSearchResult | HighlightPackage;
  showDownloads?: boolean;
}>();

const isYanked = computed(() => "yanked" in props.item && props.item.yanked);
const downloads = computed(() => ("downloads_30d" in props.item ? props.item.downloads_30d : null));
</script>

<template>
  <UPageCard
    :to="catalogPackagePath(item)"
    :title="item.package"
    :description="item.description || 'No package description provided.'"
    variant="outline"
    class="h-full"
    :ui="{ title: 'break-all' }"
  >
    <template #header>
      <div class="relative z-10 flex flex-wrap items-center gap-2">
        <UButton
          :label="item.namespace"
          :to="catalogNamespacePath(item.namespace)"
          color="neutral"
          variant="link"
          size="xs"
          class="min-h-6 p-0"
        />
        <span aria-hidden="true" class="text-dimmed">/</span>
        <span class="text-sm text-muted">{{ item.version }}</span>
      </div>
    </template>

    <template #footer>
      <div class="flex flex-wrap items-center gap-2 text-sm text-muted">
        <UBadge color="neutral" variant="subtle">
          {{ packageTypeLabel(item.package_type) }}
        </UBadge>
        <UBadge v-if="isYanked" color="warning" variant="subtle"> Yanked </UBadge>
        <span>Published {{ formatPublishedAt(item.published_at) }}</span>
        <span v-if="showDownloads && downloads !== null">
          {{ downloads.toLocaleString("en") }} downloads in 30 days
        </span>
      </div>
    </template>
  </UPageCard>
</template>
