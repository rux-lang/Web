<script setup lang="ts">
import { PARTS } from "~~/scripts/learn-course.mjs";

/**
 * The Learn Rux road map on /docs/learn, used in Markdown as `:learn-roadmap`.
 *
 * It replaced a Mermaid flowchart: 25 parts in one diagram is wider than the
 * prose column, and Mermaid shrinks the whole SVG to fit, text included. Laid
 * out as HTML the stages stack and the part cards reflow, so the text stays at
 * reading size on every screen, and every part is a link.
 *
 * Part titles, icons, summaries and checkpoint projects come from
 * scripts/learn-course.mjs, the outline sync-learn.mjs files the pages by. The
 * lesson counts come from the sidebar navigation, so they follow the content.
 */
type Part = {
  number: number;
  slug: string;
  title: string;
  icon: string;
  summary: string;
  checkpoints?: { slug: string; title: string }[];
};

const parts = PARTS as Part[];
const range = (from: number, to: number) => parts.filter((p) => p.number >= from && p.number <= to);

const stages = [
  {
    title: "The language",
    caption: "Parts 1–13",
    order: "In order",
    description: "Each part builds on the ones before it.",
    parts: range(1, 13),
  },
  {
    title: "In depth",
    caption: "Parts 14–17",
    order: "In order",
    description: "Text, memory, numbers and collections, with the whole language to hand.",
    parts: range(14, 17),
  },
  {
    title: "Standard packages",
    caption: "Parts 18–24",
    order: "Any order",
    description: "A tour of the standard library. Pick the parts you need.",
    parts: range(18, 24),
  },
  {
    title: "Projects",
    caption: "Part 25",
    order: "Checkpoints",
    description: "Complete programs. Each one is ready as soon as its part is done — look for the flags.",
    parts: range(25, 25),
  },
];

const start = [
  { title: "Install", icon: "i-lucide-download", to: "/docs/learn/install/windows" },
  { title: "Set up an editor", icon: "i-lucide-square-pen", to: "/docs/learn/editors/vscode" },
  { title: "First project", icon: "i-lucide-rocket", to: "/docs/learn/first-project" },
  { title: "Learn with AI", icon: "i-lucide-sparkles", to: "/docs/learn/ai" },
];

// Each part's sidebar group holds its overview plus one entry per lesson.
const { book } = useDocsSection();
const lessonCount = (slug: string) => {
  const group = book.value?.children?.find((item) => item.path === `/docs/learn/${slug}`);
  return group?.children ? group.children.length - 1 : undefined;
};
</script>

<template>
  <div class="my-8">
    <!-- Getting started -->
    <section class="rounded-lg border border-default bg-elevated/40 p-4 sm:p-5">
      <header class="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1">
        <span
          class="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/20 ring-1 ring-primary/40 text-primary"
        >
          <UIcon name="i-lucide-flag-triangle-right" class="size-4" />
        </span>
        <span class="font-semibold text-highlighted">Getting started</span>
        <span class="text-sm text-muted">Install the toolchain and run your first program.</span>
      </header>
      <ul class="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <li v-for="step in start" :key="step.to">
          <ULink
            :to="step.to"
            class="flex h-full items-center gap-2 rounded-md border border-default bg-default px-3 py-2 text-sm font-medium text-highlighted transition-colors hover:border-primary"
          >
            <UIcon :name="step.icon" class="size-4 shrink-0 text-primary" />
            {{ step.title }}
          </ULink>
        </li>
      </ul>
    </section>

    <template v-for="(stage, index) in stages" :key="stage.title">
      <div class="flex justify-center py-1.5 text-dimmed" aria-hidden="true">
        <UIcon name="i-lucide-arrow-down" class="size-5" />
      </div>

      <section class="rounded-lg border border-default bg-elevated/40 p-4 sm:p-5">
        <header class="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1">
          <span
            class="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/20 ring-1 ring-primary/40 text-sm font-semibold text-primary"
          >
            {{ index + 1 }}
          </span>
          <span class="font-semibold text-highlighted">{{ stage.title }}</span>
          <span class="text-sm text-muted">{{ stage.caption }}</span>
          <UBadge
            :label="stage.order"
            :color="stage.order === 'Any order' ? 'neutral' : 'primary'"
            variant="subtle"
            size="sm"
            class="ms-auto"
          />
          <p class="w-full text-sm text-muted">{{ stage.description }}</p>
        </header>

        <ol class="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          <li v-for="part in stage.parts" :key="part.slug">
            <ULink
              :to="`/docs/learn/${part.slug}`"
              class="group flex h-full gap-3 rounded-md border border-default bg-default p-3 transition-colors hover:border-primary"
            >
              <UIcon :name="part.icon" class="mt-0.5 size-5 shrink-0 text-primary" />
              <span class="min-w-0">
                <span class="block font-medium text-highlighted">{{ part.number }}. {{ part.title }}</span>
                <span class="block text-sm text-muted">
                  {{ part.summary }}
                  <span v-if="lessonCount(part.slug)" class="whitespace-nowrap text-dimmed">
                    · {{ lessonCount(part.slug) }} lessons
                  </span>
                </span>
                <span v-if="part.checkpoints" class="mt-1 flex items-start gap-1 text-sm text-primary">
                  <UIcon name="i-lucide-flag" class="mt-0.5 size-3.5 shrink-0" />
                  <span>Checkpoint: {{ part.checkpoints.map((c) => c.title).join(", ") }}</span>
                </span>
              </span>
            </ULink>
          </li>
        </ol>
      </section>
    </template>
  </div>
</template>
