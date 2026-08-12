<script setup lang="ts">
import type { TabsItem } from "@nuxt/ui";

/**
 * The landing page, rebuilt on Nuxt UI.
 *
 * Replaces VitePress's `layout: home` frontmatter (hero + features) plus ~117
 * lines of hand-written HTML that depended on ~800 lines of discarded theme CSS.
 * Content and information architecture are preserved; the presentation is
 * Nuxt UI's.
 *
 * Deliberate changes, both signed off by the author:
 *   - the CSS-animated fake terminal is gone (the stats row it sat above stays)
 *   - Sponsors is a heading + copy + CTA, without the empty placeholder slots
 */
// Lucide names, as on nuxt.com, rather than the hand-drawn SVGs that used to
// live in public/icons/ — those were the last thing on the page needing its own
// asset pipeline, and the icon component already handles colour and dark mode.
const features = [
  {
    icon: "i-lucide-rocket",
    title: "Native Performance",
    description:
      "Compiles straight to native machine code. No virtual machine, no interpreter, no garbage collector pauses.",
  },
  {
    icon: "i-lucide-gauge",
    title: "Instant Toolchain",
    description: "Compiler, linter, package manager, formatter, and test runner — one small binary, zero dependencies.",
  },
  {
    icon: "i-lucide-blocks",
    title: "Strong Types",
    description: "No implicit conversions, no surprises. Everything is checked at compile time and free at runtime.",
  },
  {
    icon: "i-lucide-lock",
    title: "Explicit Mutability",
    description:
      "Bindings are immutable until you write var. That choice runs deep — through struct fields and pointers.",
  },
  {
    icon: "i-lucide-dna",
    title: "Multi-Paradigm",
    description: "Imperative, functional, or data-oriented — pick what fits the problem, no forced style.",
  },
  {
    icon: "i-lucide-binary",
    title: "Hardware Access",
    description: "Inline assembly, raw pointers, and FFI. When you need the metal, Rux gets out of the way.",
  },
  {
    icon: "i-lucide-code-xml",
    title: "Clean Syntax",
    description: "Reads like pseudocode, compiles like assembly. No ceremony, no boilerplate.",
  },
  {
    icon: "i-lucide-monitor-smartphone",
    title: "Cross-Platform",
    description: "Build CLI tools, servers, and games for Linux, Windows, and macOS from the same source.",
  },
];

/**
 * The toolchain numbers, laid out as nuxt.com's "Built on proven tools" panel:
 * the figure is the card title and the old caption becomes the description.
 *
 * Each card carries its own hue, on the figure and in the background wash —
 * the same per-card tinting nuxt.com gives its Vue / Vite / Nitro cards. Class
 * names are spelled out in full rather than assembled from parts, because
 * Tailwind scans this file as plain text and never sees a concatenation.
 *
 * The claims themselves are unchanged from the plain stat row this replaced.
 */
const stats = [
  {
    icon: "i-lucide-timer",
    value: "50ms",
    label: "Typical compile — no LLVM, no waiting.",
    color: "text-pink-500",
    gradient: "from-pink-500/10",
  },
  {
    icon: "i-lucide-package",
    value: "1",
    label: "Tiny binary for the whole toolchain.",
    color: "text-sky-500",
    gradient: "from-sky-500/10",
  },
  {
    icon: "i-lucide-circle-slash",
    value: "0",
    label: "Dependencies, VMs, or runtimes.",
    color: "text-emerald-500",
    gradient: "from-emerald-500/10",
  },
  {
    icon: "i-lucide-cpu",
    value: "100%",
    label: "Native machine code, full speed.",
    color: "text-amber-500",
    gradient: "from-amber-500/10",
  },
];

/**
 * Editor support. An entry without `to`/`cta` has no extension yet and renders
 * as an unlinked card with a "Coming soon" badge — the union is declared
 * so those two stay optional rather than being inferred away.
 *
 * Icons come from the multi-colour `logos` set rather than monochrome Simple
 * Icons, so each product keeps its own brand mark. Three exceptions fall back to
 * Simple Icons plus a tint class, which is how nuxt.com colours its own stat
 * tiles (`text-red-500` on npm, `text-indigo-400` on Discord):
 *   - `logos` has no Zed entry at all;
 *   - `logos:neovim` is the wide wordmark, which squashes in a square tile;
 *   - Helix uses the violet from its official multi-colour logo.
 *
 * Six editors split 3 / centre / 3 across the bento.
 */
const editors: { name: string; icon: string; iconClass?: string; to?: string; cta?: string }[] = [
  {
    name: "Visual Studio Code",
    to: "https://marketplace.visualstudio.com/items?itemName=rux-lang.vscode-rux",
    icon: "i-logos-visual-studio-code",
    cta: "Get extension",
  },
  {
    name: "Zed",
    to: "https://zed.dev/extensions/rux",
    icon: "i-simple-icons-zedindustries",
    cta: "Get extension",
  },
  {
    name: "Sublime Text",
    to: "https://packagecontrol.io/packages/Rux",
    icon: "i-logos-sublimetext-icon",
    cta: "Get package",
  },
  {
    name: "Neovim",
    icon: "i-simple-icons-neovim",
    iconClass: "text-green-500",
  },
  {
    name: "Helix",
    icon: "i-simple-icons-helix",
    iconClass: "text-[#706bc8]",
  },
  {
    name: "JetBrains IDEs",
    icon: "i-logos-jetbrains",
  },
];

// The bento puts three cards either side of the centre panel.
const editorsLeft = computed(() => editors.slice(0, 3));
const editorsRight = computed(() => editors.slice(3));

// Shown in the hero's announcement badge; see nuxt.config runtimeConfig.
const { ruxVersion } = useRuntimeConfig().public;

// Each topic owns a small CodeTree partial. Keeping the tab metadata here makes
// the navigation visible to Nuxt's icon bundler while the Rux source remains
// hand-editable Markdown content.
const exampleDefinitions = [
  {
    label: "Basics",
    icon: "i-lucide-message-square-text",
    value: "basics",
    path: "/partials/home-examples/basics",
  },
  {
    label: "Functions",
    icon: "i-lucide-square-function",
    value: "functions",
    path: "/partials/home-examples/functions",
  },
  {
    label: "Types",
    icon: "i-lucide-layout-panel-top",
    value: "types",
    path: "/partials/home-examples/types",
  },
  {
    label: "Memory",
    icon: "i-lucide-memory-stick",
    value: "memory",
    path: "/partials/home-examples/memory",
  },
  {
    label: "Imports",
    icon: "i-lucide-import",
    value: "imports",
    path: "/partials/home-examples/imports",
  },
] satisfies Array<TabsItem & { path: string }>;

const { data: examplePages } = await useAsyncData("home-examples", async () => {
  const pages = await Promise.all(
    exampleDefinitions.map(async ({ value, path }) => {
      const page = await queryCollection("partials").path(path).first();
      if (!page) {
        throw createError({
          statusCode: 500,
          statusMessage: `Missing home example partial: ${path}`,
        });
      }

      return [String(value), page] as const;
    }),
  );

  return Object.fromEntries(pages);
});

function getExamplePage(value: TabsItem["value"]) {
  const page = examplePages.value?.[String(value)];
  if (!page) {
    throw createError({
      statusCode: 500,
      statusMessage: `Missing rendered home example: ${String(value)}`,
    });
  }

  return page;
}

// The landing page is the one place the hero wash runs at full strength, as on
// nuxt.com; every other page damps it down.
definePageMeta({ heroBackground: "" });

useSeoMeta({
  title: "Rux Programming Language",
  titleTemplate: "%s",
  description: "Fast, compiled, strongly typed, multi-paradigm language",
  ogTitle: "Rux Programming Language",
  ogDescription: "Fast, compiled, strongly typed, multi-paradigm language",
  ogType: "website",
  ogUrl: "https://rux-lang.dev",
  ogImage: "https://rux-lang.dev/images/og-rux.png",
  twitterCard: "summary_large_image",
  twitterTitle: "Rux Programming Language",
  twitterDescription: "Fast, compiled, strongly typed, multi-paradigm language",
  twitterImage: "https://rux-lang.dev/images/og-rux.png",
});

useHead({ link: [{ rel: "canonical", href: "https://rux-lang.dev/" }] });
</script>

<template>
  <div>
    <UPageHero
      class="relative"
      orientation="horizontal"
      :ui="{
        container: '!pb-20 py-24 sm:py-32 lg:py-40',
        title: 'text-5xl sm:text-7xl',
        wrapper: 'lg:min-h-[540px]',
      }"
    >
      <template #headline>
        <NuxtLink to="/download">
          <UBadge variant="subtle" size="lg" class="relative rounded-full px-3 font-semibold">
            Rux v{{ ruxVersion }} is available
            <UIcon name="i-lucide-arrow-right" class="pointer-events-none size-4" />
          </UBadge>
        </NuxtLink>
      </template>

      <template #title><span class="text-primary">Rux</span> Language</template>

      <template #description>Fast, compiled, strongly typed, multi-paradigm programming language.</template>

      <template #links>
        <div class="flex w-full flex-col gap-4">
          <div class="flex flex-wrap items-center gap-2">
            <UButton to="/docs/start" size="xl" icon="i-lucide-rocket" label="Get Started" />
            <UButton
              to="/docs/lang"
              size="xl"
              color="neutral"
              variant="subtle"
              icon="i-lucide-book-open"
              label="Reference"
            />
          </div>
          <InputCopy value="curl -fsSL https://rux-lang.dev/install.sh | sh" size="xl" />
        </div>
      </template>

      <!-- Nuxt.com's hero treatment: topic tabs above a persistent CodeTree.
           The panel becomes full-bleed on small screens, then docks to the
           right of the copy with a fixed-height tree/editor split. -->
      <UPageCard
        v-if="examplePages"
        class="right-0 -mx-4 w-screen max-w-[800px] overflow-auto rounded-none sm:-mx-6 lg:absolute lg:-mt-16 lg:mx-0 lg:w-[calc(50%-2rem)] lg:rounded-l-[calc(var(--ui-radius)*4)] [@media(min-width:2400px)]:relative [@media(min-width:2400px)]:right-auto [@media(min-width:2400px)]:mx-auto [@media(min-width:2400px)]:mt-8 [@media(min-width:2400px)]:w-full [@media(min-width:2400px)]:rounded-2xl"
        variant="subtle"
        :ui="{
          container: 'w-full sm:pt-4.5 lg:pr-0 [@media(min-width:2400px)]:px-6',
        }"
      >
        <UTabs
          :items="exampleDefinitions"
          default-value="basics"
          :unmount-on-hide="false"
          color="neutral"
          :ui="{
            list: 'overflow-x-auto bg-transparent px-0 lg:pr-4',
            trigger:
              'group shrink-0 data-[state=active]:text-highlighted in-[[data-slot=list]:not(:has([data-slot=indicator]))]:data-[state=active]:before:bg-default',
            indicator: 'bg-default',
            leadingIcon: 'hidden size-4 group-data-[state=active]:text-primary sm:inline-flex',
            content:
              'bg-default opacity-100 transition-opacity duration-500 data-[state=inactive]:opacity-0 lg:h-[450px] [@media(min-width:2400px)]:rounded-l-[calc(var(--ui-radius)*1.5)] [@media(min-width:2400px)]:border-e [@media(min-width:2400px)]:border-default',
          }"
        >
          <template #content="{ item }">
            <ContentRenderer :value="getExamplePage(item.value)" />
          </template>
        </UTabs>
      </UPageCard>
    </UPageHero>

    <!--
      Modelled on nuxt.com's "Everything you need, nothing you don't": left-aligned
      heading, a top border with a muted-to-default wash, and flat vertical
      UPageFeatures rather than bordered cards — the grid reads as one block
      instead of eight boxes. The last cell is a CTA, as there.

      Three columns rather than nuxt.com's four: eight features plus the CTA make
      exactly 3x3, where four columns would leave a ragged trailing row.
    -->
    <UPageSection
      title="Why Rux"
      description="Built for people who want the speed of native code without giving up clarity."
      :ui="{
        title: 'text-left',
        description: 'text-left',
        root: 'border-t border-default bg-linear-to-b from-muted to-default dark:from-muted/40',
        features: 'lg:grid-cols-3 lg:gap-10',
      }"
    >
      <!--
        The cells rise and fade in as the section scrolls into view, staggered
        100ms apart, exactly as nuxt.com animates its own feature grid. `once`
        matters: without it the whole grid replays every time it re-enters the
        viewport, which reads as a glitch rather than an entrance.
      -->
      <template #features>
        <Motion
          v-for="(f, index) in features"
          :key="f.title"
          as="li"
          :initial="{ opacity: 0, transform: 'translateY(10px)' }"
          :while-in-view="{ opacity: 1, transform: 'translateY(0)' }"
          :transition="{ delay: 0.1 * index }"
          :in-view-options="{ once: true }"
        >
          <UPageFeature :icon="f.icon" :title="f.title" :description="f.description" orientation="vertical" />
        </Motion>

        <!-- The CTA cell lands last, one step after the final feature. -->
        <Motion
          as="li"
          :initial="{ opacity: 0, transform: 'translateY(10px)' }"
          :while-in-view="{ opacity: 1, transform: 'translateY(0)' }"
          :transition="{ delay: 0.1 * features.length }"
          :in-view-options="{ once: true }"
          class="bg-muted/50 flex h-full flex-col justify-center gap-4 p-4"
        >
          <span class="text-lg font-semibold">Dive into the language</span>
          <div>
            <UButton to="/docs/lang" label="Start reading docs" trailing icon="i-lucide-arrow-right" />
          </div>
        </Motion>
      </template>
    </UPageSection>

    <UPageSection
      title="Up and Running in Seconds"
      description="One small download gives you the compiler, linter, package manager, formatter, and test runner. No SDKs to chain together, nothing else to install."
    >
      <!--
        nuxt.com's "Built on proven tools" treatment: no gap, and every card but
        the last drops the border on its trailing edge, so the row reads as one
        segmented panel rather than four boxes. Only the outer corners round.

        Upstream switches to columns at `sm` because it has three cards; four
        need more room, so this waits for `lg`.

        The wash is the Rux violet on every card. nuxt.com varies the tint per
        card because each is a different product's brand — these four are all
        facets of one toolchain, so a different hue each would be decoration
        with nothing behind it.
      -->
      <div class="grid grid-cols-1 lg:grid-cols-4">
        <Motion
          v-for="(s, index) in stats"
          :key="s.value"
          class="flex"
          :initial="{ opacity: 0, transform: 'translateY(10px)' }"
          :while-in-view="{ opacity: 1, transform: 'translateY(0)' }"
          :transition="{ delay: 0.1 * index }"
          :in-view-options="{ once: true }"
        >
          <UPageCard
            :title="s.value"
            :description="s.label"
            class="h-full w-full"
            :ui="{
              root: [
                'rounded-none border border-default ring-0 bg-linear-to-br from-5% via-transparent via-50% to-transparent',
                s.gradient,
                index === 0 ? 'max-lg:rounded-t-lg lg:rounded-s-lg' : '',
                index === stats.length - 1 ? 'max-lg:rounded-b-lg lg:rounded-e-lg' : 'max-lg:border-b-0 lg:border-r-0',
              ].join(' '),
              title: `text-4xl font-bold tabular-nums ${s.color}`,
            }"
          >
            <template #leading>
              <UIcon :name="s.icon" class="size-6" :class="s.color" />
            </template>
          </UPageCard>
        </Motion>
      </div>
    </UPageSection>

    <UPageSection
      title="Works With Your Editor"
      description="Syntax highlighting and language support, wherever you write code."
      :ui="{ root: 'border-t border-default bg-linear-to-b from-muted to-default dark:from-muted/40' }"
    >
      <!--
        nuxt.com's "Trusted by developers worldwide" bento: two narrow columns of
        small cards flanking one tall panel. Six editors split 3 / centre / 3.
      -->
      <div class="flex flex-col gap-4 md:flex-row">
        <div class="flex flex-col gap-4 md:w-1/4">
          <HomeEditorCard v-for="(e, index) in editorsLeft" :key="e.name" :editor="e" :index="index" />
        </div>

        <div class="md:w-1/2">
          <!-- Not `as-child`: see the note in HomeEditorCard.vue — it would put
               the transform on UPageCard's stretched link and break the card. -->
          <Motion
            class="h-full"
            :initial="{ opacity: 0, transform: 'translateY(10px)' }"
            :while-in-view="{ opacity: 1, transform: 'translateY(0)' }"
            :transition="{ delay: 0.3 }"
            :in-view-options="{ once: true }"
          >
            <UPageCard class="h-full" variant="subtle" to="https://github.com/rux-lang" target="_blank">
              <div class="flex h-full flex-col items-center justify-around gap-4 text-center">
                <span class="text-xl font-semibold">Missing your editor?</span>
                <p class="text-muted">
                  Rux editor support is developed in the open, one repository per editor. Add the one you use.
                </p>
                <!-- UPageCard links via a stretched overlay rather than by
                     wrapping its content, so this is a sibling anchor, not a
                     nested one. It carries the same `to` so it works whichever
                     of the two receives the click. -->
                <UButton
                  class="w-fit"
                  label="Contribute support"
                  icon="i-simple-icons-github"
                  color="neutral"
                  to="https://github.com/rux-lang"
                  target="_blank"
                />
              </div>
            </UPageCard>
          </Motion>
        </div>

        <div class="flex flex-col gap-4 md:w-1/4">
          <HomeEditorCard v-for="(e, index) in editorsRight" :key="e.name" :editor="e" :index="index" />
        </div>
      </div>
    </UPageSection>

    <!-- Registry data, fetched in the browser. See the component. -->
    <HomePackages />

    <!--
      nuxt.com renders Sponsors as a UPageSection sitting in the same
      muted-to-default band every other section uses, not as a floating card —
      so this is a section with that root recipe rather than a subtle UPageCTA.
    -->
    <UPageSection
      title="Sponsors"
      description="Rux is free, open source, and developed independently. You could be the first."
      :links="[
        {
          label: 'Become a Sponsor',
          to: '/support',
          icon: 'i-lucide-heart',
        },
      ]"
      :ui="{
        root: 'border-t border-default bg-linear-to-b from-muted to-default dark:from-muted/40',
        container: 'py-12 sm:py-16 lg:py-20',
        title: 'lg:text-5xl',
      }"
    />
  </div>
</template>
