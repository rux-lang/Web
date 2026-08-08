<script setup lang="ts">
import type { ContentNavigationItem } from "@nuxt/content";

const navigation = inject<Ref<ContentNavigationItem[]>>("navigation");
const route = useRoute();

/**
 * The old sidebar was keyed by route prefix (/docs/, /docs/api/, /cli/, /start/,
 * /blog/) — five slices of one tree. queryCollectionNavigation returns the
 * whole tree, so pick the branch matching the section being viewed.
 *
 * Four slices now: blog posts render through app/pages/blog/[slug].vue, which
 * follows nuxt.com in giving an article no sidebar at all.
 */
const top = computed(() => "/" + (route.path.split("/")[1] ?? ""));

const section = computed(() => {
  if (route.path === "/docs/api" || route.path.startsWith("/docs/api/")) {
    const docs = navigation?.value?.find((item) => item.path === "/docs");
    const api = docs?.children?.find((item) => item.path === "/docs/api");
    return api ? [api] : [];
  }

  return navigation?.value?.filter((item) => item.path === top.value) ?? [];
});
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
