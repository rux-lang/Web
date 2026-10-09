<script setup lang="ts">
/**
 * One entry of a lesson's "Common mistakes" section, written in Markdown as
 *
 *   ::mistake
 *   **Mixing an integer and a float.**\
 *   When `a` is an `int32` and `y` is a `float64`, `a / y` fails with:
 *
 *   ```text
 *   error: operator '/' cannot combine left operand 'int32' with right operand 'float64'
 *   ```
 *
 *   Convert one side with `as` so both have the same type.
 *   ::
 *
 * These used to be Nuxt UI `::warning` callouts — 741 of them, three or four to
 * a page — and a stack of amber boxes with amber text read as a wall of alarms,
 * worst on a phone. Here the text stays in the page's own colours and a thin
 * amber rule groups each entry; the opening bold line is the title and gets the
 * warning icon.
 *
 * Unlike the callouts it does not unwrap its paragraphs, so the slot can hold
 * several of them and a fenced block for a compiler message.
 */
</script>

<template>
  <aside class="mistake">
    <slot />
  </aside>
</template>

<style scoped>
/* Tailwind's amber, as literals: the theme only emits the colour variables a
   utility class somewhere actually uses. */
.mistake {
  --mistake-rule: #f59e0b; /* amber-500 */
  --mistake-icon: #d97706; /* amber-600 */
  margin-block: 1.5rem;
  border-left: 3px solid var(--mistake-rule);
  padding-left: 1rem;
}
:global(.dark) .mistake {
  --mistake-rule: #d97706; /* amber-600 */
  --mistake-icon: #fbbf24; /* amber-400 */
}
.mistake :deep(> :first-child) {
  margin-top: 0;
}
.mistake :deep(> :last-child) {
  margin-bottom: 0;
}
.mistake :deep(> p) {
  margin-block: 0.5rem;
}

/* The title: the bold run that opens the first paragraph. */
.mistake :deep(> p:first-child > strong:first-child) {
  color: var(--ui-text-highlighted);
}
.mistake :deep(> p:first-child > strong:first-child)::before {
  content: "";
  display: inline-block;
  width: 1.05em;
  height: 1.05em;
  margin-right: 0.45em;
  vertical-align: -0.17em;
  background-color: var(--mistake-icon);
  /* Lucide "triangle-alert", the icon Nuxt UI's warning callout used. */
  mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23000' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3'/%3E%3Cpath d='M12 9v4'/%3E%3Cpath d='M12 17h.01'/%3E%3C/svg%3E")
    center / contain no-repeat;
}
/* A compiler message pulled out of the sentence: tighter than a program listing. */
.mistake :deep(pre) {
  margin-block: 0.5rem;
  padding: 0.5rem 0.75rem;
  font-size: 0.8125rem;
  line-height: 1.5;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}
/* Nobody copies an error message, and on a phone the button sits on its text. */
.mistake :deep(button) {
  display: none;
}
</style>
