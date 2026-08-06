<script setup lang="ts">
/**
 * The playground.
 *
 * A Vue page rather than a Markdown one: a static route outranks the
 * `[...slug]` catch-all, so `content/playground.md` would have been a row in
 * the content database that nothing could ever render. `/playground` is
 * restated in `scripts/routes.mjs` for exactly the reason `/` and `/blog` are —
 * that file is both the prerender seed and the `verify:routes` oracle, and it
 * derives everything else from the content tree.
 *
 * Every request happens in the browser. The page prerenders to an empty shell,
 * the editor arrives with the client bundle, and nothing here runs on a server
 * because there is no server — see CLAUDE.md's Playground section.
 */
import { computed, ref, watch } from "vue";
import type { ApiFailure } from "~/types/api";
import type {
  PlaygroundLimits,
  PlaygroundMode,
  PlaygroundProfile,
  PlaygroundRejection,
  PlaygroundResult,
} from "~/types/playground";
import { normalizeApiError } from "~/utils/api-problem";
import {
  buildRunRequest,
  normalizePlaygroundLimits,
  normalizePlaygroundResult,
  playgroundLimitsPath,
  playgroundRunPath,
} from "~/utils/playground";
import { defaultPlaygroundExample, playgroundExample, playgroundExamples } from "~/utils/playground-examples";

definePageMeta({ heroBackground: "opacity-30" });

useSeoMeta({
  title: "Playground",
  description:
    "Write, compile, and run Rux code directly in your browser — no installation required. Experiment with the language using the live Rux Playground.",
  ogTitle: "Rux Playground",
  ogDescription:
    "Write, compile, and run Rux code directly in your browser — no installation required. Experiment with the language using the live Rux Playground.",
  ogType: "website",
  ogUrl: "https://rux-lang.dev/playground",
  ogImage: "https://rux-lang.dev/images/og-playground.jpg",
  twitterCard: "summary_large_image",
  twitterTitle: "Rux Playground",
  twitterImage: "https://rux-lang.dev/images/og-playground.jpg",
});

useHead({
  link: [{ rel: "canonical", href: "https://rux-lang.dev/playground" }],
});

const api = useRegistryApi();

const example = ref(defaultPlaygroundExample.value);
const source = ref(defaultPlaygroundExample.source);
const stdin = ref(defaultPlaygroundExample.stdin);
const stdinOpen = ref(defaultPlaygroundExample.stdin.length > 0);
const profile = ref<PlaygroundProfile>("debug");

const pending = ref<PlaygroundMode | null>(null);
const result = ref<PlaygroundResult | null>(null);
const failure = ref<ApiFailure | null>(null);
const rejection = ref<PlaygroundRejection | null>(null);
const lastMode = ref<PlaygroundMode>("run");

const editor = ref<{ focusLine: (line: number, column?: number) => void } | null>(null);

// One request at a time. A second Run aborts the first rather than racing it,
// so a slow compile can never overwrite the result of the run after it.
let inFlight: AbortController | null = null;

/**
 * The sandbox's own bounds, used to reject an oversized buffer before it
 * becomes a round trip and to fill the Details tab. Lazy and client-only, as
 * every registry read on this site is: awaiting it would hold the whole page
 * on a request the editor does not need.
 */
const { data: limitsPayload } = useLazyAsyncData(
  "playground-limits",
  (_nuxtApp, { signal }) => api.get<unknown>(playgroundLimitsPath, undefined, signal),
  { server: false },
);

const limits = computed<PlaygroundLimits | null>(() => normalizePlaygroundLimits(limitsPayload.value));
const empty = computed(() => source.value.trim().length === 0);

async function submit(mode: PlaygroundMode) {
  const built = buildRunRequest(source.value, mode, profile.value, stdin.value, limits.value ?? undefined);
  rejection.value = built.rejection;
  if (!built.request) return;

  lastMode.value = mode;
  inFlight?.abort();
  const request = new AbortController();
  inFlight = request;
  pending.value = mode;
  failure.value = null;

  try {
    const payload = await api.post<unknown>(playgroundRunPath, { ...built.request }, request.signal);
    if (request.signal.aborted) return;

    const parsed = normalizePlaygroundResult(payload);
    if (!parsed) {
      failure.value = {
        title: "Unexpected response",
        detail: "The playground answered with something this page could not read. Try again.",
        errors: [],
        retryable: true,
      };
      return;
    }

    // The last result stays on screen until a new one lands, so a re-run never
    // blanks the panel it is about to fill.
    result.value = parsed;
    if (parsed.formatted !== null) source.value = parsed.formatted;
  } catch (error) {
    if (request.signal.aborted) return;
    failure.value = normalizeApiError(error);
  } finally {
    if (inFlight === request) {
      inFlight = null;
      pending.value = null;
    }
  }
}

function retry() {
  return submit(lastMode.value);
}

// A new example replaces the buffer, and opens the standard-input pane when the
// program reads from it — Circle is unusable without it and the pane is closed
// by default.
watch(example, (value) => {
  const chosen = playgroundExample(value);
  if (!chosen) return;

  source.value = chosen.source;
  stdin.value = chosen.stdin;
  stdinOpen.value = chosen.stdin.length > 0;
  result.value = null;
  failure.value = null;
  rejection.value = null;
});
</script>

<template>
  <UContainer class="py-8 sm:py-12">
    <div class="mb-6">
      <h1 class="text-highlighted text-3xl font-bold tracking-tight sm:text-4xl">Playground</h1>
      <p class="text-muted mt-2 max-w-2xl">
        Write, compile, and run Rux in the browser. Each run happens in a throwaway container with no network access,
        and nothing you write is stored.
      </p>
    </div>

    <PlaygroundToolbar
      v-model:profile="profile"
      v-model:example="example"
      :examples="playgroundExamples"
      :pending="pending"
      :disabled="empty"
      @submit="submit"
    />

    <UAlert
      v-if="rejection"
      class="mt-3"
      color="warning"
      variant="subtle"
      icon="i-lucide-circle-alert"
      title="The submission was not sent"
      :description="rejection.message"
    />

    <div class="mt-4 grid gap-4 lg:grid-cols-2">
      <div class="flex flex-col gap-3">
        <!-- The editor fills whatever box it is given, so the height lives here
             rather than inside the component. -->
        <div class="h-[26rem] lg:h-[34rem]">
          <PlaygroundCodeEditor
            ref="editor"
            v-model="source"
            label="Rux source code"
            placeholder="Write some Rux…"
            @run="submit('run')"
          />
        </div>

        <UCollapsible v-model:open="stdinOpen" class="border-default rounded-md border">
          <UButton
            class="w-full justify-between"
            color="neutral"
            variant="ghost"
            label="Standard input"
            trailing-icon="i-lucide-chevron-down"
            :ui="{ trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform' }"
          />

          <template #content>
            <div class="p-3 pt-0">
              <UFormField label="Text passed to the program on stdin" size="xs" :ui="{ label: 'sr-only' }">
                <UTextarea
                  v-model="stdin"
                  :rows="4"
                  class="w-full"
                  placeholder="Lines the program reads with ReadLine()"
                  :ui="{ base: 'font-mono text-sm' }"
                />
              </UFormField>
            </div>
          </template>
        </UCollapsible>
      </div>

      <!-- No fixed height: the panel grows with the run's output and the page
           scrolls, rather than hiding a long stdout behind an inner scrollbar. -->
      <div>
        <PlaygroundOutput
          :result="result"
          :failure="failure"
          :limits="limits"
          :pending="pending !== null"
          @retry="retry"
          @go-to-line="(line, column) => editor?.focusLine(line, column)"
        />
      </div>
    </div>
  </UContainer>
</template>
