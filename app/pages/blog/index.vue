<script setup lang="ts">
/**
 * The blog index. The old site had none — its top nav deep-linked straight
 * to the newest post, because there was nothing to land on.
 *
 * Laid out like nuxt.com/blog: a left-aligned hero carrying the feed link,
 * then a card grid where the newest post spans the full width as a horizontal
 * card and the rest fall into three columns.
 */
// The collection source is '**' rather than '**\/*.md' so that .navigation.yml
// files are read for directory titles — but that also makes them
// queryable as pages, so exclude them explicitly.
const { data: posts } = await useAsyncData("blog-posts", () =>
  queryCollection("docs").where("path", "LIKE", "/blog/%").where("extension", "=", "md").order("date", "DESC").all(),
);

// The wash sits behind the hero at nuxt.com's blog strength — stronger than the
// content pages' opacity-30, because there is a hero here rather than a heading.
definePageMeta({ heroBackground: "opacity-70" });

useSeoMeta({
  title: "Blog",
  description: "Release notes and articles from the Rux programming language project.",
  ogTitle: "Rux Blog",
  ogDescription: "Release notes and articles from the Rux programming language project.",
  ogType: "website",
  ogUrl: "https://rux-lang.dev/blog",
  ogImage: "https://rux-lang.dev/images/og-blog.png",
  twitterCard: "summary_large_image",
  twitterTitle: "Rux Blog",
  twitterImage: "https://rux-lang.dev/images/og-blog.png",
});

useHead({
  link: [{ rel: "canonical", href: "https://rux-lang.dev/blog" }],
});

// UBlogPost formats the `date` prop itself (dateStyle medium, timeZone UTC),
// so pass the raw frontmatter value. Pre-formatting it — as nuxt.com's blog
// does — makes the component re-parse the formatted string as LOCAL midnight
// and then render it in UTC, i.e. the previous day ("Jun 22" for 2026-06-23)
// anywhere east of Greenwich.
//
// The release posts open with their cover image, so Nuxt Content's derived
// `description` — the first paragraph — comes back empty for them and their
// cards would carry a title and nothing else. The seo block is written for a
// reader arriving cold, which is exactly the card's job.
const summary = (post: { seo?: { description?: string }; description?: string }) =>
  post.seo?.description ?? post.description;

// The featured card is twice the width of a grid cell and shows its image
// beside the text rather than above it, so it needs its own intrinsic size —
// these are the ratios nuxt.com uses, and they keep the browser from
// reflowing the grid as the covers load.
const imageSize = (index: number) => (index === 0 ? { width: 672, height: 378 } : { width: 437, height: 246 });
</script>

<template>
  <UContainer>
    <UPageHero title="The Rux Blog" orientation="horizontal">
      <template #description>
        Release notes and articles from the Rux project.

        <UButton
          to="/blog/rss.xml"
          color="neutral"
          variant="subtle"
          size="xs"
          icon="i-lucide-rss"
          external
          target="_blank"
        >
          RSS
        </UButton>
      </template>
    </UPageHero>

    <UPageBody>
      <UBlogPosts class="mb-12 md:grid-cols-2 lg:grid-cols-3">
        <UBlogPost
          v-for="(post, index) in posts"
          :key="post.path"
          :to="post.path"
          :title="post.title"
          :description="summary(post)"
          :image="post.image ? { src: post.image, alt: `${post.title} cover`, ...imageSize(index) } : undefined"
          :date="post.date"
          :authors="
            post.authors?.map((author) => ({
              ...author,
              avatar: author.avatar ? { ...author.avatar, alt: `${author.name} avatar` } : undefined,
              target: '_blank',
            }))
          "
          :badge="post.category ? { label: post.category, color: 'primary', variant: 'subtle' } : undefined"
          :variant="index === 0 ? 'outline' : 'subtle'"
          :orientation="index === 0 ? 'horizontal' : 'vertical'"
          :class="index === 0 ? 'col-span-full' : undefined"
        />
      </UBlogPosts>
    </UPageBody>
  </UContainer>
</template>
