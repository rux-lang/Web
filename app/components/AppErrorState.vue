<script setup lang="ts">
defineProps<{
  title: string;
  description: string;
  retryable?: boolean;
}>();

defineEmits<{
  retry: [];
  home: [];
}>();
</script>

<template>
  <UEmpty
    as="section"
    role="alert"
    aria-live="assertive"
    icon="i-lucide-triangle-alert"
    :title="title"
    :description="description"
    variant="subtle"
    size="xl"
  >
    <template #actions>
      <UButton v-if="retryable" label="Try again" icon="i-lucide-refresh-cw" @click="$emit('retry')" />
      <UButton label="Return home" color="neutral" variant="outline" icon="i-lucide-house" @click="$emit('home')" />
    </template>
  </UEmpty>
</template>
