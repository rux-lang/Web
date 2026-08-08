<script setup lang="ts">
import type { ContentNavigationItem } from "@nuxt/content";
import { findPageBreadcrumb } from "@nuxt/content/utils";
import { mapContentNavigation } from "@nuxt/ui/utils/content";

const route = useRoute();
const navigation = inject<Ref<ContentNavigationItem[] | null>>("navigation", ref([]));

// Inbound URLs may carry a trailing slash (the old site linked
// directory indexes as /docs/api/bsd/). queryCollection stores them slashless, so
// normalise before querying or those pages 404 on client-side navigation while
// the prerendered HTML still serves — a bug that hides in testing.
const path = computed(() => route.path.replace(/\/+$/, "") || "/");

const { data: page } = await useAsyncData(`page-${path.value}`, () => queryCollection("docs").path(path.value).first());

if (!page.value) {
  throw createError({
    statusCode: 404,
    statusMessage: "Page not found",
    fatal: true,
  });
}

const { data: surround } = await useAsyncData(`surround-${path.value}`, () =>
  queryCollectionItemSurroundings("docs", path.value, {
    fields: ["description"],
  }),
);

// Standalone destinations are not part of the documentation reading sequence,
// so they should not inherit whichever content pages happen to sit before and
// after them in the collection.
const pagesWithoutSurround = new Set([
  "/code-of-conduct",
  "/community",
  "/design-kit",
  "/docs",
  "/download",
  "/faq",
  "/privacy",
  "/security",
  "/support",
  "/terms",
]);
const showSurround = computed(() => !pagesWithoutSurround.has(path.value) && !!surround.value?.some(Boolean));

// Every page *below* /docs is inside one of the five books and gets that book's
// sidebar. Note the trailing `.`: it excludes /docs itself, which is the hub —
// a grid of the five, with nothing to put in an aside. AppHeader's `inDocs` is
// the same test without it, because the hub *does* want the section switcher
// row. The standalone root pages (faq, download, community, support, packages,
// playground) carried `sidebar: false` in VitePress and keep that here.
//
// /blog is excluded too: posts are served by app/pages/blog/[slug].vue, which
// gives them nuxt.com's article layout — no left sidebar — instead.
const inSection = computed(() => /^\/docs\/./.test(path.value));
const isApiPage = computed(() => /^\/docs\/api(\/|$)/.test(path.value));

function isMinimarkTag(node: unknown, tag: string): boolean {
  return Array.isArray(node) && node[0] === tag;
}

const renderedPage = computed(() => {
  const currentPage = page.value!;
  const body = currentPage.body;

  if (!isApiPage.value || body?.type !== "minimark" || !Array.isArray(body.value)) return currentPage;

  let contentStart = 0;
  if (isMinimarkTag(body.value[contentStart], "h1")) contentStart += 1;
  if (isMinimarkTag(body.value[contentStart], "p")) contentStart += 1;

  return {
    ...currentPage,
    body: {
      ...body,
      value: body.value.slice(contentStart),
    },
  };
});

const apiBreadcrumbs = computed(() =>
  mapContentNavigation(findPageBreadcrumb(navigation.value ?? [], path.value)).map(({ label, to }) => ({
    label,
    to,
  })),
);

const apiInfo = computed(() => apiPageInfo(path.value));
const { ruxVersion } = useRuntimeConfig().public;
const apiVersion = computed(() => apiInfo.value.version ?? ruxVersion);

const markdownUrl = computed(
  () => `https://raw.githubusercontent.com/rux-lang/Web/dev/content/${page.value?.stem}.${page.value?.extension}`,
);

// One catch-all serves all 550 content pages, so they share a single
// heroBackground value — the same "muted, present but not loud" level nuxt.com
// uses across its docs. Marketing-style pages set their own, louder value.
definePageMeta({ heroBackground: "opacity-30" });

// UPage sizes its centre column from whether the #right SLOT exists, not from
// whether that slot rendered anything — so a v-if on UContentToc alone leaves a
// dead two-column gutter. Nine pages already had one (every page whose body has
// no h2, e.g. /docs/lang, /docs/api, /download). Driving the template's own v-if from this
// makes the content span all ten columns instead.
const showToc = computed(() => !page.value?.hideToc && !!page.value?.body?.toc?.links?.length);

// `stem` retains the numeric ordering prefixes and is relative to the
// content root, which is exactly what the GitHub edit URL needs.
const editUrl = computed(
  () => `https://github.com/rux-lang/Web/edit/dev/content/${page.value?.stem}.${page.value?.extension}`,
);

const seo = computed(() => page.value?.seo ?? {});
useSeoMeta({
  title: () => seo.value.title ?? page.value?.title,
  description: () => seo.value.description ?? page.value?.description,
  ogTitle: () => seo.value.title ?? page.value?.title,
  ogDescription: () => seo.value.description ?? page.value?.description,
  ogImage: () => seo.value.ogImage,
  ogType: () => (seo.value.ogType as "website" | "article") ?? "website",
  ogUrl: () => seo.value.ogUrl,
  twitterCard: "summary_large_image",
  twitterTitle: () => seo.value.title ?? page.value?.title,
  twitterDescription: () => seo.value.description ?? page.value?.description,
  twitterImage: () => seo.value.ogImage,
});

useHead({
  link: [{ rel: "canonical", href: `https://rux-lang.dev${path.value}` }],
});
</script>

<template>
  <!--
    UMain adds no horizontal padding, so without this the content of every page
    runs into the viewport edge while UHeader and UFooter — which carry their own
    containers — stay inset. nuxt.com solves it the same way, but per page
    component (design-kit.vue, docs/[...slug].vue and the rest each open with a
    UContainer); one catch-all serves all 550 pages here, so it goes on the
    outside of NuxtLayout — inside it would wrap only the slot and leave the docs
    sidebar hanging outside the container.
  -->
  <UContainer>
    <NuxtLayout :name="inSection ? 'docs' : false">
      <UPage v-if="page">
        <UPageHeader
          v-if="isApiPage"
          :title="page.title"
          :description="page.description"
          :ui="{ wrapper: 'flex-row items-center flex-wrap justify-between' }"
        >
          <template #headline>
            <UBreadcrumb :items="apiBreadcrumbs" />
          </template>

          <template #title>
            {{ page.title }}

            <UBadge
              :label="`v${apiVersion}`"
              color="info"
              variant="subtle"
              size="lg"
              class="align-middle"
              :aria-label="`${apiInfo.packageName ?? 'Rux'} API version ${apiVersion}`"
            />
          </template>

          <template #links>
            <UButton
              label="Source"
              icon="i-simple-icons-github"
              :to="apiInfo.sourceUrl"
              target="_blank"
              color="neutral"
              variant="soft"
              size="sm"
            />
            <ApiPageActions :key="path" :markdown-url="markdownUrl" />
          </template>
        </UPageHeader>

        <UPageBody>
          <!-- API pages promote the leading Markdown H1 and description into
               UPageHeader. Other sections render their complete body. -->
          <ContentRenderer :value="renderedPage" />

          <USeparator v-if="showSurround" class="my-8" />

          <UContentSurround v-if="showSurround" :surround="surround" />

          <div class="mt-8 text-sm">
            <ULink :to="editUrl" target="_blank" class="text-muted hover:text-primary">
              Edit this page on GitHub
            </ULink>
          </div>
        </UPageBody>

        <template v-if="showToc" #right>
          <UContentToc :links="page.body!.toc!.links" highlight highlight-variant="circuit" />
        </template>
      </UPage>
    </NuxtLayout>
  </UContainer>
</template>
