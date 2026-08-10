<script setup lang="ts">
import { computed } from "vue";
import type { HighlightPackage, PackageSearchResult } from "~/types/catalog";
import { catalogNamespacePath, catalogPackagePath, formatPublishedAt, packageTypeLabel } from "~/utils/catalog";

const props = defineProps<{
  item: PackageSearchResult | HighlightPackage;
  showDownloads?: boolean;
}>();

const isYanked = computed(() => "yanked" in props.item && props.item.yanked);

/**
 * Search rows carry an all-time count and highlights only a 30-day one, so the
 * card reports whichever the row actually has and labels it accordingly. A
 * lifetime total is the more useful figure when it is available.
 */
const downloads = computed(() => {
  if ("downloads_total" in props.item) {
    return { count: props.item.downloads_total, label: "downloads" };
  }
  if ("downloads_30d" in props.item && props.item.downloads_30d !== null) {
    return { count: props.item.downloads_30d, label: "downloads in 30 days" };
  }
  return null;
});
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
        <span v-if="showDownloads && downloads">
          {{ downloads.count.toLocaleString("en") }} {{ downloads.label }}
        </span>
      </div>
    </template>
  </UPageCard>
</template>
