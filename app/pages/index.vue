<script setup lang="ts">
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
    icon: "i-lucide-shield-check",
    title: "Memory Safety",
    description:
      "References are checked and safe, pointers are raw and unchecked. You choose — no hidden cost on either.",
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

const stats = [
  { value: "50ms", label: "typical compile — no LLVM, no waiting" },
  { value: "1", label: "tiny binary for the whole toolchain" },
  { value: "0", label: "dependencies, VMs, or runtimes" },
  { value: "100%", label: "native machine code, full speed" },
];

/**
 * Editor support. An entry without `to`/`cta` has no extension yet and renders
 * as an unlinked card with an "Under development" badge — the union is declared
 * so those two stay optional rather than being inferred away.
 *
 * All Simple Icons, including VS Code: it used to be the odd one out on the
 * vscode-icons set, which draws a file-type glyph rather than the product mark
 * the other five use.
 */
const editors: { name: string; icon: string; to?: string; cta?: string }[] = [
  {
    name: "Visual Studio Code",
    to: "https://marketplace.visualstudio.com/items?itemName=rux-lang.vscode-rux",
    icon: "i-simple-icons-visualstudiocode",
    cta: "Get extension",
  },
  {
    name: "Zed",
    to: "https://github.com/rux-lang/Zed",
    icon: "i-simple-icons-zedindustries",
    cta: "Get extension",
  },
  {
    name: "Sublime Text",
    to: "https://packagecontrol.io/packages/Rux",
    icon: "i-simple-icons-sublimetext",
    cta: "Get package",
  },
  { name: "Neovim", icon: "i-simple-icons-neovim" },
  { name: "JetBrains IDEs", icon: "i-simple-icons-jetbrains" },
  { name: "Emacs", icon: "i-simple-icons-gnuemacs" },
];

// Shown in the hero's announcement badge; see nuxt.config runtimeConfig.
const { ruxVersion } = useRuntimeConfig().public;

// Hand-edited MDC partial; the tab icons are mapped in app.config.ts.
const { data: examples } = await useAsyncData("home-examples", () =>
  queryCollection("partials").path("/partials/home-examples").first(),
);

// The landing page is the one place the hero wash runs at full strength, as on
// nuxt.com; every other page damps it down.
definePageMeta({ layout: false, heroBackground: "" });

useSeoMeta({
  title: "Rux Programming Language",
  titleTemplate: "%s",
  description: "Fast, compiled, strongly typed, multi-paradigm language",
  ogTitle: "Rux Programming Language",
  ogDescription: "Fast, compiled, strongly typed, multi-paradigm language",
  ogType: "website",
  ogUrl: "https://rux-lang.dev",
  ogImage: "https://rux-lang.dev/images/og-rux.jpg",
  twitterCard: "summary_large_image",
  twitterTitle: "Rux Programming Language",
  twitterDescription: "Fast, compiled, strongly typed, multi-paradigm language",
  twitterImage: "https://rux-lang.dev/images/og-rux.jpg",
});

useHead({ link: [{ rel: "canonical", href: "https://rux-lang.dev/" }] });
</script>

<template>
  <div>
    <!--
      Horizontal hero: copy on the left, a live code sample on the right, as on
      nuxt.com. Their `lg:py-40` and `min-h-[540px]` are tuned to a taller left
      column than this one and leave a blank band under the hero, so the padding
      is dialled back and the min-height dropped.
    -->
    <UPageHero
      orientation="horizontal"
      :ui="{
        container: 'py-20 sm:py-24 lg:py-28',
        title: 'text-5xl sm:text-7xl',
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
            <UButton to="/start" size="xl" icon="i-lucide-rocket" label="Get Started" />
            <UButton
              to="/docs"
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

      <!--
        The source viewer. `home-examples` is a ::code-group, which Nuxt UI's
        prose already renders as a tabbed panel with its own border and header —
        so it is dropped in directly rather than nested inside a UPageCard, which
        would double the chrome. The height cap (see main.css) keeps the longest
        sample from stretching the hero; the code block scrolls instead.
      -->
      <div v-if="examples" class="home-code-viewer w-full min-w-0">
        <ContentRenderer :value="examples" />
      </div>
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
      <template #features>
        <li v-for="f in features" :key="f.title">
          <UPageFeature :icon="f.icon" :title="f.title" :description="f.description" orientation="vertical" />
        </li>

        <li class="bg-muted/50 flex h-full flex-col justify-center gap-4 p-4">
          <span class="text-lg font-semibold">Dive into the language</span>
          <div>
            <UButton to="/docs" label="Start reading docs" trailing icon="i-lucide-arrow-right" />
          </div>
        </li>
      </template>
    </UPageSection>

    <UPageSection
      title="Up and Running in Seconds"
      description="One small download gives you the compiler, linter, package manager, formatter, and test runner. No SDKs to chain together, nothing else to install."
    >
      <dl class="grid grid-cols-2 gap-6 sm:grid-cols-4">
        <div v-for="s in stats" :key="s.label" class="text-center">
          <dt class="text-4xl font-bold text-primary tabular-nums">
            {{ s.value }}
          </dt>
          <dd class="mt-2 text-sm text-muted text-balance">
            {{ s.label }}
          </dd>
        </div>
      </dl>
    </UPageSection>

    <UPageSection
      title="Works With Your Editor"
      description="Syntax highlighting and language support, wherever you write code."
      :ui="{ root: 'border-t border-default bg-linear-to-b from-muted to-default dark:from-muted/40' }"
    >
      <UPageGrid class="lg:grid-cols-3">
        <UPageCard v-for="e in editors" :key="e.name" variant="subtle" :to="e.to" :target="e.to ? '_blank' : undefined">
          <div class="flex items-center gap-3">
            <!-- The boxed mark is nuxt.com's stat-tile treatment: a bordered,
                 default-background square that keeps six different brand glyphs
                 reading as one set despite their varying weights. -->
            <div class="border-default bg-default flex items-center justify-center rounded-lg border p-2">
              <UIcon :name="e.icon" class="size-6" />
            </div>
            <div class="flex min-w-0 flex-col items-start gap-1">
              <span class="text-highlighted text-lg font-semibold">{{ e.name }}</span>
              <p v-if="e.cta" class="text-sm">{{ e.cta }}</p>
              <UBadge v-else variant="subtle" color="neutral" size="sm">Under development</UBadge>
            </div>
          </div>
        </UPageCard>
      </UPageGrid>
    </UPageSection>

    <UPageCTA
      title="Sponsors"
      description="Rux is free, open source, and developed independently. You could be the first."
      :links="[
        {
          label: 'Become a Sponsor',
          to: '/support',
          icon: 'i-lucide-heart',
        },
      ]"
      variant="subtle"
      class="my-16"
      :ui="{ title: 'lg:text-5xl' }"
    />
  </div>
</template>
