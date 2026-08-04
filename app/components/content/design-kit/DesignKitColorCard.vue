<script setup lang="ts">
/**
 * One brand colour swatch on /design-kit, with click-to-copy.
 *
 * nuxt.com's version leans on VueUse's `useClipboard`; this site does not depend
 * on @vueuse/core directly, so the copy goes straight to the async Clipboard API.
 * That API is undefined outside a secure context (plain http:// on a LAN IP),
 * hence the explicit failure toast rather than a silently dead button.
 */
const props = defineProps<{
  name: string;
  background: string;
}>();

const toast = useToast();

async function copyHex() {
  try {
    await navigator.clipboard.writeText(props.background);
    toast.add({
      title: "Copied to clipboard",
      description: props.background,
      icon: "i-lucide-copy-check",
      color: "success",
    });
  } catch {
    toast.add({
      title: "Could not copy",
      description: `Copy it by hand: ${props.background}`,
      icon: "i-lucide-copy-x",
      color: "error",
    });
  }
}
</script>

<template>
  <div class="not-prose">
    <!-- The swatch is decoration: the hex is printed below it as text, so a
         screen reader loses nothing by skipping the empty box. -->
    <UCard class="p-16 sm:p-16" :style="{ background }" aria-hidden="true" />

    <div class="flex items-center justify-between pt-2">
      <h5 class="font-semibold text-highlighted text-base">
        {{ name }}
      </h5>
      <UButton
        variant="link"
        label="Copy"
        size="sm"
        icon="i-lucide-copy"
        :aria-label="`Copy ${name} (${background}) to the clipboard`"
        @click="copyHex"
      />
    </div>
    <p class="text-muted text-sm font-mono">
      {{ background }}
    </p>
  </div>
</template>
