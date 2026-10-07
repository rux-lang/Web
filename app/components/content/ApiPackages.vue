<script setup lang="ts">
/**
 * The package grid on the /docs/api hub, used in Markdown as `:api-packages`.
 *
 * One section per hub area, in the order of scripts/api-packages.mjs, with a
 * card for every package the registry lists — the same subtle UPageCard the
 * /docs/lang chapter grid uses. A package links to its overview as soon as the
 * navigation tree has a folder for it, generated from a snapshot or still one
 * of the hand-written 0.3 folders; the rest are muted, unlinked and marked
 * "Reference pending" until the renderer writes them. Folders the registry
 * does not list close the grid under "Other packages".
 *
 * Versions come from each overview page (useApiPackages), so a card shows one
 * only once there is a page to take it from.
 */
const { areas } = useApiPackages();
</script>

<template>
  <div class="not-prose my-8 space-y-10">
    <section v-for="area in areas" :key="area.slug" :aria-labelledby="`area-${area.slug}`">
      <h3 :id="`area-${area.slug}`" class="mb-4 flex items-center gap-2 text-lg font-semibold text-highlighted">
        <UIcon :name="area.icon" class="size-5 text-primary" />
        {{ area.title }}
      </h3>

      <UPageGrid>
        <UPageCard
          v-for="entry in area.packages"
          :key="entry.slug"
          :to="entry.hasPages ? entry.path : undefined"
          :icon="entry.icon"
          :title="entry.name"
          :description="entry.description"
          variant="subtle"
          :class="entry.hasPages ? undefined : 'opacity-60'"
          :ui="{ footer: 'flex flex-wrap gap-1.5' }"
        >
          <template #footer>
            <UBadge v-if="entry.version" :label="`v${entry.version}`" color="info" variant="subtle" />
            <UBadge v-else-if="!entry.hasPages" label="Reference pending" color="neutral" variant="outline" />
            <UBadge v-if="entry.platform" :label="entry.platform" color="neutral" variant="subtle" />
          </template>
        </UPageCard>
      </UPageGrid>
    </section>
  </div>
</template>
