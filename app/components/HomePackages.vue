<script setup lang="ts">
import type { DataEnvelope, PackageHighlights } from "~/types/catalog";
import { catalogPackagePath } from "~/utils/catalog";

/**
 * The home page's package carousel, modelled on nuxt.com's
 * "Extend Nuxt with plug & play modules" section.
 *
 * The registry is a separate service with no prerender-time access, so this
 * fetches client-side like the rest of `/packages`. Lazy, never awaited: the
 * home page must paint without waiting on the API. See CLAUDE.md.
 */
const api = useRegistryApi();

const { data, status } = useLazyAsyncData<DataEnvelope<PackageHighlights>>(
  "home-popular-packages",
  (_nuxtApp, { signal }) => api.get("/v1/highlights", undefined, signal),
  { server: false },
);

// The endpoint returns ten; nine keeps the carousel to three clean pages of
// three at the `sm:basis-1/3` item width.
const packages = computed(() => (data.value?.data.popular ?? []).slice(0, 9));

const loading = computed(() => status.value === "pending" || status.value === "idle");

// The window is fixed server-side at 30 days (POPULARITY_WINDOW_DAYS), and the
// response field is literally `downloads_30d` — so the copy says 30 days rather
// than implying a range the API cannot produce.
const windowDays = computed(() => data.value?.data.window_days ?? 30);

/**
 * Lucide mark per package kind. Keyed on `package_type` because that is the one
 * classification every release is guaranteed to carry — keywords are free-form
 * and would leave holes.
 */
const TYPE_ICONS: Record<string, string> = {
  library: "i-lucide-package",
  program: "i-lucide-square-terminal",
  source: "i-lucide-file-code-2",
};

const iconFor = (packageType: string) => TYPE_ICONS[packageType] ?? "i-lucide-package";
</script>

<template>
  <UPageSection
    title="Popular Packages"
    :description="`The most downloaded packages in the Rux registry over the last ${windowDays} days.`"
    :links="[
      { label: 'Browse all packages', to: '/packages', icon: 'i-lucide-package-search' },
      { label: 'Explore keywords', to: '/packages/-/keywords', color: 'neutral', variant: 'ghost' },
    ]"
    :ui="{
      root: 'border-t border-default bg-linear-to-b from-muted to-default dark:from-muted/40',
      title: 'text-left',
      description: 'text-left',
      links: 'justify-start',
    }"
  >
    <!-- The registry may be unreachable, or simply empty on a fresh install.
         Neither is worth an error on a marketing page, so the section renders
         its skeletons and then quietly collapses. -->
    <AppLoadingState v-if="loading" label="Loading popular packages" />

    <UCarousel
      v-else-if="packages.length"
      v-slot="{ item }"
      dots
      arrows
      wheel-gestures
      :items="packages"
      class="min-w-0"
      :ui="{
        container: 'ms-0 items-stretch',
        item: 'min-w-0 shrink-0 sm:basis-1/2 lg:basis-1/3 p-2',
        arrows: 'hidden 2xl:block',
      }"
    >
      <UPageCard
        :to="catalogPackagePath(item)"
        :title="`${item.namespace}/${item.package}`"
        :description="item.description ?? undefined"
        variant="subtle"
        class="group min-h-full"
        :ui="{
          title: 'text-base',
          description: 'line-clamp-2 text-muted text-sm',
          container: 'flex flex-col',
          wrapper: 'flex flex-col min-h-0 items-start',
          body: 'flex-none',
          footer: 'w-full mt-auto pt-4',
        }"
      >
        <template #leading>
          <div class="border-default bg-default flex items-center justify-center rounded-lg border p-2">
            <UIcon :name="iconFor(item.package_type)" class="text-muted size-5" />
          </div>
        </template>

        <template #footer>
          <USeparator type="dashed" class="mb-4" />

          <div class="text-muted flex items-center justify-between gap-3">
            <span class="flex items-center gap-1">
              <UIcon name="i-lucide-circle-arrow-down" class="size-4 shrink-0" />
              <span class="text-sm font-medium">{{ item.downloads_30d?.toLocaleString("en") ?? "0" }}</span>
            </span>

            <UBadge :label="item.package_type" variant="subtle" color="neutral" size="sm" class="capitalize" />
          </div>
        </template>
      </UPageCard>
    </UCarousel>
  </UPageSection>
</template>
