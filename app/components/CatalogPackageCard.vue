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
    return { count: props.item.downloads_total, label: "downloads", window: null };
  }
  if ("downloads_30d" in props.item && props.item.downloads_30d !== null) {
    return { count: props.item.downloads_30d, label: "downloads in 30 days", window: "30d" };
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
      <div class="space-y-3">
        <div class="flex flex-wrap items-center gap-2">
          <UBadge color="neutral" variant="subtle">
            {{ packageTypeLabel(item.package_type) }}
          </UBadge>
          <UBadge v-if="isYanked" color="warning" variant="subtle"> Yanked </UBadge>
        </div>

        <div class="flex items-center justify-between gap-4 text-sm text-muted">
          <span class="inline-flex min-w-0 items-center gap-1.5">
            <UIcon name="i-lucide-calendar-days" class="size-4 shrink-0" aria-hidden="true" />
            <span><span class="sr-only">Published </span>{{ formatPublishedAt(item.published_at) }}</span>
          </span>
          <span v-if="showDownloads && downloads" class="inline-flex shrink-0 items-center gap-1.5">
            <UIcon name="i-lucide-download" class="size-4" aria-hidden="true" />
            <span>
              {{ downloads.count.toLocaleString("en") }}
              <span v-if="downloads.window" aria-hidden="true" class="text-dimmed">/ {{ downloads.window }}</span>
              <span class="sr-only">{{ ` ${downloads.label}` }}</span>
            </span>
          </span>
        </div>
      </div>
    </template>
  </UPageCard>
</template>
