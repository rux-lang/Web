<script setup lang="ts">
/**
 * The "Ask Ruxy" header button and its panel — nuxt.com's AgentChatButton and
 * AgentPanel, minus the agent.
 *
 * nuxt.com's panel is a whole subsystem (chat history, streaming messages, a
 * prompt box backed by their Eve runtime). None of that exists here yet, so the
 * panel opens onto a placeholder that says so and points at the things that do
 * work today.
 *
 * The trigger is a plain button with `@click` rather than USlideover's default
 * trigger slot: that slot renders through `asChild`, and nesting it inside
 * another wrapper component makes the ref forwarding fragile for no gain.
 *
 * nuxt.com wraps both in motion-v animations; this site has no motion-v
 * dependency, so they simply render.
 */
const open = ref(false);
</script>

<template>
  <UButton
    color="neutral"
    variant="ghost"
    label="Ask Ruxy"
    aria-label="Ask Ruxy"
    class="max-sm:p-1.5"
    :ui="{ base: 'gap-2 px-3 py-1', label: 'hidden sm:inline-flex' }"
    @click="open = true"
  >
    <template #leading>
      <span class="inline-flex size-6 shrink-0 items-center justify-center max-sm:size-5">
        <img src="/images/mascot.svg" alt="" aria-hidden="true" class="size-6 max-sm:size-5" />
      </span>
    </template>
  </UButton>

  <USlideover v-model:open="open" side="right" title="Ruxy">
    <template #title>
      <span class="inline-flex min-w-0 items-center gap-2">
        <img src="/images/mascot.svg" alt="" aria-hidden="true" class="size-5 shrink-0" />
        <span class="truncate">Ruxy</span>
        <UBadge variant="subtle" size="sm" class="shrink-0">Coming soon</UBadge>
      </span>
    </template>

    <template #body>
      <div class="flex h-full flex-col items-center justify-center gap-4 text-center">
        <img src="/images/mascot.svg" alt="" aria-hidden="true" class="h-32 w-auto opacity-90" />

        <div class="space-y-2">
          <p class="text-highlighted text-lg font-semibold">Ruxy is still being built</p>
          <p class="text-muted text-sm text-pretty">
            The Rux assistant will answer questions about the language, the standard library and the tooling. It is not
            ready yet.
          </p>
        </div>

        <div class="flex flex-wrap items-center justify-center gap-2">
          <UButton label="Search the docs" icon="i-lucide-search" color="neutral" variant="subtle" to="/docs" />
          <UButton label="Ask the community" icon="i-lucide-users" color="neutral" variant="subtle" to="/community" />
        </div>
      </div>
    </template>
  </USlideover>
</template>
