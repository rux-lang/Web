<script setup lang="ts">
/**
 * Blog posts, laid out after nuxt.com/blog/<post>: breadcrumb, category and
 * date, title, description and author above the fold; the article beside a
 * right-hand rail of contents and links; share controls and prev/next below.
 *
 * This page exists to take /blog/* away from `app/pages/[...slug].vue`, which
 * renders the other 540-odd content pages in the docs layout. A post is not a
 * documentation page — nuxt.com gives it no left sidebar — so the blog's
 * year-grouped aside went away with it.
 */
const route = useRoute();
const toast = useToast();

const { data: article } = await useAsyncData(`blog-${route.path}`, () =>
  queryCollection("docs").path(route.path).first(),
);

if (!article.value) {
  throw createError({ statusCode: 404, statusMessage: "Article not found", fatal: true });
}

// Neighbours stay inside /blog: the surroundings run over the whole `docs`
// collection, so without the filter the oldest post's "next" is whatever page
// happens to follow the blog directory in the navigation tree.
const { data: surround } = await useAsyncData(`blog-surround-${route.path}`, () =>
  queryCollectionItemSurroundings("docs", route.path, { fields: ["description"] })
    .where("path", "LIKE", "/blog/%")
    .where("extension", "=", "md"),
);

// Nuxt Content leaves the H1 at the top of the body, and the header above
// already renders the title — so drop it rather than print it twice. The body
// is minimark: every element is `[tag, props, ...children]`.
const body = computed(() => {
  const source = article.value?.body;
  if (!source) return undefined;

  const [first, ...rest] = source.value;
  return Array.isArray(first) && first[0] === "h1" ? { ...source, value: rest } : source;
});

const seo = computed(() => article.value?.seo ?? {});
const description = computed(() => seo.value.description ?? article.value?.description);

// The visible subtitle is the AUTHORED description only. Nuxt Content derives
// `description` from the first paragraph when frontmatter has none, and that
// paragraph is about to be rendered again three lines below — a post without an
// seo block simply gets no standfirst. The meta tags still use the fallback.
const standfirst = computed(() => seo.value.description);

useSeoMeta({
  title: () => seo.value.title ?? article.value?.title,
  description,
  ogTitle: () => seo.value.title ?? article.value?.title,
  ogDescription: description,
  ogImage: () => seo.value.ogImage,
  ogType: () => (seo.value.ogType as "website" | "article") ?? "article",
  ogUrl: () => seo.value.ogUrl,
  twitterCard: "summary_large_image",
  twitterTitle: () => seo.value.title ?? article.value?.title,
  twitterDescription: description,
  twitterImage: () => seo.value.ogImage,
});

useHead({
  link: [{ rel: "canonical", href: `https://rux-lang.dev${route.path}` }],
});

definePageMeta({ heroBackground: "opacity-30" });

const url = computed(() => `https://rux-lang.dev${route.path}`);

// The author's `to` is their profile URL, so the handle is its last segment —
// the same derivation nuxt.com uses for the byline.
const handle = (to?: string) => (to ? `@${to.split("/").pop()}` : undefined);

const shareText = computed(() => encodeURIComponent(`${article.value?.title}\n\n${url.value}`));

const shareLinks = computed(() => [
  {
    label: "X",
    icon: "i-simple-icons-x",
    to: `https://x.com/intent/tweet?text=${shareText.value}`,
  },
  {
    label: "Bluesky",
    icon: "i-simple-icons-bluesky",
    to: `https://bsky.app/intent/compose?text=${shareText.value}`,
  },
  {
    label: "LinkedIn",
    icon: "i-simple-icons-linkedin",
    to: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url.value)}`,
  },
]);

async function copyLink() {
  try {
    await navigator.clipboard.writeText(url.value);
    toast.add({ title: "Link copied to clipboard", icon: "i-lucide-copy-check", color: "success" });
  } catch {
    // Clipboard access is denied outside a secure context and in some
    // in-app browsers; the share buttons still work, so say so and move on.
    toast.add({ title: "Could not copy the link", icon: "i-lucide-circle-alert", color: "error" });
  }
}

// `stem` keeps the numeric ordering prefix and is relative to the content root,
// which is exactly what the GitHub edit URL needs.
const links = computed(() => [
  {
    icon: "i-lucide-pen",
    label: "Edit this article",
    to: `https://github.com/rux-lang/Web/edit/dev/content/${article.value?.stem}.${article.value?.extension}`,
    target: "_blank",
  },
  {
    icon: "i-lucide-star",
    label: "Star on GitHub",
    to: "https://github.com/rux-lang/Rux",
    target: "_blank",
  },
  {
    icon: "i-lucide-messages-square",
    label: "Join the Discord",
    to: "https://discord.com/invite/uvSHjtZSVG",
    target: "_blank",
  },
]);

const socials = [
  { icon: "i-simple-icons-x", to: "https://x.com/ruxlang", label: "Rux on X" },
  { icon: "i-simple-icons-bluesky", to: "https://bsky.app/profile/rux-lang.dev", label: "Rux on Bluesky" },
  { icon: "i-simple-icons-github", to: "https://github.com/rux-lang/Rux", label: "Rux on GitHub" },
  { icon: "i-simple-icons-discord", to: "https://discord.com/invite/uvSHjtZSVG", label: "Rux on Discord" },
];

// The date is formatted here rather than left to a component: this one is plain
// text in the headline. `timeZone: "UTC"` keeps a 2026-06-23 post off the 22nd
// for readers east of Greenwich, where the parsed UTC midnight lands a day back.
const publishedOn = computed(() =>
  article.value?.date
    ? new Date(article.value.date).toLocaleDateString("en", {
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone: "UTC",
      })
    : undefined,
);
</script>

<template>
  <UContainer v-if="article">
    <UPage>
      <UPageHeader
        :title="article.title"
        :description="standfirst"
        :ui="{ headline: 'flex flex-col gap-y-8 items-start' }"
      >
        <template #headline>
          <UBreadcrumb
            :items="[{ label: 'Blog', icon: 'i-lucide-newspaper', to: '/blog' }, { label: article.title }]"
            class="max-w-full"
          />

          <div class="flex items-center gap-2">
            <span v-if="article.category" class="text-primary">{{ article.category }}</span>
            <span v-if="article.category && publishedOn" class="text-muted">&middot;</span>
            <time v-if="publishedOn" :datetime="article.date" class="text-muted">{{ publishedOn }}</time>
          </div>
        </template>

        <div v-if="article.authors?.length" class="mt-4 flex flex-wrap items-center gap-6">
          <UUser
            v-for="author in article.authors"
            :key="author.name"
            :name="author.name"
            :description="handle(author.to)"
            :avatar="author.avatar ? { ...author.avatar, alt: `${author.name} avatar` } : undefined"
            :to="author.to"
            target="_blank"
          />
        </div>
      </UPageHeader>

      <UPage :ui="{ root: 'lg:grid-cols-12', center: 'lg:col-span-9', right: 'lg:col-span-3' }" class="lg:gap-16">
        <UPageBody>
          <ContentRenderer v-if="body" :value="{ ...article, body }" />

          <div class="not-prose mt-12 flex items-center justify-between">
            <ULink to="/blog" class="text-primary">← Back to blog</ULink>

            <div class="flex items-center justify-end gap-1.5">
              <UButton icon="i-lucide-link" variant="ghost" color="neutral" @click="copyLink">Copy URL</UButton>
              <UButton
                v-for="link in shareLinks"
                :key="link.label"
                :icon="link.icon"
                :to="link.to"
                variant="ghost"
                color="neutral"
                target="_blank"
              >
                <span class="sr-only">Share on {{ link.label }}</span>
              </UButton>
            </div>
          </div>

          <USeparator v-if="surround?.length" class="my-8" />

          <UContentSurround :surround="surround" />
        </UPageBody>

        <template #right>
          <UContentToc
            v-if="article.body?.toc?.links?.length"
            :links="article.body.toc.links"
            title="Table of Contents"
            highlight
          >
            <template #bottom>
              <div class="hidden space-y-6 lg:block">
                <UPageLinks title="Links" :links="links" />

                <USeparator type="dashed" />

                <div class="flex flex-wrap gap-1.5">
                  <UButton
                    v-for="social in socials"
                    :key="social.label"
                    :icon="social.icon"
                    :to="social.to"
                    :aria-label="social.label"
                    variant="ghost"
                    color="neutral"
                    target="_blank"
                  />
                </div>
              </div>
            </template>
          </UContentToc>
        </template>
      </UPage>
    </UPage>
  </UContainer>
</template>
