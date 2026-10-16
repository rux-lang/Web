<script setup lang="ts">
/**
 * Benchmark results from github.com/rux-lang/Benchmarks, one machine at a time.
 *
 * The runner has two benchmarks, and the page keeps them apart: the program
 * benchmark (ten small programs, built and run) and the compile benchmark (a
 * generated 100,000-line project, built several ways). Each machine runs both;
 * the machine picker is shared, and each part says which run it shows.
 *
 * A Vue page rather than Markdown for the same reason as /play, and listed in
 * scripts/routes.mjs for the same reason too. The data is static — one file per
 * machine and benchmark in data/benchmarks/, written by
 * `npm run import:benchmarks` — so the whole page prerenders; only the machine
 * picker, tabs and chart tooltips run in the browser.
 */
import { computed, onMounted, ref, watch } from "vue";
import type { BenchmarkAppRun, BenchmarkCompileRun, BenchmarkMetricKey } from "~/types/benchmarks";
import {
  benchmarkBaseline,
  benchmarkCompileRow,
  benchmarkHighlights,
  benchmarkLanguage,
  benchmarkMachine,
  benchmarkMachineName,
  benchmarkMachines,
  benchmarkMetric,
  benchmarkMetrics,
  benchmarkApps,
  compileComparison,
  compileValue,
  describeOs,
  formatBenchmarkDate,
  formatMemory,
  latestRun,
  machineLanguages,
  ordinal,
} from "~/utils/benchmarks";
import type { BenchmarkComparison } from "~/utils/benchmarks";
import { formatBenchmarkValue, formatRatio } from "~/utils/benchmark-chart";

definePageMeta({ heroBackground: "opacity-70" });

const description =
  "Rux against Rust, C++, Go, C# and Java in two benchmarks: ten identical programs (run time, memory, binary size) and a 100,000-line project (clean build, rebuild, compile speed).";

useSeoMeta({
  title: "Benchmarks",
  description,
  ogTitle: "Rux Benchmarks",
  ogDescription: description,
  ogType: "website",
  ogUrl: "https://rux-lang.dev/benchmarks",
});

useHead({
  link: [{ rel: "canonical", href: "https://rux-lang.dev/benchmarks" }],
});

const repository = "https://github.com/rux-lang/Benchmarks";
const route = useRoute();
const router = useRouter();

// The prerendered HTML always shows the first machine; a ?machine= link swaps
// it in after hydration, so server and client render the same first frame.
const machineId = ref(benchmarkMachines[0]?.id);
onMounted(() => {
  const requested = route.query.machine;
  if (benchmarkMachines.some((machine) => machine.id === requested)) machineId.value = requested as string;
});
watch(machineId, (id) => {
  const machine = id === benchmarkMachines[0]?.id ? undefined : id;
  router.replace({ query: { ...route.query, machine }, hash: route.hash });
});

const machine = computed(() => benchmarkMachine(machineId.value)!);
const apps = computed(() => machine.value.apps);
const compile = computed(() => machine.value.compile);
const latest = computed(() => latestRun(machine.value));

// The page is a Vue file, not Markdown, so its table of contents is listed by
// hand. Each id is a section heading's: like the docs headings, small enough that the
// scrollspy marks only the section being read.
const tocLinks = [
  { id: "machine", text: "Machine", depth: 2 },
  {
    id: "programs",
    text: "Program benchmark",
    depth: 2,
    children: [
      { id: "summary", text: "Summary", depth: 3 },
      { id: "results", text: "Results by app", depth: 3 },
      { id: "apps", text: "The programs", depth: 3 },
    ],
  },
  {
    id: "compile",
    text: "Compile benchmark",
    depth: 2,
    children: [
      { id: "compile-results", text: "Results", depth: 3 },
      { id: "compile-table", text: "All measurements", depth: 3 },
    ],
  },
  { id: "methodology", text: "Methodology", depth: 2 },
];
const machineItems = computed(() =>
  benchmarkMachines.map((entry) => ({ label: benchmarkMachineName(entry.label).processor, value: entry.id })),
);
const machineKind = computed(() => benchmarkMachineName(machine.value.label).kind);

const facts = computed(() => {
  const hardware = latest.value.hardware;
  return [
    ...(machineKind.value ? [{ label: "Type", value: machineKind.value }] : []),
    { label: "CPU", value: hardware.cpu },
    { label: "Threads", value: String(hardware.logicalCores) },
    { label: "Memory", value: formatMemory(hardware.memoryBytes) },
    { label: "OS", value: describeOs(hardware.os) },
  ];
});

/** Each benchmark's own run on this machine: they are made separately, possibly from different commits. */
const runs = computed(() =>
  [
    { key: "programs", label: "Program benchmark", run: apps.value },
    { key: "compile", label: "Compile benchmark", run: compile.value },
  ].map((entry) => ({ ...entry, date: entry.run ? formatBenchmarkDate(entry.run.date) : undefined })),
);
const toolchains = computed(() => (apps.value ?? compile.value)!.toolchains);

function appMethod(run: BenchmarkAppRun) {
  return `${run.profile} profile · ${run.settings.buildRuns} timed clean builds · ${run.settings.warmups} warm-up + ${run.settings.runs} measured runs`;
}

function compileMethod(run: BenchmarkCompileRun) {
  const builds = run.settings.buildRuns;
  return `${builds} timed clean builds on all CPUs, ${builds} on one CPU and ${builds} rebuilds after a one-line edit`;
}

// Comparison language, shared by both parts.
const compareChoice = ref("Rust");
const compareOptions = computed(() =>
  machineLanguages({
    languages: [...new Set([...(apps.value?.languages ?? []), ...(compile.value?.languages ?? [])])],
  }).filter((language) => language.key !== benchmarkBaseline),
);
const compare = computed(() =>
  compareOptions.value.some((language) => language.key === compareChoice.value)
    ? compareChoice.value
    : (compareOptions.value[0]?.key ?? ""),
);
const compareModel = computed({ get: () => compare.value, set: (value: string) => (compareChoice.value = value) });

// Program benchmark.
const metric = ref<BenchmarkMetricKey>("execution");
const metricInfo = computed(() => benchmarkMetric(metric.value));
const metricItems = benchmarkMetrics.map((entry) => ({ label: entry.label, value: entry.key }));
const relative = ref(false);

function selectMetric(key: BenchmarkMetricKey) {
  metric.value = key;
  document.getElementById("results")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

// Compile benchmark: a view is one measurement, on all CPUs or on one.
const compileViews = [
  {
    value: "clean",
    label: "Clean build",
    rows: { all: "clean", one: "clean-one-cpu" },
    description:
      "A clean release build of the Large project, from deleting the build output to a finished program. Lower is better.",
  },
  {
    value: "rebuild",
    label: "Rebuild after an edit",
    rows: { all: "rebuild" },
    description:
      "One line in the last module changes and the project builds again without cleaning: what each build tool does incrementally. Lower is better.",
  },
  {
    value: "speed",
    label: "Compile speed",
    rows: { all: "speed", one: "speed-one-cpu" },
    description:
      "Lines of Large beyond Baseline per second of the extra build time: the cost of the code itself, without the fixed cost of a build. Higher is better.",
  },
  {
    value: "memory",
    label: "Peak memory",
    rows: { all: "memory", one: "memory-one-cpu" },
    description:
      "The clean build's highest memory use: on Windows all of its processes together, on Linux its largest process. Lower is better.",
  },
  {
    value: "speedup",
    label: "Parallel speed-up",
    rows: { all: "speedup" },
    description:
      "The clean build on one CPU divided by the clean build on all CPUs: how much faster the build gets from the other CPUs. Higher is better.",
  },
] as const;
type CompileView = (typeof compileViews)[number]["value"];

const compileView = ref<CompileView>("clean");
const oneCpu = ref(false);
const compileRelative = ref(false);
const compileViewInfo = computed(() => compileViews.find((view) => view.value === compileView.value)!);
const hasOneCpu = computed(() => "one" in compileViewInfo.value.rows);
const compileRow = computed(() => {
  const rows = compileViewInfo.value.rows;
  return benchmarkCompileRow(oneCpu.value && "one" in rows ? rows.one : rows.all);
});
const compileItems = compileViews.map(({ value, label }) => ({ value, label }));

function selectCompileView(view: CompileView) {
  compileView.value = view;
  oneCpu.value = false;
  document.getElementById("compile-results")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

/** "98,574 lines in 112 files" for Rux's Large, the size every language's project is close to. */
const largeSize = computed(() => {
  const size = compile.value?.sources.Large?.[benchmarkBaseline];
  return size ? `${formatBenchmarkValue(size.lines, 0)} lines in ${size.files} files` : "";
});

function names(keys: string[]) {
  return keys.map((key) => benchmarkLanguage(key).label).join(" and ");
}

/** How each headline card words Rux against the others. */
const wording = {
  memory: { better: "less", worse: "more", best: "leanest", one: "language", field: "languages" },
  executable: { better: "smaller", worse: "larger", best: "smallest", one: "native build", field: "native builds" },
  execution: { better: "faster", worse: "slower", best: "fastest", one: "language", field: "languages" },
  build: { better: "faster", worse: "slower", best: "fastest", one: "language", field: "languages" },
};
type Wording = (typeof wording)[keyof typeof wording];

/**
 * One headline card: Rux against the best other language, "1.73× slower than
 * the fastest, Go". The metrics have different units, so each card says the
 * same kind of thing instead — how many times better or worse, and than whom —
 * and the absolute figure moves to the small print.
 */
function versus(comparison: BenchmarkComparison | null, words: Wording) {
  if (!comparison) return { figure: "—", caption: "" };
  const { ratio, rivals } = comparison;
  if (Math.abs(ratio - 1) < 0.005) return { figure: "Tied", caption: `with ${names(rivals)}` };
  const better = ratio > 1;
  return {
    figure: formatRatio(better ? ratio : 1 / ratio),
    unit: better ? words.better : words.worse,
    better,
    caption: `than ${better ? "the next best" : `the ${words.best}`}, ${names(rivals)}`,
  };
}

/** The spread over all the others when Rux is on one side of every one of them, else its place. */
function spread(comparison: BenchmarkComparison | null, words: Wording) {
  if (!comparison) return "";
  const [low, high] = comparison.spread;
  const range = (from: number, to: number) => `${formatRatio(from).slice(0, -1)}–${formatRatio(to)}`;
  if (low > 1) return `${range(low, high)} ${words.better} than every other ${words.one}.`;
  if (high < 1) return `${range(1 / high, 1 / low)} ${words.worse} than every other ${words.one}.`;
  return `${ordinal(comparison.rank)} of ${comparison.field} ${words.field}.`;
}

interface Tile {
  title: string;
  figure: string;
  unit?: string;
  better?: boolean;
  caption: string;
  detail: string;
  open: () => void;
}

const programTiles = computed<Tile[]>(() => {
  const run = apps.value;
  if (!run) return [];
  const value = benchmarkHighlights(run);
  const executableKiB = value.executableMedian === null ? "" : formatBenchmarkValue(value.executableMedian, 0);
  return [
    {
      title: "Execution time",
      ...versus(value.execution, wording.execution),
      detail: `${spread(value.execution, wording.execution)} Fastest in ${value.executionWins} / ${value.appCount} apps.`,
      open: () => selectMetric("execution"),
    },
    {
      title: "Peak memory",
      ...versus(value.memory, wording.memory),
      detail: `${spread(value.memory, wording.memory)} Least memory in ${value.memoryWins} / ${value.appCount} apps.`,
      open: () => selectMetric("memory"),
    },
    {
      title: "Executable size",
      ...versus(value.executable, wording.executable),
      detail: `${spread(value.executable, wording.executable)} Median ${executableKiB} KiB, no runtime needed.`,
      open: () => selectMetric("executable"),
    },
  ];
});

const compileTiles = computed<Tile[]>(() => {
  const run = compile.value;
  if (!run) return [];
  const rux = (key: string) => {
    const row = benchmarkCompileRow(key);
    const value = compileValue(run, row, benchmarkBaseline);
    return value === null ? "" : `${formatBenchmarkValue(value, row.digits)} ${row.unit}`;
  };
  const tile = (title: string, key: string, view: CompileView, detail: string): Tile => {
    const comparison = compileComparison(run, benchmarkCompileRow(key));
    return {
      title,
      ...versus(comparison, wording.build),
      detail: `${spread(comparison, wording.build)} ${detail}`,
      open: () => selectCompileView(view),
    };
  };
  return [
    tile("Clean build", "clean", "clean", `Rux: ${rux("clean")} for ${largeSize.value || "the Large project"}.`),
    tile("Rebuild after an edit", "rebuild", "rebuild", `Rux: ${rux("rebuild")} after a one-line change.`),
    tile("Compile speed", "speed", "speed", `Rux: ${rux("speed")} of project code.`),
  ];
});

const tileGroups = computed(() =>
  [
    { id: "programs", title: "Running ten programs", tiles: programTiles.value },
    { id: "compile", title: "Compiling a 100,000-line project", tiles: compileTiles.value },
  ].filter((group) => group.tiles.length),
);

/** The two benchmarks in one line each, for the cards that introduce them. */
const benchmarks = [
  {
    id: "programs",
    icon: "i-lucide-play",
    title: "Program benchmark",
    text: "Ten small programs written the same way in every language, each built and then run. Execution time, CPU time, peak memory, compile time and binary size.",
  },
  {
    id: "compile",
    icon: "i-lucide-hammer",
    title: "Compile benchmark",
    text: "One generated project of 1,000 modules, about 100,000 lines in every language. Clean build, rebuild after a one-line edit, compile speed, build memory and parallel speed-up.",
  },
];
</script>

<template>
  <UContainer>
    <UPageHero title="Benchmarks" orientation="horizontal">
      <template #description>
        Two benchmarks of Rux against Rust, C++, Go, C# and Java, run on real machines by one open-source runner: ten
        identical programs, built and run, and a 100,000-line project, compiled by each toolchain.
      </template>
      <template #links>
        <UButton :to="repository" target="_blank" icon="i-simple-icons-github" color="neutral" variant="subtle">
          Benchmark source
        </UButton>
        <UButton to="#methodology" color="neutral" variant="ghost" trailing-icon="i-lucide-arrow-down">
          Methodology
        </UButton>
      </template>

      <!-- The headline figures fill the hero's second column, one group per
           benchmark, so the facts a visitor came for are above the fold. Each
           opens its measurement below. -->
      <section aria-labelledby="glance-heading">
        <h2 id="glance-heading" class="sr-only">At a glance</h2>
        <div class="space-y-4">
          <div v-for="group in tileGroups" :key="group.id">
            <h3 class="mb-2 text-xs font-medium tracking-wide text-muted uppercase">{{ group.title }}</h3>
            <div class="grid grid-cols-3 gap-2 sm:gap-3">
              <button
                v-for="tile in group.tiles"
                :key="tile.title"
                type="button"
                class="flex flex-col items-start rounded-lg border border-default bg-default/60 p-2.5 text-left backdrop-blur transition-colors hover:border-accented focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:p-4"
                @click="tile.open"
              >
                <span class="text-xs text-muted sm:text-sm">{{ tile.title }}</span>
                <span class="mt-1 text-xl font-semibold tracking-tight text-highlighted sm:text-2xl"
                  >{{ tile.figure
                  }}<span
                    v-if="tile.unit"
                    class="ml-1 block text-sm font-medium tracking-normal sm:inline sm:text-base"
                    :class="tile.better ? 'text-success' : 'text-warning'"
                    >{{ tile.unit }}</span
                  ></span
                >
                <span class="mt-1 text-xs text-toned sm:text-sm">{{ tile.caption }}</span>
                <span class="mt-2 hidden text-xs text-muted sm:block">{{ tile.detail }}</span>
              </button>
            </div>
          </div>
        </div>
        <p class="mt-3 text-xs text-muted">{{ machine.label }} · {{ formatBenchmarkDate(latest.date) }}</p>
      </section>
    </UPageHero>

    <UPage>
      <UPageBody class="space-y-16 pb-16">
        <div class="space-y-6">
          <UAlert color="primary" variant="subtle" icon="i-lucide-info" title="Rux is pre-1.0">
            <template #description>
              These figures are a baseline to track from release to release, not a verdict. Times are comparable only
              within one machine, and memory is measured differently on Windows and Linux, so compare languages on the
              same machine rather than machines with each other.
            </template>
          </UAlert>

          <div class="grid gap-4 sm:grid-cols-2">
            <ULink
              v-for="(benchmark, index) in benchmarks"
              :key="benchmark.id"
              :to="`#${benchmark.id}`"
              class="group flex gap-4 rounded-lg border border-default p-4 transition-colors hover:border-accented"
            >
              <UIcon :name="benchmark.icon" class="mt-0.5 size-5 shrink-0 text-primary" />
              <span>
                <span class="text-xs font-medium tracking-wide text-muted uppercase"
                  >Benchmark {{ index + 1 }} of 2</span
                >
                <span class="mt-0.5 block font-semibold text-highlighted group-hover:underline">{{
                  benchmark.title
                }}</span>
                <span class="mt-1 block text-sm text-toned">{{ benchmark.text }}</span>
              </span>
            </ULink>
          </div>
        </div>

        <!-- Machine -->
        <section aria-labelledby="machine">
          <div class="flex flex-wrap items-end justify-between gap-4">
            <h2 id="machine" class="scroll-mt-24 text-2xl font-semibold text-highlighted">Machine</h2>
            <UTabs
              v-if="machineItems.length > 1"
              v-model="machineId"
              :items="machineItems"
              :content="false"
              size="sm"
              color="neutral"
              :ui="{ list: 'overflow-x-auto', trigger: 'shrink-0' }"
              aria-label="Machine"
            />
            <UBadge v-else color="neutral" variant="subtle" size="lg">{{ machine.label }}</UBadge>
          </div>

          <UCard variant="subtle" class="mt-5">
            <dl class="grid gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
              <div v-for="fact in facts" :key="fact.label">
                <dt class="text-xs font-medium tracking-wide text-muted uppercase">{{ fact.label }}</dt>
                <dd class="mt-1 text-highlighted">{{ fact.value }}</dd>
              </div>
              <div v-for="entry in runs" :key="entry.key">
                <dt class="text-xs font-medium tracking-wide text-muted uppercase">{{ entry.label }}</dt>
                <dd v-if="entry.run" class="mt-1 text-highlighted">
                  {{ entry.date }} ·
                  <ULink :to="`${repository}/commit/${entry.run.commit}`" target="_blank" class="font-mono text-sm">
                    {{ entry.run.commit }}
                  </ULink>
                </dd>
                <dd v-else class="mt-1 text-muted">Not run yet</dd>
              </div>
            </dl>

            <details class="group mt-6 border-t border-default pt-4">
              <summary
                class="flex cursor-pointer list-none items-center gap-1.5 text-sm font-medium text-toned hover:text-highlighted [&::-webkit-details-marker]:hidden"
              >
                <UIcon name="i-lucide-chevron-right" class="size-4 transition-transform group-open:rotate-90" />
                Toolchains
              </summary>
              <dl class="mt-3 grid gap-x-8 gap-y-2 text-sm sm:grid-cols-[auto_1fr]">
                <template v-for="(version, tool) in toolchains" :key="tool">
                  <dt class="text-muted">{{ tool }}</dt>
                  <dd class="font-mono text-xs break-all text-toned sm:text-sm">{{ version }}</dd>
                </template>
              </dl>
            </details>
          </UCard>
        </section>

        <!-- Program benchmark -->
        <section aria-labelledby="programs" class="space-y-12">
          <header class="border-t-2 border-(--bench-rux) pt-6">
            <p class="text-xs font-medium tracking-wide text-muted uppercase">Benchmark 1 of 2</p>
            <h2
              id="programs"
              class="mt-1 flex scroll-mt-24 items-center gap-2.5 text-3xl font-semibold text-highlighted"
            >
              <UIcon name="i-lucide-play" class="size-7 text-primary" />
              Program benchmark
            </h2>
            <p class="mt-3 max-w-3xl text-toned">
              Ten small programs, written the same way in every language, each built with its usual tool and then run.
              It measures what a user of a program sees: how fast it runs, how much memory it takes, how long it takes
              to build and how big it is.
            </p>
            <p v-if="apps" class="mt-2 text-sm text-muted">
              {{ machine.label }} · {{ formatBenchmarkDate(apps.date) }} · {{ appMethod(apps) }}
            </p>
          </header>

          <UCard v-if="!apps" variant="subtle">
            <p class="text-muted">The program benchmark has not been run on this machine yet.</p>
          </UCard>

          <template v-else>
            <!-- Summary -->
            <section aria-labelledby="summary">
              <h3 id="summary" class="scroll-mt-24 text-xl font-semibold text-highlighted">Summary</h3>
              <p class="mt-2 text-muted">
                Each cell is the geometric mean, over all ten apps, of the language's value divided by Rux's. Rux is
                1.00× by definition.
              </p>
              <BenchmarkSummary :run="apps" class="mt-5" @select="selectMetric" />
            </section>

            <!-- Results by metric -->
            <section aria-labelledby="results">
              <h3 id="results" class="scroll-mt-24 text-xl font-semibold text-highlighted">Results by app</h3>

              <UTabs
                v-model="metric"
                :items="metricItems"
                :content="false"
                variant="link"
                color="neutral"
                class="mt-4"
                :ui="{ list: 'w-full overflow-x-auto overflow-y-hidden', trigger: 'shrink-0' }"
              />

              <p class="mt-4 text-muted">{{ metricInfo.description }} Median of runs; lower is better.</p>

              <BenchmarkCompare v-model="compareModel" :options="compareOptions" class="mt-5" />

              <UCard variant="outline" class="mt-5">
                <BenchmarkDotPlot :run="apps" :metric="metric" :compare="compare" />
                <p class="mt-4 flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-muted">
                  <span class="inline-flex items-center gap-1.5">
                    <span class="inline-block size-2.5 rounded-full bg-(--bench-other)" aria-hidden="true" />
                    Other languages
                  </span>
                  <span class="inline-flex items-center gap-1.5">
                    <span
                      class="inline-block size-2.5 rounded-full border-2 border-(--bench-other)"
                      aria-hidden="true"
                    />
                    Hollow: JIT, runs on a runtime it ships with
                  </span>
                  <span>Hover, tap or focus the chart for values.</span>
                </p>
              </UCard>

              <div class="mt-8 flex flex-wrap items-center justify-between gap-3">
                <h4 class="font-semibold text-highlighted">
                  {{ metricInfo.label }} {{ relative ? "relative to Rux" : `(${metricInfo.unit})` }}
                </h4>
                <USwitch v-model="relative" label="Relative to Rux" size="sm" />
              </div>
              <BenchmarkTable :run="apps" :metric="metric" :relative="relative" :compare="compare" class="mt-3" />
            </section>

            <!-- Apps -->
            <section aria-labelledby="apps">
              <h3 id="apps" class="scroll-mt-24 text-xl font-semibold text-highlighted">The programs</h3>
              <p class="mt-2 text-muted">
                Each is an ordinary console program written the same way in every language. It takes its sizes as
                arguments, prints a deterministic result and exits; there is no timing code inside.
              </p>
              <div class="mt-5 overflow-x-auto rounded-lg border border-default">
                <table class="w-full min-w-[44rem] border-collapse text-sm">
                  <thead>
                    <tr class="border-b border-default bg-elevated/50 text-left">
                      <th scope="col" class="px-3 py-2 font-medium text-highlighted">App</th>
                      <th scope="col" class="px-3 py-2 font-medium text-highlighted">What it does</th>
                      <th scope="col" class="px-3 py-2 font-medium text-highlighted">Stresses</th>
                      <th scope="col" class="px-3 py-2 font-medium text-highlighted">Standard size</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="app in benchmarkApps"
                      :key="app.key"
                      class="border-b border-default align-top last:border-b-0"
                    >
                      <th scope="row" class="px-3 py-2 text-left font-medium text-highlighted">
                        <ULink :to="`${repository}/tree/main/Apps/${app.key}`" target="_blank">{{ app.key }}</ULink>
                      </th>
                      <td class="px-3 py-2 text-toned">{{ app.description }}</td>
                      <td class="px-3 py-2 text-muted">{{ app.stresses }}</td>
                      <td class="px-3 py-2 whitespace-nowrap text-muted">{{ app.size }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
          </template>
        </section>

        <!-- Compile benchmark -->
        <section aria-labelledby="compile" class="space-y-12">
          <header class="border-t-2 border-(--bench-rux) pt-6">
            <p class="text-xs font-medium tracking-wide text-muted uppercase">Benchmark 2 of 2</p>
            <h2
              id="compile"
              class="mt-1 flex scroll-mt-24 items-center gap-2.5 text-3xl font-semibold text-highlighted"
            >
              <UIcon name="i-lucide-hammer" class="size-7 text-primary" />
              Compile benchmark
            </h2>
            <p class="mt-3 max-w-3xl text-toned">
              The programs above are one file each, so their compile time is mostly the fixed cost of a build. This
              benchmark builds a real-sized project instead: 1,000 generated modules in about 100 files, the same code
              in every language<template v-if="largeSize"> (Rux: {{ largeSize }})</template>. Beside it,
              <em>Baseline</em> is the same build with one module, so the difference between the two is the time spent
              on the code itself.
            </p>
            <p v-if="compile" class="mt-2 text-sm text-muted">
              {{ machine.label }} · {{ formatBenchmarkDate(compile.date) }} · {{ compileMethod(compile) }}
            </p>
          </header>

          <UCard v-if="!compile" variant="subtle">
            <p class="text-muted">The compile benchmark has not been run on this machine yet.</p>
          </UCard>

          <template v-else>
            <section aria-labelledby="compile-results">
              <h3 id="compile-results" class="scroll-mt-24 text-xl font-semibold text-highlighted">Results</h3>

              <UTabs
                v-model="compileView"
                :items="compileItems"
                :content="false"
                variant="link"
                color="neutral"
                class="mt-4"
                :ui="{ list: 'w-full overflow-x-auto overflow-y-hidden', trigger: 'shrink-0' }"
              />

              <div class="mt-4 flex flex-wrap items-start justify-between gap-x-6 gap-y-3">
                <p class="max-w-3xl text-muted">{{ compileViewInfo.description }}</p>
                <USwitch v-if="hasOneCpu" v-model="oneCpu" label="On one CPU" size="sm" class="shrink-0" />
              </div>

              <BenchmarkCompare v-model="compareModel" :options="compareOptions" class="mt-5" />

              <UCard variant="outline" class="mt-5">
                <h4 class="mb-3 text-sm font-medium text-highlighted">{{ compileRow.label }}</h4>
                <BenchmarkBars :run="compile" :row="compileRow" :compare="compare" />
                <p class="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-muted">
                  <span class="inline-flex items-center gap-1.5">
                    <span class="inline-block h-2.5 w-4 rounded-sm bg-(--bench-other)/70" aria-hidden="true" />
                    Other languages
                  </span>
                  <span class="inline-flex items-center gap-1.5">
                    <span
                      class="inline-block h-2.5 w-4 rounded-sm border-[1.5px] border-(--bench-other)"
                      aria-hidden="true"
                    />
                    Outlined: JIT
                  </span>
                  <span>Hover, tap or focus the chart for the spread of the builds.</span>
                </p>
              </UCard>
            </section>

            <section aria-labelledby="compile-table">
              <div class="flex flex-wrap items-center justify-between gap-3">
                <h3 id="compile-table" class="scroll-mt-24 text-xl font-semibold text-highlighted">All measurements</h3>
                <USwitch v-model="compileRelative" label="Relative to Rux" size="sm" />
              </div>
              <p class="mt-2 text-muted">
                Medians of {{ compile.settings.buildRuns }} timed builds each, as the runner's report prints them.
              </p>
              <BenchmarkCompileTable
                :run="compile"
                :relative="compileRelative"
                :compare="compare"
                :selected="compileRow.key"
                class="mt-4"
              />
            </section>
          </template>
        </section>

        <!-- Methodology -->
        <section aria-labelledby="methodology">
          <h2 id="methodology" class="scroll-mt-24 text-2xl font-semibold text-highlighted">Methodology</h2>
          <!-- One readable column of prose: three side-by-side columns of small-print
             bullets were hard to follow on a wide screen. -->
          <div
            class="mt-5 space-y-4 leading-7 text-toned [&_code]:font-mono [&_code]:text-sm [&_h3]:pt-4 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-highlighted"
          >
            <h3>Keeping it fair</h3>
            <p>
              Every algorithm is written by hand, identically, in every language: the same data generation, operation
              order and data layout. The programs use only standard-library I/O, collections and allocation, with no
              third-party packages, SIMD intrinsics or threads.
            </p>
            <p>
              Inputs come from the same SplitMix64 generator, and floating-point results are printed as raw IEEE-754
              bits, so every language must agree bit for bit; C++ is built with <code>-ffp-contract=off</code> for that
              reason. All builds target baseline x86-64, and runtimes run with their defaults, with no GC or JIT tuning
              for .NET, Go or the JVM.
            </p>
            <p>
              Each language allocates the way it normally does. BinaryTrees uses <code>new</code>/<code>delete</code> in
              C++, <code>Box</code> in Rust, the garbage collector in Go, C# and Java, and
              <code>Allocator::Pool</code> in Rux. WordCount uses each standard library's hash map.
            </p>

            <h3>The program benchmark</h3>
            <p>
              Each app is built with the language's usual tool: rux, cargo, clang++, go build, dotnet publish, javac and
              jar, or native-image. After one untimed warm-up build come timed clean release builds. Go starts from a
              cache holding only the precompiled standard library, so the app itself is always compiled from scratch.
            </p>
            <p>
              Each program then gets unmeasured warm-up runs and measured runs, with the languages taking turns so that
              drifts in the machine's state hit all of them alike. Execution time includes process start-up, which for
              the JIT builds means starting the runtime and compiling.
            </p>
            <p>
              Every run must exit with code 0 and print exactly the expected output; otherwise the cell is marked FAIL
              and left out. The page shows medians, and the chart tooltips add the minimum, the standard deviation and
              the run count.
            </p>

            <h3>The compile benchmark</h3>
            <p>
              The projects are generated from one specification, so every language compiles the same modules, types and
              functions and prints the same result. Each module is one of ten kinds — a struct with methods, an enum
              state machine, dynamic dispatch, a hash map, sorting, a ring buffer, a CRC table, text formatting, small
              matrices, union-find — and calls a few of the modules before it. C++ builds with CMake and Ninja, Rust
              with Cargo, C# with dotnet publish, Java with javac and then native-image or jar and jlink.
            </p>
            <p>
              A clean build removes the build output first: Ninja's object files, Cargo's target folder, the Go build
              cache except a precompiled standard library, and the MSBuild and Java output folders. Rux compiles its
              standard library from source as part of every build, while the other languages link a precompiled one, so
              most of Rux's Baseline time is its standard library.
            </p>
            <p>
              The same clean builds are then repeated with the runner and every process the build starts pinned to one
              logical CPU; Cargo and Ninja are also told to run one job. The parallel speed-up is the build on one CPU
              divided by the build on all of them. A rebuild changes one line in the last module, which only Main calls,
              and builds again without cleaning: Ninja recompiles one file and links, Go one package, while release
              Cargo, C# and javac rebuild the whole project.
            </p>

            <h3>Reading the numbers</h3>
            <p>
              C# and Java appear twice. <strong class="text-highlighted">AOT</strong> is one native executable
              (NativeAOT, GraalVM Native Image). <strong class="text-highlighted">JIT</strong> ships its own runtime: C#
              JIT is published self-contained and trimmed, and Java JIT runs its jar from a minimal
              <code>jlink</code> runtime. Their executable size is only the program file (the IL assembly or the jar),
              which cannot run alone, so it is shown in italics and not ranked; their deployable size includes the
              runtime.
            </p>
            <p>
              Peak memory and compile memory are the working set and the memory committed by all build processes on
              Windows, and the maximum resident set of the largest process on Linux, so they are not comparable across
              operating systems; times are not comparable across machines. Ratios are a language's value divided by
              Rux's, and the program benchmark summarises them by geometric mean so that a 2× win and a 2× loss cancel
              out.
            </p>
            <p>
              The apps, the generator, the runner and full instructions to reproduce these results on your own machine
              are in
              <ULink :to="repository" target="_blank" class="font-medium text-primary">rux-lang/Benchmarks</ULink>.
            </p>
          </div>
        </section>
      </UPageBody>

      <!-- The same "On this page" column as the docs: sticky beside the body from
         `lg` up, UContentToc's own collapsible bar on a phone. -->
      <template #right>
        <UContentToc :links="tocLinks" highlight highlight-variant="circuit" />
      </template>
    </UPage>
  </UContainer>
</template>
