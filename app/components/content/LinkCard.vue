<script setup lang="ts">
/**
 * A card for one outbound destination — a social account, a chat room, a
 * donation platform, a repository. Used from /community and /support.
 *
 * Lives under app/components/content/ because @nuxt/content registers that
 * directory with `pathPrefix: false`, which is what makes `:link-card`
 * resolvable from Markdown — the same arrangement as the design-kit cards. The
 * directory has to exist when the module runs, so a fresh checkout needs
 * `nuxt prepare` before the component is found.
 *
 * The shape is nuxt.com's "Trusted by developers worldwide" stat card: a subtle
 * UPageCard, a bordered tile holding the brand mark, and a figure set in the
 * highlighted weight beside its unit.
 *
 * `count`/`unit` are **static strings written into the Markdown**, never
 * fetched. The site prerenders to a static host with no server to cache a
 * rate-limited follower count on — the same reason the header's GitHub star
 * count is a build-time constant. Refresh them by editing the Markdown. Where a
 * figure makes no sense (a donation platform), `note` takes its place.
 *
 * `color` is a full Tailwind class (`text-red-500`), never assembled from
 * fragments — Tailwind scans Markdown as plain text, so the literal has to
 * appear in the source.
 */
defineProps<{
  name: string;
  description: string;
  icon: string;
  to: string;
  handle?: string;
  count?: string;
  unit?: string;
  note?: string;
  color?: string;
}>();
</script>

<template>
  <UPageCard
    variant="subtle"
    :to="to"
    :target="to.startsWith('mailto:') ? undefined : '_blank'"
    :ui="{ container: 'not-prose gap-3', wrapper: 'gap-3' }"
  >
    <div class="flex items-center gap-3">
      <div class="bg-default border-default flex items-center justify-center rounded-lg border p-2">
        <UIcon :name="icon" class="size-6" :class="color" />
      </div>

      <div class="flex min-w-0 flex-col">
        <span class="text-highlighted truncate font-semibold">{{ name }}</span>
        <span v-if="handle" class="text-muted truncate text-sm">{{ handle }}</span>
      </div>
    </div>

    <p class="text-muted text-sm">{{ description }}</p>

    <p v-if="count || note" class="mt-auto text-sm">
      <span v-if="count" class="text-highlighted font-semibold">{{ count }}</span>
      <!-- A literal space here is swallowed by Vue's whitespace condensing,
           which glues the unit to the figure ("2.54Ksubscribers"). -->
      <span v-if="count && unit" class="text-muted">&nbsp;{{ unit }}</span>
      <span v-else-if="note" class="text-muted">{{ note }}</span>
    </p>
  </UPageCard>
</template>
