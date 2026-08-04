<script setup lang="ts">
import type { ContentNavigationItem } from "@nuxt/content";

const { headerLinks } = useHeaderLinks();

// UContentNavigation speaks Nuxt Content's shape (title/path), not the
// NavigationMenuItem shape the desktop bar uses, so the links are remapped
// rather than duplicated.
const mobileNavigation = computed<ContentNavigationItem[]>(
  () =>
    headerLinks.value.map((link) => ({
      ...link,
      title: link.label,
      path: link.to,
      children: link.children?.map((child) => ({
        ...child,
        title: child.label,
        path: child.to,
      })),
    })) as ContentNavigationItem[],
);
</script>

<template>
  <UContentNavigation
    :navigation="mobileNavigation"
    :collapsible="false"
    variant="link"
    highlight
    :ui="{
      trigger: 'font-medium data-[state=open]:text-toned tracking-wide text-[11px] uppercase',
      link: 'data-[state=open]:text-muted',
    }"
  />
</template>
