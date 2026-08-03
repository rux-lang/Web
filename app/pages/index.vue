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
const features = [
  {
    icon: "/icons/rocket.svg",
    title: "Native Performance",
    description:
      "Compiles straight to native machine code. No virtual machine, no interpreter, no garbage collector pauses.",
  },
  {
    icon: "/icons/fast.svg",
    title: "Instant Toolchain",
    description: "Compiler, linter, package manager, formatter, and test runner — one small binary, zero dependencies.",
  },
  {
    icon: "/icons/block.svg",
    title: "Strong Types",
    description: "No implicit conversions, no surprises. Everything is checked at compile time and free at runtime.",
  },
  {
    icon: "/icons/shield.svg",
    title: "Memory Safety",
    description:
      "References are checked and safe, pointers are raw and unchecked. You choose — no hidden cost on either.",
  },
  {
    icon: "/icons/dna.svg",
    title: "Multi-Paradigm",
    description: "Imperative, functional, or data-oriented — pick what fits the problem, no forced style.",
  },
  {
    icon: "/icons/binary.svg",
    title: "Hardware Access",
    description: "Inline assembly, raw pointers, and FFI. When you need the metal, Rux gets out of the way.",
  },
  {
    icon: "/icons/code.svg",
    title: "Clean Syntax",
    description: "Reads like pseudocode, compiles like assembly. No ceremony, no boilerplate.",
  },
  {
    icon: "/icons/platform.svg",
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

const editors = [
  {
    name: "Visual Studio Code",
    to: "https://marketplace.visualstudio.com/items?itemName=rux-lang.vscode-rux",
    icon: "i-vscode-icons-file-type-vscode",
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
];

// generated from app/assets/examples/*.rux by scripts/sync-examples.mjs.
const { data: examples } = await useAsyncData("home-examples", () =>
  queryCollection("partials").path("/partials/home-examples").first(),
);

// Blog cards were hardcoded titles and dates in the old markup; drive them
// from the collection so they can never go stale.
const { data: posts } = await useAsyncData("home-posts", () =>
  queryCollection("docs")
    .where("path", "LIKE", "/blog/%")
    .where("extension", "=", "md")
    .order("date", "DESC")
    .limit(4)
    .all(),
);

definePageMeta({ layout: false });

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
    <UPageHero
      title="Rux Programming Language"
      description="Fast, compiled, strongly typed, multi-paradigm"
      :links="[
        {
          label: 'Get Started',
          to: '/start',
          size: 'xl',
          icon: 'i-lucide-rocket',
        },
        {
          label: 'Reference',
          to: '/docs',
          size: 'xl',
          color: 'neutral',
          variant: 'subtle',
        },
      ]"
    >
      <template #top>
        <img src="/images/mascot.svg" alt="Rux mascot" width="240" height="240" class="mx-auto h-48 w-auto sm:h-60" />
      </template>
    </UPageHero>

    <UPageSection
      title="Why Rux"
      description="Built for people who want the speed of native code without giving up clarity."
    >
      <UPageGrid>
        <UPageCard v-for="f in features" :key="f.title" :title="f.title" :description="f.description" spotlight>
          <template #leading>
            <img :src="f.icon" alt="" aria-hidden="true" width="32" height="32" class="size-8" />
          </template>
        </UPageCard>
      </UPageGrid>
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
      title="Clean Code"
      description="Code that does what it looks like it does — explicit, predictable, and free of ceremony."
    >
      <ContentRenderer v-if="examples" :value="examples" />
    </UPageSection>

    <UPageSection
      title="Works With Your Editor"
      description="Syntax highlighting and language support, wherever you write code."
    >
      <UPageGrid class="lg:grid-cols-3">
        <UPageCard
          v-for="e in editors"
          :key="e.name"
          :title="e.name"
          :description="e.cta"
          :to="e.to"
          target="_blank"
          :icon="e.icon"
        />
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
    />

    <UPageSection title="From the Blog">
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

      <div class="mt-8 text-center">
        <UButton to="/blog" color="neutral" variant="subtle" trailing-icon="i-lucide-arrow-right"> All posts </UButton>
      </div>
    </UPageSection>
  </div>
</template>
