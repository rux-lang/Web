<script setup lang="ts">
import type { ApiFailure } from "~/types/api";

defineProps<{
  failure: ApiFailure;
}>();

defineEmits<{
  retry: [];
}>();
</script>

<template>
  <UAlert
    as="section"
    role="alert"
    aria-live="assertive"
    color="error"
    variant="subtle"
    icon="i-lucide-circle-alert"
    :title="failure.title"
  >
    <template #description>
      <p>{{ failure.detail }}</p>
      <ul v-if="failure.errors.length" class="mt-2 list-disc space-y-1 ps-5">
        <li v-for="(message, index) in failure.errors" :key="`${index}:${message}`">
          {{ message }}
        </li>
      </ul>
    </template>

    <template v-if="failure.retryable" #actions>
      <UButton
        label="Try again"
        color="error"
        variant="outline"
        size="xs"
        icon="i-lucide-refresh-cw"
        @click="$emit('retry')"
      />
    </template>
  </UAlert>
</template>
