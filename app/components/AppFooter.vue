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
  <!-- nuxt.com marks the seam with its brand glyph; Rux has no simple-icons
       entry, so the logo goes through the default slot instead of `icon`. -->
  <USeparator class="h-px">
    <img src="/logo.svg" alt="" class="h-5 w-auto" aria-hidden="true" />
  </USeparator>

  <UFooter :ui="{ top: 'border-b border-default' }">
    <template #top>
      <UContainer>
        <!-- The columns grid is xl:grid-cols-3 with the columns spanning two of
             them; nuxt.com fills the third with a newsletter form, this uses the
             #left brand block so the row is not lopsided. -->
        <UFooterColumns :columns="columns">
          <template #left>
            <div class="flex items-center gap-2">
              <img src="/logo.svg" alt="" class="h-6 w-auto" aria-hidden="true" />
              <span class="font-bold text-lg">Rux</span>
            </div>
            <p class="text-muted text-sm mt-3 max-w-xs">
              A modern programming language for building fast, safe and readable software.
            </p>
          </template>
        </UFooterColumns>
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
