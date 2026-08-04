<script setup lang="ts">
const route = useRoute();
const { headerLinks } = useHeaderLinks();

// The four docs sections get their own row under the bar (nuxt.com's
// HeaderBottom), so while it is showing the top-level "Docs" dropdown is
// flattened to a plain link — otherwise the same four links appear twice.
const inDocs = computed(() => /^\/(start|docs|cli|api)(\/|$)/.test(route.path));

const items = computed(() =>
  headerLinks.value.map((link) => (inDocs.value && link.label === "Docs" ? { ...link, children: [] } : link)),
);

// That second row makes the header taller, and the docs layout's sticky aside
// and TOC both offset themselves by --ui-header-height. Growing the variable
// (see main.css) keeps them aligned instead of tucked under the sub-nav.
useHead(() => ({
  bodyAttrs: { class: inDocs.value ? "has-docs-subnav" : "" },
}));
</script>

<template>
  <UHeader :ui="{ left: 'min-w-0', container: 'h-16' }" class="flex flex-col">
    <template #left>
      <NuxtLink to="/" aria-label="Rux home" class="flex items-center gap-2">
        <img src="/logo.svg" alt="" class="block h-6 w-auto" aria-hidden="true" />
        <span class="font-bold text-lg">Rux</span>
      </NuxtLink>
    </template>

    <UNavigationMenu :items="items" variant="link" content-orientation="vertical" :ui="{ linkLeadingIcon: 'hidden' }" />

    <template #right>
      <UTooltip text="Search" :kbds="['meta', 'K']" ignore-non-keyboard-focus>
        <UContentSearchButton />
      </UTooltip>

      <UTooltip text="Toggle theme">
        <UColorModeButton />
      </UTooltip>

      <UTooltip text="Rux on GitHub">
        <UButton
          icon="i-simple-icons-github"
          to="https://github.com/rux-lang/Rux"
          target="_blank"
          variant="ghost"
          color="neutral"
          square
          aria-label="Rux on GitHub"
        />
      </UTooltip>
    </template>

    <!-- Mobile menu. Without this slot there is no navigation on small screens. -->
    <template #body>
      <AppHeaderBody />
    </template>

    <template v-if="inDocs" #bottom>
      <AppHeaderBottom />
    </template>
  </UHeader>
</template>
