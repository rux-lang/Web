<script setup lang="ts">
import type { ContentNavigationItem } from "@nuxt/content";

const navigation = inject<Ref<ContentNavigationItem[]>>("navigation");
const route = useRoute();

/**
 * The old sidebar was keyed by route prefix (/docs/, /api/, /cli/, /start/,
 * /blog/) — five slices of one tree. queryCollectionNavigation returns the
 * whole tree, so pick the branch matching the section being viewed.
 */
const top = computed(() => "/" + (route.path.split("/")[1] ?? ""));

const section = computed(() => {
  return navigation?.value?.filter((item) => item.path === top.value) ?? [];
});

// The blog groups by year, which cannot come from the filesystem tree.
const isBlog = computed(() => top.value === "/blog");
</script>

<template>
  <UPage>
    <template #left>
      <UPageAside>
        <BlogAside v-if="isBlog" />
        <UContentNavigation v-else :navigation="section" highlight default-open />
      </UPageAside>
    </template>

    <slot />
  </UPage>
</template>
