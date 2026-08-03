<script setup lang="ts">
/**
 * The blog index. The old site had none — its top nav deep-linked straight
 * to the newest post, because there was nothing to land on.
 */
// The collection source is '**' rather than '**\/*.md' so that .navigation.yml
// files are read for directory titles — but that also makes them
// queryable as pages, so exclude them explicitly.
const { data: posts } = await useAsyncData("blog-posts", () =>
  queryCollection("docs").where("path", "LIKE", "/blog/%").where("extension", "=", "md").order("date", "DESC").all(),
);

definePageMeta({ layout: false });

useSeoMeta({
  title: "Blog",
  description: "Release notes and articles from the Rux programming language project.",
  ogTitle: "Rux Blog",
  ogDescription: "Release notes and articles from the Rux programming language project.",
  ogType: "website",
  ogUrl: "https://rux-lang.dev/blog",
  ogImage: "https://rux-lang.dev/images/og-blog.jpg",
  twitterCard: "summary_large_image",
  twitterTitle: "Rux Blog",
  twitterImage: "https://rux-lang.dev/images/og-blog.jpg",
});

useHead({
  link: [{ rel: "canonical", href: "https://rux-lang.dev/blog" }],
});

// UBlogPost formats the `date` prop itself (dateStyle medium, timeZone UTC),
// so pass the raw frontmatter value. Pre-formatting it here caused the
// component to re-parse the string and render the previous day ("Jun 22" for
// 2026-06-23).
</script>

<template>
  <UContainer class="py-12">
    <UPageHeader title="Blog" description="Release notes and articles from the Rux project." />

    <UPageBody>
      <UBlogPosts>
        <UBlogPost
          v-for="post in posts"
          :key="post.path"
          :to="post.path"
          :title="post.title"
          :description="post.description"
          :date="post.date"
        />
      </UBlogPosts>
    </UPageBody>
  </UContainer>
</template>
