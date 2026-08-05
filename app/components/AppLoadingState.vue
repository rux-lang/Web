<script setup lang="ts">
/**
 * The registry's shared loading state.
 *
 * A spinner alongside skeleton placeholders: the spinner says "something is
 * happening" the instant the request starts, while the skeletons hold the
 * layout so the page does not jump when the data lands.
 */
withDefaults(
  defineProps<{
    label?: string;
  }>(),
  {
    label: "Loading content",
  },
);
</script>

<template>
  <section role="status" aria-live="polite" aria-busy="true" class="space-y-5">
    <p class="text-muted flex items-center gap-2 text-sm font-medium">
      <!-- aria-hidden: the spinner is decoration, the label already announces
           the state to assistive technology. -->
      <UIcon name="i-lucide-loader-circle" class="size-4 shrink-0 animate-spin" aria-hidden="true" />
      {{ label }}
    </p>

    <div aria-hidden="true" class="space-y-3">
      <USkeleton class="h-6 w-2/5" />
      <USkeleton class="h-4 w-full" />
      <USkeleton class="h-4 w-4/5" />
      <div class="grid gap-4 pt-3 sm:grid-cols-2 lg:grid-cols-3">
        <USkeleton v-for="item in 3" :key="item" class="h-28 w-full" />
      </div>
    </div>
  </section>
</template>
