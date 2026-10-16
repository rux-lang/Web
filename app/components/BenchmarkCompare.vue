<script setup lang="ts">
/**
 * "Rux compared with …": picks the one language the charts draw in the second
 * hue. Both benchmarks on the page share the choice, so each part shows this
 * same picker bound to the same value.
 */
import type { BenchmarkLanguage } from "~/types/benchmarks";

defineProps<{ options: BenchmarkLanguage[] }>();
const model = defineModel<string>({ required: true });
</script>

<template>
  <div class="flex flex-wrap items-center gap-x-2 gap-y-2" role="group" aria-label="Compare Rux with">
    <span class="mr-1 inline-flex items-center gap-1.5 text-sm text-toned">
      <span class="inline-block size-3 rounded-full bg-(--bench-rux)" aria-hidden="true" />
      Rux compared with
    </span>
    <UButton
      v-for="language in options"
      :key="language.key"
      size="xs"
      color="neutral"
      :variant="language.key === model ? 'solid' : 'outline'"
      :aria-pressed="language.key === model"
      @click="model = language.key"
    >
      <span
        v-if="language.key === model"
        class="inline-block size-2 rounded-full bg-(--bench-compare) ring-1 ring-(--ui-bg)"
        aria-hidden="true"
      />
      {{ language.label }}
    </UButton>
  </div>
</template>
