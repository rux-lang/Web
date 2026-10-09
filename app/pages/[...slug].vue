<script setup lang="ts">
import type { ContentNavigationItem } from "@nuxt/content";
import { findPageBreadcrumb } from "@nuxt/content/utils";
import type { BreadcrumbItem } from "@nuxt/ui";
import { mapContentNavigation } from "@nuxt/ui/utils/content";

const route = useRoute();
const navigation = inject<Ref<ContentNavigationItem[] | null>>("navigation", ref([]));

// Inbound URLs may carry a trailing slash (the old site linked
// directory indexes that way). queryCollection stores them slashless, so
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

const { data: collectionSurround } = await useAsyncData(`surround-${path.value}`, () =>
  queryCollectionItemSurroundings("docs", path.value, {
    fields: ["description"],
  }),
);

// The collection is one stem-ordered list, so the first page of a book has the
// previous book's last page (or the /docs hub) as its neighbour. Prev/next is a
// reading order *within* a book: drop a neighbour that sits in another one.
const bookOf = (p: string) => p.match(/^\/docs\/[^/]+/)?.[0] ?? `/${p.split("/")[1]}`;
// UContentSurround renders each slot under `v-if="link"`, so a null skips that
// side; its prop type just does not admit one.
const surround = computed(
  () =>
    collectionSurround.value?.map((item) => (item && bookOf(item.path) === bookOf(path.value) ? item : null)) as
      ContentNavigationItem[] | undefined,
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
// Learn Rux lessons carry a `lesson` frontmatter block (content.config.ts).
// Like API pages they promote their H1 into UPageHeader, which adds the part
// and lesson number, the Examples source and the "ask an assistant" menu.
const lesson = computed(() => page.value?.lesson);
// Generated API pages (scripts/api-docs.mjs) carry an `api` block naming their
// package, declaration kind, version and source line; only the /docs/api hub
// has none.
const api = computed(() => page.value?.api);

function isMinimarkTag(node: unknown, tag: string): boolean {
  return Array.isArray(node) && node[0] === tag;
}

// The text of a minimark node: [tag, props, ...children], children either
// strings or nodes.
function minimarkText(node: unknown): string {
  if (typeof node === "string") return node;
  return Array.isArray(node) ? node.slice(2).map(minimarkText).join("") : "";
}

const sameSentence = (a: string, b: string | undefined) =>
  b !== undefined && a.trim().replace(/\.$/, "") === b.trim().replace(/\.$/, "");

const renderedPage = computed(() => {
  const currentPage = page.value!;
  const body = currentPage.body;

  if ((!isApiPage.value && !lesson.value) || body?.type !== "minimark" || !Array.isArray(body.value)) {
    return currentPage;
  }

  // A lesson's description lives in frontmatter, so only its H1 moves.
  let contentStart = 0;
  if (isMinimarkTag(body.value[contentStart], "h1")) contentStart += 1;
  // UPageHeader shows the description, so the paragraph that repeats it goes:
  // a hand-written page's derived one is its first paragraph, word for word,
  // and a generated overview opens on the manifest's description, which has
  // no full stop where the paragraph has one. Anything else — the /docs/api
  // hub's introduction — stays in the body.
  const lead = body.value[contentStart];
  if (isApiPage.value && isMinimarkTag(lead, "p") && sameSentence(minimarkText(lead), currentPage.description)) {
    contentStart += 1;
  }

  return {
    ...currentPage,
    body: {
      ...body,
      value: body.value.slice(contentStart),
    },
  };
});

// The sidebar group a lesson sits in is its part ("Control flow"); the folder
// node an API page sits in is its package.
const { book, apiPackage } = useDocsSection();

// API Reference › Package › Item for a generated page; the hand-written ones
// keep the trail their navigation folders give them.
const apiBreadcrumbs = computed(() => {
  if (api.value) {
    const trail: BreadcrumbItem[] = [
      { label: "API Reference", to: "/docs/api" },
      { label: apiPackage.value?.title ?? api.value.package, to: apiPackage.value?.path },
    ];
    if (api.value.kind !== "package") trail.push({ label: page.value!.title });
    return trail;
  }
  return mapContentNavigation(findPageBreadcrumb(navigation.value ?? [], path.value)).map(({ label, to }) => ({
    label,
    to,
  }));
});

// Every page under /docs/api carries `api` frontmatter except the hub itself,
// which is no one package: it gets no version badge, and its Source button
// opens the Packages tree.
const apiVersion = computed(() => api.value?.version);
const apiPackageName = computed(() => api.value?.package);
const apiSource = computed(() => (api.value ? apiSourceUrl(api.value) : apiPackagesTreeUrl));
// "struct", "interface", "primitive", …; an overview, and a topic page
// that only gathers fragments, are not one declaration and get no badge.
const apiKind = computed(() =>
  api.value && !["package", "topic"].includes(api.value.kind) ? api.value.kind.replace(/-/g, " ") : undefined,
);

const lessonPart = computed(
  () => book.value?.children?.find((group) => group.children?.some((item) => item.path === path.value))?.title,
);
const lessonSourceUrl = computed(() => `https://github.com/rux-lang/Examples/tree/main/${lesson.value?.source}`);

const markdownUrl = computed(
  () => `https://raw.githubusercontent.com/rux-lang/Web/dev/content/${page.value?.stem}.${page.value?.extension}`,
);

const lessonPrompt = computed(
  () =>
    `I am learning the Rux programming language with the Learn Rux course. ` +
    `Read lesson ${lesson.value?.number} at ${markdownUrl.value} and its program at ` +
    `https://raw.githubusercontent.com/rux-lang/Examples/main/${lesson.value?.source}/Src/Main.rux. ` +
    `Rux is a new language, so rely on these files rather than on what similar languages do; ` +
    `https://rux-lang.dev/llms-full.txt has the whole course and language reference if you need more. ` +
    `Explain the lesson step by step, then check my understanding with one short question at a time.`,
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
const tocLinks = computed(() => (showToc.value ? page.value!.body!.toc!.links : undefined));

// Below `lg` both asides are display:none and AppDocsMobileNav stands in for
// them, so every page inside a book needs the #right slot even when it has no
// TOC — /docs/lang and /docs/api among them. When the TOC is what is missing,
// nothing in that slot survives to `lg`, so the gutter is collapsed by hand
// there exactly as the plain `v-if` used to do it.
//
// Outside the books there is no sidebar to reach and so no bar; those pages keep
// UContentToc's own accordion on a phone, which is why it is only hidden below
// `lg` when the bar is there to replace it.
const rightColumn = computed(() => (showToc.value ? undefined : { center: "lg:col-span-10", right: "lg:hidden" }));

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
  <UContainer>
    <!--
      UMain adds no horizontal padding, so without this UContainer the content of
      every page runs into the viewport edge while UHeader and UFooter — which
      carry their own containers — stay inset. nuxt.com solves it the same way,
      but per page component (design-kit.vue, docs/[...slug].vue and the rest
      each open with a UContainer); one catch-all serves all 550 pages here, so
      it goes on the outside of NuxtLayout — inside it would wrap only the slot
      and leave the docs sidebar hanging outside the container.
    -->
    <NuxtLayout :name="inSection ? 'docs' : false">
      <UPage v-if="page" :ui="rightColumn">
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
              v-if="apiKind"
              :label="apiKind"
              color="neutral"
              variant="outline"
              size="lg"
              class="align-middle font-mono"
            />

            <UBadge
              v-if="apiVersion"
              :label="`v${apiVersion}`"
              color="info"
              variant="subtle"
              size="lg"
              class="align-middle"
              :aria-label="`${apiPackageName} API version ${apiVersion}`"
            />
          </template>

          <template #links>
            <UButton
              label="Source"
              icon="i-simple-icons-github"
              :to="apiSource"
              target="_blank"
              color="neutral"
              variant="soft"
              size="sm"
            />
            <ApiPageActions :key="path" :markdown-url="markdownUrl" />
          </template>
        </UPageHeader>

        <UPageHeader
          v-else-if="lesson"
          :title="page.title"
          :description="page.description"
          :ui="{ wrapper: 'flex-row items-center flex-wrap justify-between' }"
        >
          <template #headline>
            <span>{{ lessonPart ? `${lessonPart} · ` : "" }}Lesson {{ lesson.number }}</span>
          </template>

          <template #links>
            <UButton
              label="Source"
              icon="i-simple-icons-github"
              :to="lessonSourceUrl"
              target="_blank"
              color="neutral"
              variant="soft"
              size="sm"
            />
            <ApiPageActions :key="path" :markdown-url="markdownUrl" :prompt="lessonPrompt" />
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

        <template v-if="showToc || inSection" #right>
          <!--
            UPage's #right slot merges its column classes onto the FIRST child
            and renders the rest as further grid items, so these two are siblings
            on purpose: the TOC owns the gutter from `lg` up, the mobile bar owns
            the top of the page below it, and neither is ever visible at the same
            time as the other.
          -->
          <UContentToc
            v-if="showToc"
            :links="tocLinks"
            highlight
            highlight-variant="circuit"
            :class="inSection ? 'hidden lg:flex lg:bg-[initial] lg:backdrop-blur-none' : undefined"
          />

          <AppDocsMobileNav v-if="inSection" :links="tocLinks" />
        </template>
      </UPage>
    </NuxtLayout>
  </UContainer>
</template>
