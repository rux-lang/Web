<script setup lang="ts">
/**
 * The playground's three result tabs.
 *
 * A compile error is a normal `200` and belongs in Build, not in an alert:
 * `ApiProblemAlert` is reserved for the submission that never ran — a transport
 * fault or a 5xx. That split is the reason this component takes `result` and
 * `failure` as separate props rather than one error channel.
 *
 * The Details tab reads the sandbox's limits from the server rather than
 * restating them, because the operator can change the timeouts and what a
 * reader needs to see is what is actually being enforced.
 */
import { computed, ref, useId, watch } from "vue";
import type { ApiFailure } from "~/types/api";
import type { PlaygroundDiagnostic, PlaygroundLimits, PlaygroundResult, PlaygroundSeverity } from "~/types/playground";
import {
  formatCpuQuota,
  formatDuration,
  formatLimitBytes,
  parseDiagnostics,
  truncationNotice,
} from "~/utils/playground";

const props = withDefaults(
  defineProps<{
    result?: PlaygroundResult | null;
    failure?: ApiFailure | null;
    limits?: PlaygroundLimits | null;
    pending?: boolean;
  }>(),
  {
    result: null,
    failure: null,
    limits: null,
    pending: false,
  },
);

defineEmits<{ goToLine: [line: number, column: number]; retry: [] }>();

const headingId = useId();
const tab = ref("output");

const build = computed(() => props.result?.build ?? null);
const program = computed(() => props.result?.program ?? null);
const diagnostics = computed(() => (build.value ? parseDiagnostics(build.value.diagnostics) : []));
const rawDiagnostics = computed(() => build.value?.diagnostics.trim() ?? "");
const errorCount = computed(() => diagnostics.value.filter((item) => item.severity === "error").length);
const warningCount = computed(() => diagnostics.value.filter((item) => item.severity === "warning").length);

// Nothing has run yet, versus a run in flight with no previous result to keep
// on screen. The page holds the last result during a re-run, so `pending` alone
// is not enough to decide which of the two a tab should show.
const loading = computed(() => props.pending && props.result === null);
const empty = computed(() => !props.pending && props.result === null);

const hasOutput = computed(() => Boolean(program.value && (program.value.stdout || program.value.stderr)));
const outputTruncation = computed(() => truncationNotice(program.value, props.limits));
const buildTruncation = computed(() => truncationNotice(build.value, props.limits));

/** How the program ended, as one banner. A timeout is not a crash. */
const outcome = computed(() => {
  const finished = program.value;
  if (!finished) return null;

  if (finished.timed_out) {
    return {
      color: "warning" as const,
      icon: "i-lucide-timer-off",
      title: "Timed out",
      detail: `The program was stopped after ${props.limits ? `${props.limits.run_timeout_seconds} s` : "its run timeout"}.`,
    };
  }
  if (finished.signal !== null) {
    return {
      color: "error" as const,
      icon: "i-lucide-zap",
      title: `Killed by signal ${finished.signal}`,
      detail: "The program was terminated before it could exit on its own.",
    };
  }
  if (finished.exit_code === 0) {
    return {
      color: "success" as const,
      icon: "i-lucide-circle-check",
      title: "Exited cleanly",
      detail: `Ran in ${formatDuration(finished.duration_ms)}.`,
    };
  }
  return {
    color: "error" as const,
    icon: "i-lucide-circle-x",
    title: `Exited with code ${finished.exit_code}`,
    detail: "The program ran to completion but reported a failure.",
  };
});

const items = computed(() => [
  { label: "Output", value: "output", icon: "i-lucide-terminal", slot: "output" as const },
  {
    label: "Build",
    value: "build",
    icon: "i-lucide-hammer",
    slot: "build" as const,
    ...(errorCount.value > 0
      ? { badge: { label: String(errorCount.value), color: "error" as const, variant: "subtle" as const } }
      : {}),
  },
  { label: "Details", value: "details", icon: "i-lucide-info", slot: "details" as const },
]);

const limitRows = computed(() => {
  const limits = props.limits;
  if (!limits) return [];

  return [
    { label: "Source", value: formatLimitBytes(limits.max_source_bytes) },
    { label: "Standard input", value: formatLimitBytes(limits.max_stdin_bytes) },
    { label: "Output per stream", value: formatLimitBytes(limits.max_output_bytes) },
    { label: "Compile timeout", value: `${limits.compile_timeout_seconds} s` },
    { label: "Run timeout", value: `${limits.run_timeout_seconds} s` },
    { label: "Memory", value: formatLimitBytes(limits.memory_bytes) },
    { label: "CPU", value: formatCpuQuota(limits.cpu_millis) },
  ];
});

const severityIcons: Record<PlaygroundSeverity, string> = {
  error: "i-lucide-circle-x",
  warning: "i-lucide-triangle-alert",
  note: "i-lucide-info",
};

const severityColors: Record<PlaygroundSeverity, "error" | "warning" | "neutral"> = {
  error: "error",
  warning: "warning",
  note: "neutral",
};

// Written out rather than assembled from `text-${severity}`: Tailwind scans
// these files as plain text and never sees a class built from fragments.
const severityIconClasses: Record<PlaygroundSeverity, string> = {
  error: "text-error",
  warning: "text-warning",
  note: "text-muted",
};

const severityLabels: Record<PlaygroundSeverity, string> = {
  error: "Error",
  warning: "Warning",
  note: "Note",
};

const formatted = computed(() => props.result?.formatted ?? null);

function locationLabel(item: PlaygroundDiagnostic): string {
  return item.column === null ? `Line ${item.line}` : `Line ${item.line}:${item.column}`;
}

// A failed compile is the one result the reader has to act on, and it is not on
// the tab they were looking at. Switching for them beats a badge they miss.
watch(
  () => props.result,
  (value) => {
    if (value && !value.build.success) tab.value = "build";
  },
);
</script>

<template>
  <section :aria-labelledby="headingId" :aria-busy="pending" class="flex flex-col gap-3">
    <h2 :id="headingId" class="sr-only">Run results</h2>

    <!-- Transport faults only. A compiler diagnostic never reaches this. -->
    <ApiProblemAlert v-if="failure" :failure="failure" @retry="$emit('retry')" />

    <UTabs
      v-model="tab"
      :items="items"
      :unmount-on-hide="false"
      color="neutral"
      variant="link"
      :ui="{ content: 'pt-3' }"
    >
      <template #output>
        <AppLoadingState v-if="loading" label="Running your program" />

        <UEmpty
          v-else-if="empty"
          icon="i-lucide-terminal"
          title="Nothing has run yet"
          description="Press Run, or Ctrl and Enter, to compile and execute the buffer."
          variant="subtle"
        />

        <div v-else class="space-y-4" aria-live="polite">
          <UAlert
            v-if="outcome"
            :color="outcome.color"
            :icon="outcome.icon"
            :title="outcome.title"
            :description="outcome.detail"
            variant="subtle"
          />

          <UAlert
            v-else-if="formatted !== null"
            color="success"
            icon="i-lucide-align-left"
            title="Formatting applied"
            description="The buffer was rewritten in place; undo restores what you had."
            variant="subtle"
          />

          <UAlert
            v-else-if="build && !build.success"
            color="error"
            icon="i-lucide-hammer"
            title="The build failed, so nothing ran"
            description="The compiler's diagnostics are in the Build tab."
            variant="subtle"
          >
            <template #actions>
              <UButton label="See diagnostics" color="error" variant="outline" size="xs" @click="tab = 'build'" />
            </template>
          </UAlert>

          <UAlert
            v-else-if="!program"
            color="neutral"
            icon="i-lucide-circle-check"
            title="Compiled without running"
            description="Build mode stops after the compiler. Press Run to execute it."
            variant="subtle"
          />

          <template v-if="program">
            <div v-if="program.stdout">
              <h3 class="text-highlighted mb-1.5 text-sm font-semibold">Standard output</h3>
              <pre class="bg-muted border-muted overflow-x-auto rounded-md border p-3 font-mono text-sm">{{
                program.stdout
              }}</pre>
            </div>

            <!-- The heading, not the tint, is what tells the two streams apart. -->
            <div v-if="program.stderr">
              <h3 class="text-highlighted mb-1.5 flex items-center gap-1.5 text-sm font-semibold">
                <UIcon name="i-lucide-alert-circle" class="text-error size-4" aria-hidden="true" />
                Standard error
              </h3>
              <pre class="bg-muted border-s-error overflow-x-auto rounded-md border-s-2 p-3 font-mono text-sm">{{
                program.stderr
              }}</pre>
            </div>

            <p v-if="!hasOutput" class="text-muted text-sm">The program produced no output.</p>
            <p v-if="outputTruncation" class="text-muted text-sm">{{ outputTruncation }}</p>
          </template>
        </div>
      </template>

      <template #build>
        <AppLoadingState v-if="loading" label="Compiling your program" />

        <UEmpty
          v-else-if="empty"
          icon="i-lucide-hammer"
          title="No build yet"
          description="Compiler diagnostics appear here after a run."
          variant="subtle"
        />

        <div v-else class="space-y-3">
          <p v-if="diagnostics.length" class="text-muted text-sm">
            {{ errorCount }} {{ errorCount === 1 ? "error" : "errors" }}, {{ warningCount }}
            {{ warningCount === 1 ? "warning" : "warnings" }} in {{ formatDuration(build?.duration_ms ?? 0) }}.
          </p>

          <ul v-if="diagnostics.length" class="divide-default divide-y">
            <li v-for="(item, index) in diagnostics" :key="index" class="flex gap-3 py-3 first:pt-0">
              <UIcon
                :name="severityIcons[item.severity]"
                :class="['mt-0.5 size-4 shrink-0', severityIconClasses[item.severity]]"
                aria-hidden="true"
              />
              <div class="min-w-0 space-y-1">
                <div class="flex flex-wrap items-center gap-2">
                  <UBadge
                    :label="severityLabels[item.severity]"
                    :color="severityColors[item.severity]"
                    variant="subtle"
                    size="sm"
                  />
                  <UButton
                    v-if="item.line !== null"
                    :label="locationLabel(item)"
                    color="neutral"
                    variant="link"
                    size="xs"
                    class="p-0"
                    @click="$emit('goToLine', item.line, item.column ?? 1)"
                  />
                </div>
                <p class="text-highlighted font-mono text-sm whitespace-pre-wrap">{{ item.message }}</p>
                <ul v-if="item.notes.length" class="border-default space-y-1 border-s ps-3">
                  <li v-for="(note, noteIndex) in item.notes" :key="noteIndex" class="text-muted text-sm">
                    <UButton
                      v-if="note.line !== null"
                      :label="locationLabel(note)"
                      color="neutral"
                      variant="link"
                      size="xs"
                      class="me-2 p-0"
                      @click="$emit('goToLine', note.line, note.column ?? 1)"
                    />
                    <span class="font-mono whitespace-pre-wrap">{{ note.message }}</span>
                  </li>
                </ul>
              </div>
            </li>
          </ul>

          <!-- Nothing parsed, but the compiler said something: show it verbatim
               rather than swallowing it. -->
          <pre
            v-else-if="rawDiagnostics"
            class="bg-muted border-muted overflow-x-auto rounded-md border p-3 font-mono text-sm"
            >{{ rawDiagnostics }}</pre>

          <UEmpty
            v-else
            icon="i-lucide-circle-check"
            title="Compiled without diagnostics"
            :description="`The compiler finished in ${formatDuration(build?.duration_ms ?? 0)}.`"
            variant="subtle"
          />

          <p v-if="buildTruncation" class="text-muted text-sm">{{ buildTruncation }}</p>
        </div>
      </template>

      <template #details>
        <AppLoadingState v-if="loading" label="Waiting for the sandbox" />

        <div v-else class="space-y-6">
          <div v-if="result">
            <h3 class="text-highlighted mb-2 text-sm font-semibold">This run</h3>
            <dl class="divide-default divide-y text-sm">
              <div class="flex justify-between gap-4 py-2">
                <dt class="text-muted">Compile</dt>
                <dd class="text-highlighted font-mono">{{ formatDuration(build?.duration_ms ?? 0) }}</dd>
              </div>
              <div v-if="program" class="flex justify-between gap-4 py-2">
                <dt class="text-muted">Run</dt>
                <dd class="text-highlighted font-mono">{{ formatDuration(program.duration_ms) }}</dd>
              </div>
              <div v-if="program" class="flex justify-between gap-4 py-2">
                <dt class="text-muted">Exit code</dt>
                <dd class="text-highlighted font-mono">{{ program.exit_code ?? "—" }}</dd>
              </div>
              <div v-if="program" class="flex justify-between gap-4 py-2">
                <dt class="text-muted">Signal</dt>
                <dd class="text-highlighted font-mono">{{ program.signal ?? "—" }}</dd>
              </div>
            </dl>
          </div>

          <p v-else-if="empty" class="text-muted text-sm">Timings appear here after a run.</p>

          <div>
            <h3 class="text-highlighted mb-2 text-sm font-semibold">Sandbox limits</h3>
            <dl v-if="limitRows.length" class="divide-default divide-y text-sm">
              <div v-for="row in limitRows" :key="row.label" class="flex justify-between gap-4 py-2">
                <dt class="text-muted">{{ row.label }}</dt>
                <dd class="text-highlighted font-mono">{{ row.value }}</dd>
              </div>
            </dl>
            <p v-else class="text-muted text-sm">The sandbox has not reported its limits.</p>
          </div>
        </div>
      </template>
    </UTabs>
  </section>
</template>
