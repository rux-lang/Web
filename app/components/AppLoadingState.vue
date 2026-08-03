<script setup lang="ts">
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
    <p class="text-sm font-medium text-muted">
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
