<script setup lang="ts">
import { computed } from "vue";
import { exactInstallCommand } from "~/utils/package";

const props = defineProps<{
  namespace: string;
  packageName: string;
  version: string;
}>();

const toast = useToast();
const command = computed(() => exactInstallCommand(props.namespace, props.packageName, props.version));

async function copyCommand() {
  try {
    await navigator.clipboard.writeText(command.value);
    toast.add({
      title: "Install command copied",
      color: "success",
      icon: "i-lucide-copy-check",
    });
  } catch {
    toast.add({
      title: "Could not copy the command",
      description: "Select the command and copy it manually.",
      color: "error",
      icon: "i-lucide-circle-alert",
    });
  }
}
</script>

<template>
  <UCard variant="subtle">
    <template #header>
      <div>
        <h2 class="font-semibold text-highlighted">Add this release</h2>
        <p class="mt-1 text-sm text-muted">Run the following command.</p>
      </div>
    </template>

    <div class="flex items-center gap-2 rounded-md bg-elevated p-2">
      <code class="min-w-0 flex-1 overflow-x-auto px-1 py-1 text-sm text-highlighted">{{ command }}</code>
      <UButton
        color="neutral"
        variant="outline"
        icon="i-lucide-copy"
        aria-label="Copy install command"
        @click="copyCommand"
      />
    </div>
  </UCard>
</template>
