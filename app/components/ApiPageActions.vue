<script setup lang="ts">
import type { DropdownMenuItem } from "@nuxt/ui";

const props = defineProps<{
  markdownUrl: string;
}>();

const toast = useToast();
const copied = ref(false);
const isCopying = ref(false);
let resetTimer: ReturnType<typeof setTimeout> | undefined;

async function writeClipboard(value: string, description: string) {
  try {
    await navigator.clipboard.writeText(value);
    copied.value = true;
    clearTimeout(resetTimer);
    resetTimer = setTimeout(() => (copied.value = false), 1500);
    toast.add({
      title: "Copied to clipboard",
      description,
      icon: "i-lucide-copy-check",
      color: "success",
    });
  } catch {
    toast.add({
      title: "Could not copy",
      description: "Open the Markdown source and copy it manually.",
      icon: "i-lucide-copy-x",
      color: "error",
    });
  }
}

async function copyPage() {
  isCopying.value = true;

  try {
    const markdown = await $fetch<string>(props.markdownUrl);
    await writeClipboard(markdown, "Page Markdown");
  } catch {
    toast.add({
      title: "Could not load page Markdown",
      description: "Use View as Markdown from the menu instead.",
      icon: "i-lucide-file-warning",
      color: "error",
    });
  } finally {
    isCopying.value = false;
  }
}

const prompt = computed(() => `Read ${props.markdownUrl} so I can ask questions about it.`);

const items = computed<DropdownMenuItem[][]>(() => [
  [
    {
      label: "Copy Markdown link",
      icon: "i-lucide-link",
      onSelect: () => writeClipboard(props.markdownUrl, "Markdown link"),
    },
    {
      label: "View as Markdown",
      icon: "i-simple-icons-markdown",
      to: props.markdownUrl,
      target: "_blank",
    },
    {
      label: "Open in ChatGPT",
      icon: "i-simple-icons-openai",
      to: `https://chatgpt.com/?hints=search&q=${encodeURIComponent(prompt.value)}`,
      target: "_blank",
    },
    {
      label: "Open in Claude",
      icon: "i-simple-icons-anthropic",
      to: `https://claude.ai/new?q=${encodeURIComponent(prompt.value)}`,
      target: "_blank",
    },
  ],
]);

onBeforeUnmount(() => clearTimeout(resetTimer));
</script>

<template>
  <UFieldGroup>
    <UButton
      label="Copy page"
      :icon="copied ? 'i-lucide-clipboard-check' : 'i-lucide-clipboard'"
      color="neutral"
      variant="soft"
      size="sm"
      :loading="isCopying"
      :ui="{ leadingIcon: 'size-3.5' }"
      @click="copyPage"
    />

    <UDropdownMenu
      :items="items"
      size="sm"
      :content="{ align: 'end', side: 'bottom', sideOffset: 8 }"
      :ui="{ content: 'w-52' }"
    >
      <UButton
        icon="i-lucide-chevron-down"
        size="sm"
        color="neutral"
        variant="soft"
        class="border-l border-muted"
        aria-label="Open copy options"
        :ui="{ leadingIcon: 'size-3.5' }"
      />
    </UDropdownMenu>
  </UFieldGroup>
</template>
