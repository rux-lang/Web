<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    open: boolean;
    title: string;
    description: string;
    confirmLabel: string;
    pending?: boolean;
    destructive?: boolean;
  }>(),
  {
    pending: false,
    destructive: false,
  },
);

const emit = defineEmits<{
  "update:open": [open: boolean];
  confirm: [];
}>();

function setOpen(open: boolean) {
  if (!props.pending) emit("update:open", open);
}
</script>

<template>
  <UModal
    :open="open"
    :title="title"
    :description="description"
    :dismissible="!pending"
    :close="pending ? false : undefined"
    :ui="{ footer: 'justify-end' }"
    @update:open="setOpen"
  >
    <template #footer>
      <UButton label="Cancel" color="neutral" variant="outline" :disabled="pending" @click="setOpen(false)" />
      <UButton
        :label="confirmLabel"
        :color="destructive ? 'error' : 'primary'"
        :loading="pending"
        :disabled="pending"
        @click="emit('confirm')"
      />
    </template>
  </UModal>
</template>
