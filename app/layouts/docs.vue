<script setup lang="ts">
// The book branch is resolved by useDocsSection() — AppDocsMobileNav needs the
// same answer from inside the page component, and one rule beats two copies.
const { section } = useDocsSection();
</script>

<template>
  <UPage>
    <template #left>
      <UPageAside>
        <UContentNavigation :navigation="section" highlight default-open />
      </UPageAside>
    </template>

    <slot />
  </UPage>
</template>
