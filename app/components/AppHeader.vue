<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";

const route = useRoute();

// Mirrors themeConfig.nav from the old .vitepress/config.mts.
const items = computed<NavigationMenuItem[]>(() => [
  {
    label: "Docs",
    active: /^\/(start|docs|cli|api)(\/|$)/.test(route.path),
    children: [
      {
        label: "Get Started",
        description: "Install Rux and build your first program",
        to: "/start",
      },
      {
        label: "Rux Reference",
        description: "The complete language reference",
        to: "/docs",
      },
      {
        label: "CLI Reference",
        description: "Every rux subcommand",
        to: "/cli",
      },
      {
        label: "API Reference",
        description: "Standard library and platform APIs",
        to: "/api",
      },
    ],
  },
  { label: "Playground", to: "/playground" },
  {
    label: "Packages",
    to: "/packages",
    active: route.path.startsWith("/packages"),
  },
  { label: "Blog", to: "/blog", active: route.path.startsWith("/blog") },
  { label: "Community", to: "/community" },
  { label: "Support", to: "/support" },
  { label: "Download", to: "/download" },
  { label: "FAQ", to: "/faq" },
]);

const socials = [
  {
    icon: "i-simple-icons-github",
    to: "https://github.com/rux-lang/Rux",
    label: "GitHub",
  },
  {
    icon: "i-simple-icons-discord",
    to: "https://discord.com/invite/uvSHjtZSVG",
    label: "Discord",
  },
  {
    icon: "i-simple-icons-youtube",
    to: "https://www.youtube.com/@ruxlang",
    label: "YouTube",
  },
  { icon: "i-simple-icons-x", to: "https://x.com/ruxlang", label: "X" },
];
</script>

<template>
  <UHeader :ui="{ center: 'flex-1' }">
    <template #title>
      <img src="/logo.svg" alt="" class="h-6 w-auto" aria-hidden="true" />
      <span class="font-bold text-lg">Rux</span>
    </template>

    <UNavigationMenu :items="items" variant="link" />

    <template #right>
      <UContentSearchButton />
      <UColorModeButton />
      <UButton
        v-for="s in socials"
        :key="s.label"
        :icon="s.icon"
        :to="s.to"
        :aria-label="s.label"
        color="neutral"
        variant="ghost"
        target="_blank"
        class="hidden sm:inline-flex"
      />
    </template>

    <!-- Mobile menu. Without this slot there is no navigation on small screens. -->
    <template #body>
      <UNavigationMenu :items="items" orientation="vertical" class="-mx-2.5" />
    </template>
  </UHeader>
</template>
