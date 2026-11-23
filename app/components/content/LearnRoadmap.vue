<script setup lang="ts">
import { PARTS } from "~~/scripts/learn-course.mjs";

/**
 * The Learn Rux road map on /docs/learn, used in Markdown as `:learn-roadmap`.
 *
 * It replaced a Mermaid flowchart: 27 parts in one diagram is wider than the
 * prose column, and Mermaid shrinks the whole SVG to fit, text included. It is
 * laid out as a syllabus — one panel per stage, one row per part — so the text
 * stays at reading size on every screen, every part is a link, and the eye can
 * run straight down the titles. The checkpoint projects are not repeated here;
 * the "Checkpoint projects" table further down the page lists them.
 *
 * Part titles, icons and summaries come from scripts/learn-course.mjs, the
 * outline sync-learn.mjs files the pages by. The lesson counts come from the
 * sidebar navigation, so they follow the content.
 */
type Part = {
  number: number;
  slug: string;
  title: string;
  icon: string;
  summary: string;
};

const parts = PARTS as Part[];
const range = (from: number, to: number) => parts.filter((p) => p.number >= from && p.number <= to);

const stages = [
  {
    title: "The language",
    icon: "i-lucide-book-open",
    caption: "Parts 1–13",
    order: "In order",
    description: "Each part builds on the ones before it.",
    parts: range(1, 13),
  },
  {
    title: "In depth",
    icon: "i-lucide-layers",
    caption: "Parts 14–17",
    order: "In order",
    description: "Text, memory, numbers and collections, with the whole language to hand.",
    parts: range(14, 17),
  },
  {
    title: "Standard packages",
    icon: "i-lucide-package",
    caption: "Parts 18–26",
    order: "Any order",
    description: "A tour of the standard library. Pick the parts you need.",
    parts: range(18, 26),
  },
  {
    title: "Projects",
    icon: "i-lucide-hammer",
    caption: "Part 27",
    order: "Checkpoints",
    description: "Complete programs that combine what the earlier parts taught.",
    parts: range(27, 27),
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
const lessons = (slug: string) => {
  const group = book.value?.children?.find((item) => item.path === `/docs/learn/${slug}`);
  const count = group?.children ? group.children.length - 1 : 0;
  return count > 0 ? `${count} lesson${count === 1 ? "" : "s"}` : undefined;
};
</script>

<template>
  <div class="not-prose my-8 space-y-6">
    <section class="overflow-hidden rounded-lg border border-default">
      <header class="border-b border-default bg-elevated/50 px-4 py-3">
        <div class="flex items-center gap-2">
          <UIcon name="i-lucide-flag-triangle-right" class="size-5 shrink-0 text-primary" />
          <span class="font-semibold text-highlighted">Getting started</span>
        </div>
        <p class="mt-1 text-sm text-muted">Install the toolchain and run your first program.</p>
      </header>
      <ul class="grid divide-default sm:grid-cols-4 sm:divide-x">
        <li v-for="step in start" :key="step.to">
          <ULink
            :to="step.to"
            class="flex items-center gap-2 px-4 py-3 text-sm font-medium text-highlighted transition-colors hover:bg-elevated/60"
          >
            <UIcon :name="step.icon" class="size-4 shrink-0 text-primary" />
            {{ step.title }}
          </ULink>
        </li>
      </ul>
    </section>

    <section v-for="stage in stages" :key="stage.title" class="overflow-hidden rounded-lg border border-default">
      <!-- One layout for every stage, whatever the length of its text: icon,
           title and badge on the first line, the part range and description
           on the second. A single wrapping row put the badge at the end of a
           line in one header and alone on a line in the next. -->
      <header class="border-b border-default bg-elevated/50 px-4 py-3">
        <div class="flex items-center gap-2">
          <UIcon :name="stage.icon" class="size-5 shrink-0 text-primary" />
          <span class="font-semibold text-highlighted">{{ stage.title }}</span>
          <UBadge
            :label="stage.order"
            :color="stage.order === 'Any order' ? 'neutral' : 'primary'"
            variant="subtle"
            size="sm"
            class="ms-auto shrink-0"
          />
        </div>
        <p class="mt-1 text-sm text-muted">
          <span class="whitespace-nowrap">{{ stage.caption }}</span> · {{ stage.description }}
        </p>
      </header>
      <ol class="divide-y divide-default">
        <li v-for="part in stage.parts" :key="part.slug">
          <ULink
            :to="`/docs/learn/${part.slug}`"
            class="group grid grid-cols-[1.75rem_1.25rem_minmax(0,1fr)_auto] items-center gap-x-3 px-4 py-2.5 transition-colors hover:bg-elevated/60"
          >
            <span class="text-end text-sm text-dimmed tabular-nums">{{ part.number }}</span>
            <UIcon :name="part.icon" class="size-5 text-muted group-hover:text-primary" />
            <span class="min-w-0 sm:flex sm:items-baseline sm:gap-3">
              <span class="block shrink-0 font-medium text-highlighted">{{ part.title }}</span>
              <span class="block truncate text-sm text-muted">{{ part.summary }}</span>
            </span>
            <span v-if="lessons(part.slug)" class="text-sm text-dimmed tabular-nums">
              {{ lessons(part.slug) }}
            </span>
          </ULink>
        </li>
      </ol>
    </section>
  </div>
</template>
