<script setup lang="ts">
import type { ContentNavigationItem } from "@nuxt/content";

/**
 * The blog sidebar, grouped by year.
 *
 * The only hand-written navigation left. queryCollectionNavigation derives its
 * tree from the filesystem, and the posts are a flat directory ordered by
 * numeric prefix (reverse-chronological) — there is nothing in the path
 * to group on. `content/blog/.navigation.yml` previously papered over this with
 * a hard-coded `title: 2026`, which filed the 2025-11-02 "Getting Started" post
 * under 2026.
 *
 * Years come from the `date:` frontmatter, so the grouping cannot drift as
 * posts are added — the next January needs no edit here.
 */
const { data: posts } = await useAsyncData("blog-aside", () =>
  queryCollection("docs")
    .where("path", "LIKE", "/blog/%")
    .where("extension", "=", "md")
    .select("path", "title", "navigation", "date")
    .order("date", "DESC")
    .all(),
);

const navigation = computed<ContentNavigationItem[]>(() => {
  const years = new Map<string, ContentNavigationItem[]>();

  for (const post of posts.value ?? []) {
    // Parse the year off the raw ISO string rather than through Date, which
    // would shift a 1 January post back a year in negative-offset timezones.
    const year = String(post.date ?? "").slice(0, 4) || "Undated";
    if (!years.has(year)) years.set(year, []);
    years.get(year)!.push({
      title: (post.navigation as { title?: string })?.title ?? post.title,
      path: post.path,
    });
  }

  return [...years.entries()]
    .sort((a, b) => b[0].localeCompare(a[0]))
    .map(([year, children]) => ({
      title: year,
      path: "/blog#" + year,
      page: false,
      children,
    }));
});
</script>

<template>
  <UContentNavigation :navigation="navigation" highlight default-open />
</template>
