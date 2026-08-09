<script setup lang="ts">
/**
 * One tile in the home page's editor bento.
 *
 * Extracted from index.vue because the grid renders it from two separate
 * columns (3 left, 3 right) and the markup would otherwise be duplicated.
 *
 * An editor with a `to` links straight to its extension listing; one without
 * has no published extension yet and renders unlinked with a badge.
 */
defineProps<{
  editor: { name: string; icon: string; iconClass?: string; to?: string; cta?: string };
  index: number;
}>();
</script>

<template>
  <!--
    Motion renders its own wrapper here rather than `as-child`. UPageCard
    forwards $attrs to its inner stretched-link <a> when `to` is set, so
    as-child lands the animation's `transform` on that anchor — which makes the
    anchor the containing block for its own `absolute inset-0` overlay,
    collapsing it to zero width and killing the card's click target.
  -->
  <Motion
    class="flex flex-1"
    :initial="{ opacity: 0, transform: 'translateY(10px)' }"
    :while-in-view="{ opacity: 1, transform: 'translateY(0)' }"
    :transition="{ delay: 0.1 * index }"
    :in-view-options="{ once: true }"
  >
    <UPageCard class="flex-1" variant="subtle" :to="editor.to" :target="editor.to ? '_blank' : undefined">
      <div class="flex items-center gap-3">
        <!-- The boxed mark is nuxt.com's stat-tile treatment: a bordered,
             default-background square that keeps six brand glyphs of differing
             weight and aspect reading as one set. -->
        <div class="border-default bg-default flex shrink-0 items-center justify-center rounded-lg border p-2">
          <UIcon :name="editor.icon" class="size-6" :class="editor.iconClass" />
        </div>

        <div class="flex min-w-0 flex-col items-start gap-1">
          <span class="text-highlighted font-semibold">{{ editor.name }}</span>

          <!-- The whole card is the link, so this is styling, not a nested
               anchor — the arrow is what makes it read as one. -->
          <p v-if="editor.cta" class="text-primary inline-flex items-center gap-0.5 text-sm">
            {{ editor.cta }}
            <UIcon name="i-lucide-arrow-up-right" class="size-3.5" />
          </p>

          <UBadge v-else variant="subtle" color="neutral" size="sm">Coming soon</UBadge>
        </div>
      </div>
    </UPageCard>
  </Motion>
</template>
