<script setup lang="ts">
const route = useRoute();

// Inbound URLs may carry a trailing slash (the old site linked
// directory indexes as /api/bsd/). queryCollection stores them slashless, so
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

// Sectioned pages get the sidebar; the standalone root pages (faq, download,
// community, support, packages, playground) carried `sidebar: false` in
// VitePress and keep that here.
const inSection = computed(() => /^\/(start|docs|cli|api|blog)(\/|$)/.test(path.value));
definePageMeta({ layout: false });

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
  <NuxtLayout :name="inSection ? 'docs' : false">
    <UPage v-if="page">
      <UPageBody>
        <!--
          Nuxt Content does NOT strip the H1 from the body, so rendering
          UPageHeader :title="page.title" alongside ContentRenderer would print
          the title twice on every page. The body supplies its own heading.
        -->
        <ContentRenderer :value="page" />

        <USeparator class="my-8" />

        <UContentSurround :surround="surround" />

        <div class="mt-8 text-sm">
          <ULink :to="editUrl" target="_blank" class="text-muted hover:text-primary"> Edit this page on GitHub </ULink>
        </div>
      </UPageBody>

      <template #right>
        <UContentToc v-if="page.body?.toc?.links?.length" :links="page.body.toc.links" />
      </template>
    </UPage>
  </NuxtLayout>
</template>
