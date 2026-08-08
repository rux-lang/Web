<script setup lang="ts">
import type { ContentNavigationItem } from "@nuxt/content";

const navigation = inject<Ref<ContentNavigationItem[]>>("navigation");
const route = useRoute();

/**
 * Every documentation page is /docs/<book>/<page>, so the sidebar is always the
 * `/docs` branch's child matching the second path segment — one rule for all
 * five books, with no section names written down anywhere.
 *
 * It used to key off the *first* segment, back when /start, /cli and /packaging
 * were top-level siblings of /docs; nesting them removed the special case that
 * had to dig /docs/api out of the /docs subtree on its own.
 *
 * Blog posts never reach here: they render through app/pages/blog/[slug].vue,
 * which follows nuxt.com in giving an article no sidebar at all.
 */
const section = computed(() => {
  // The /docs hub itself has no book, and gets no sidebar. app/pages/[...slug]
  // only selects this layout below /docs, so this is belt-and-braces.
  const book = route.path.split("/")[2];
  if (!book) return [];

  const docs = navigation?.value?.find((item) => item.path === "/docs");
  const found = docs?.children?.find((item) => item.path === `/docs/${book}`);
  return found ? [found] : [];
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
