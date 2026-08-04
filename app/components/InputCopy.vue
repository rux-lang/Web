<script setup lang="ts">
/**
 * A read-only command line with click-to-copy — nuxt.com's UInputCopy.
 *
 * Renamed off the `U` prefix so it does not read as a Nuxt UI component.
 *
 * nuxt.com leans on VueUse's `useClipboard` for the `copied` flag and its
 * auto-reset; this site has no @vueuse/core dependency, so the flag is a local
 * ref on a timer and the copy goes straight to the Clipboard API — the same
 * trade-off already made in DesignKitColorCard.vue. That API is undefined
 * outside a secure context, hence the explicit failure toast.
 */
const props = withDefaults(
  defineProps<{
    value: string;
    label?: string;
    size?: "lg" | "xl";
  }>(),
  { label: undefined, size: "lg" },
);

const toast = useToast();
const copied = ref(false);
let resetTimer: ReturnType<typeof setTimeout> | undefined;

async function copyValue() {
  try {
    await navigator.clipboard.writeText(props.value);
    copied.value = true;
    clearTimeout(resetTimer);
    resetTimer = setTimeout(() => (copied.value = false), 1500);
  } catch {
    toast.add({
      title: "Could not copy",
      description: `Copy it by hand: ${props.value}`,
      icon: "i-lucide-copy-x",
      color: "error",
    });
  }
}

onBeforeUnmount(() => clearTimeout(resetTimer));
</script>

<template>
  <UInput
    :model-value="label ?? value"
    :size="size"
    readonly
    icon="i-lucide-terminal"
    class="w-full"
    :aria-label="`Copy ${value}`"
    :ui="{ base: copied ? 'ring-primary cursor-copy' : 'cursor-copy' }"
    @click="copyValue"
  >
    <template #trailing>
      <UButton
        :icon="copied ? 'i-lucide-copy-check' : 'i-lucide-copy'"
        color="neutral"
        variant="link"
        :class="copied ? 'text-primary' : ''"
        :aria-label="`Copy ${value}`"
        @click.stop="copyValue"
      />
    </template>
  </UInput>
</template>
