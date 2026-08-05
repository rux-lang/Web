<script setup lang="ts">
const { footerLinks: columns } = useFooterLinks();

// Full list; AppHeader.vue shows a compact subset.
const socials = [
  { icon: "i-simple-icons-x", to: "https://x.com/ruxlang", label: "Rux on X" },
  { icon: "i-simple-icons-bluesky", to: "https://bsky.app/profile/rux-lang.dev", label: "Rux on BlueSky" },
  { icon: "i-simple-icons-linkedin", to: "https://www.linkedin.com/company/ruxlang", label: "Rux on LinkedIn" },
  {
    icon: "i-simple-icons-discord",
    to: "https://discord.com/invite/uvSHjtZSVG",
    label: "Rux on Discord",
  },
  {
    icon: "i-simple-icons-youtube",
    to: "https://www.youtube.com/@ruxlang",
    label: "Rux on YouTube",
  },
  {
    icon: "i-simple-icons-github",
    to: "https://github.com/rux-lang/Rux",
    label: "Rux on GitHub",
  },
];
</script>

<template>
  <!-- nuxt.com marks the seam with a monochrome brand glyph. Rux has no
       simple-icons entry, so the mark goes through the default slot rather than
       `icon` — which also means the size and colour are set here, since the
       theme's `icon` class (`shrink-0 size-5`) only applies to the prop.

       No `h-px` on the root: that is the height of the *rule*, and forcing it
       on the container clipped the glyph to a sliver. The separator draws its
       own line; the root just needs to be tall enough to hold the mark. -->
  <USeparator>
    <RuxMark class="text-muted size-8" />
  </USeparator>

  <UFooter :ui="{ top: 'border-b border-default' }">
    <template #top>
      <UContainer>
        <!-- The theme grid is xl:grid-cols-3 with the link columns spanning two,
             leaving the third for a brand block (as nuxt.com uses for its
             newsletter form). There is no brand block here, so without this the
             links would sit in the right two thirds against an empty column —
             they span all three instead. -->
        <UFooterColumns :columns="columns" :ui="{ center: 'xl:col-span-3' }" />
      </UContainer>
    </template>

    <template #left>
      <p class="text-muted text-sm">
        Copyright © 2025-{{ new Date().getFullYear() }} Rux -
        <ULink to="https://github.com/rux-lang/Rux/blob/main/LICENSE.md" target="_blank" class="hover:underline">
          MIT License
        </ULink>
      </p>
    </template>

    <template #right>
      <UButton
        v-for="s in socials"
        :key="s.label"
        color="neutral"
        variant="ghost"
        :to="s.to"
        :icon="s.icon"
        target="_blank"
      >
        <span class="sr-only">{{ s.label }}</span>
      </UButton>
    </template>
  </UFooter>
</template>
