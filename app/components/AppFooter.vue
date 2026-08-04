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
       theme's `icon` class (`shrink-0 size-5`) only applies to the prop. -->
  <USeparator class="h-px">
    <RuxMark class="text-muted size-5" />
  </USeparator>

  <UFooter :ui="{ top: 'border-b border-default' }">
    <template #top>
      <UContainer>
        <!-- The theme grid is xl:grid-cols-3 with the link columns spanning two,
             leaving the third for a brand block (here) or nuxt.com's newsletter
             form. With no brand block the links would sit in the right two
             thirds against an empty column, so they span all three instead. -->
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
