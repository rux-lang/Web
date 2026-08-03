<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  path: string;
  query: Record<string, string>;
  cursor: string;
  nextCursor: string | null;
}>();

const startTo = computed(() => ({
  path: props.path,
  query: props.query,
}));

const nextTo = computed(() => ({
  path: props.path,
  query: {
    ...props.query,
    ...(props.nextCursor ? { cursor: props.nextCursor } : {}),
  },
}));
</script>

<template>
  <nav
    v-if="cursor || nextCursor"
    aria-label="Catalog pagination"
    class="mt-8 flex flex-wrap items-center justify-between gap-3"
  >
    <UButton
      v-if="cursor"
      label="Start over"
      color="neutral"
      variant="outline"
      icon="i-lucide-chevrons-left"
      :to="startTo"
    />
    <span v-else />
    <UButton v-if="nextCursor" label="Next page" trailing-icon="i-lucide-arrow-right" :to="nextTo" />
  </nav>
</template>
