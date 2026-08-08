<script setup lang="ts">
const route = useRoute();
const { headerLinks } = useHeaderLinks();

// The children of the "Docs" entry, promoted to a persistent second row while
// the visitor is inside one of the four documentation sections.
const links = computed(() => {
  const children = headerLinks.value.find((link) => link.label === "Docs")?.children ?? [];
  const activeTo = children
    .map((child) => child.to)
    .filter((to): to is string => typeof to === "string" && (route.path === to || route.path.startsWith(`${to}/`)))
    .sort((a, b) => b.length - a.length)[0];

  // UNavigationMenu marks a link active on an exact path match, which would
  // leave the row unhighlighted on every page below a section root.
  return children.map((child) => ({
    ...child,
    description: undefined,
    active: child.to === activeTo,
  }));
});
</script>

<template>
  <USeparator class="hidden lg:flex" />

  <UContainer class="hidden lg:flex items-center justify-between h-12">
    <UNavigationMenu :items="links" variant="pill" highlight class="-mx-2.5 -mb-px" />
  </UContainer>
</template>
