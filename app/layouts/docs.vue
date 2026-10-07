<script setup lang="ts">
// The book branch is resolved by useDocsSection() — AppDocsMobileNav needs the
// same answer from inside the page component, and one rule beats two copies.
const { section, defaultOpen, apiPackage } = useDocsSection();
</script>

<template>
  <UPage>
    <template #left>
      <UPageAside>
        <!-- Inside /docs/api/<package> the sidebar lists that package alone. -->
        <ApiPackageSwitcher v-if="apiPackage" :current="apiPackage.path" class="mb-4" />

        <UContentNavigation :navigation="section" highlight :default-open="defaultOpen" />
      </UPageAside>
    </template>

    <slot />
  </UPage>
</template>
