<script setup lang="ts">
/**
 * Benchmark results from github.com/rux-lang/Benchmarks, one machine at a time.
 *
 * A Vue page rather than Markdown for the same reason as /play, and listed in
 * scripts/routes.mjs for the same reason too. The data is static — one file per
 * machine in data/benchmarks/, written by `npm run import:benchmarks` — so the
 * whole page prerenders; only the machine picker, metric tabs and chart
 * tooltips run in the browser.
 */
import { computed, onMounted, ref, watch } from "vue";
import type { BenchmarkMetricKey } from "~/types/benchmarks";
import {
  benchmarkBaseline,
  benchmarkHighlights,
  benchmarkLanguage,
  benchmarkMachine,
  benchmarkMachineName,
  benchmarkMachines,
  benchmarkMetric,
  benchmarkMetrics,
  benchmarkApps,
  describeOs,
  formatBenchmarkDate,
  formatMemory,
  machineLanguages,
  ordinal,
} from "~/utils/benchmarks";
import type { BenchmarkComparison } from "~/utils/benchmarks";
import { formatBenchmarkValue, formatRatio } from "~/utils/benchmark-chart";

definePageMeta({ heroBackground: "opacity-70" });

const description =
  "Rux against Rust, C++, Go, C# and Java: execution time, CPU time, peak memory, compile time and binary size for ten identical programs.";

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

// The page is a Vue file, not Markdown, so its table of contents is listed by
// hand. Each id is a section heading's: like the docs headings, small enough that the
// scrollspy marks only the section being read.
const tocLinks = [
  { id: "machine", text: "Machine", depth: 2 },
  { id: "summary", text: "Summary", depth: 2 },
  { id: "results", text: "Results by app", depth: 2 },
  { id: "apps", text: "The programs", depth: 2 },
  { id: "methodology", text: "Methodology", depth: 2 },
];
const machineItems = computed(() =>
  benchmarkMachines.map((entry) => ({ label: benchmarkMachineName(entry.label).processor, value: entry.id })),
);
const machineKind = computed(() => benchmarkMachineName(machine.value.label).kind);
const languages = computed(() => machineLanguages(machine.value));
const highlights = computed(() => benchmarkHighlights(machine.value));

const metric = ref<BenchmarkMetricKey>("execution");
const metricInfo = computed(() => benchmarkMetric(metric.value));
const metricItems = benchmarkMetrics.map((entry) => ({ label: entry.label, value: entry.key }));
const relative = ref(false);

const compareChoice = ref("Rust");
const compareOptions = computed(() => languages.value.filter((language) => language.key !== benchmarkBaseline));
const compare = computed(() =>
  compareOptions.value.some((language) => language.key === compareChoice.value)
    ? compareChoice.value
    : (compareOptions.value[0]?.key ?? ""),
);

function selectMetric(key: BenchmarkMetricKey) {
  metric.value = key;
  document.getElementById("results")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function names(keys: string[]) {
  return keys.map((key) => benchmarkLanguage(key).label).join(" and ");
}

const facts = computed(() => [
  ...(machineKind.value ? [{ label: "Type", value: machineKind.value }] : []),
  { label: "CPU", value: machine.value.machine.cpu },
  { label: "Threads", value: String(machine.value.machine.logicalCores) },
  { label: "Memory", value: formatMemory(machine.value.machine.memoryBytes) },
  { label: "OS", value: describeOs(machine.value.machine.os) },
  { label: "Run", value: formatBenchmarkDate(machine.value.date) },
  {
    label: "Method",
    value: `${machine.value.profile} profile · ${machine.value.settings.buildRuns} clean builds · ${machine.value.settings.warmups} warm-up + ${machine.value.settings.runs} measured runs`,
  },
]);

/** How each headline card words Rux against the others. */
const wording = {
  memory: { better: "less", worse: "more", best: "leanest", one: "language", field: "languages" },
  executable: { better: "smaller", worse: "larger", best: "smallest", one: "native build", field: "native builds" },
  compile: { better: "faster", worse: "slower", best: "fastest", one: "language", field: "languages" },
  execution: { better: "faster", worse: "slower", best: "fastest", one: "language", field: "languages" },
};
type Wording = (typeof wording)[keyof typeof wording];

/**
 * One headline card: Rux against the best other language, "1.73× slower than
 * the fastest, Go". The four metrics have four units (MiB, KiB, s, s), so each
 * card says the same kind of thing instead — how many times better or worse,
 * and than whom — and the absolute figure moves to the small print.
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

const tiles = computed(() => {
  const value = highlights.value;
  const compileSeconds =
    value.compileMedian === null ? "" : formatBenchmarkValue(value.compileMedian, benchmarkMetric("compile").digits);
  const executableKiB = value.executableMedian === null ? "" : formatBenchmarkValue(value.executableMedian, 0);
  return [
    {
      title: "Peak memory",
      metric: "memory" as const,
      ...versus(value.memory, wording.memory),
      detail: `${spread(value.memory, wording.memory)} Least memory in ${value.memoryWins} / ${value.appCount} apps.`,
    },
    {
      title: "Executable size",
      metric: "executable" as const,
      ...versus(value.executable, wording.executable),
      detail: `${spread(value.executable, wording.executable)} Median ${executableKiB} KiB, no runtime needed.`,
    },
    {
      title: "Compile time",
      metric: "compile" as const,
      ...versus(value.compile, wording.compile),
      detail: `${spread(value.compile, wording.compile)} Median clean release build ${compileSeconds} s.`,
    },
    {
      title: "Execution time",
      metric: "execution" as const,
      ...versus(value.execution, wording.execution),
      detail: `${spread(value.execution, wording.execution)} The Rux backend has no optimizer yet.`,
    },
  ];
});
</script>

<template>
  <UContainer>
    <UPageHero title="Benchmarks" orientation="horizontal">
      <template #description>
        Ten identical programs in Rux, Rust, C++, Go, C# and Java, built and run on real machines. Execution time, CPU
        time, peak memory, compile time and binary size, all measured by one open-source runner.
      </template>
      <template #links>
        <UButton :to="repository" target="_blank" icon="i-simple-icons-github" color="neutral" variant="subtle">
          Benchmark source
        </UButton>
        <UButton to="#methodology" color="neutral" variant="ghost" trailing-icon="i-lucide-arrow-down">
          Methodology
        </UButton>
      </template>

      <!-- The headline figures fill the hero's second column, so the four facts a
           visitor came for are above the fold. Each opens its metric below. -->
      <section aria-labelledby="glance-heading">
        <h2 id="glance-heading" class="sr-only">At a glance</h2>
        <div class="grid grid-cols-2 gap-3">
          <button
            v-for="tile in tiles"
            :key="tile.title"
            type="button"
            class="flex flex-col items-start rounded-lg border border-default bg-default/60 p-3 text-left backdrop-blur transition-colors hover:border-accented focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:p-5"
            @click="selectMetric(tile.metric)"
          >
            <span class="text-sm text-muted">{{ tile.title }}</span>
            <span class="mt-1.5 text-2xl font-semibold tracking-tight text-highlighted sm:text-3xl"
              >{{ tile.figure
              }}<span
                v-if="'unit' in tile && tile.unit"
                class="ml-1.5 text-base font-medium tracking-normal"
                :class="tile.better ? 'text-success' : 'text-warning'"
                >{{ tile.unit }}</span
              ></span
            >
            <span class="mt-1 text-sm text-toned">{{ tile.caption }}</span>
            <span class="mt-3 hidden text-xs text-muted sm:block">{{ tile.detail }}</span>
          </button>
        </div>
        <p class="mt-3 text-xs text-muted">{{ machine.label }} · {{ formatBenchmarkDate(machine.date) }}</p>
      </section>
    </UPageHero>

    <UPage>
      <UPageBody class="space-y-16 pb-16">
        <UAlert
          color="primary"
          variant="subtle"
          icon="i-lucide-info"
          title="Rux is pre-1.0, and its backend does not optimize yet"
        >
          <template #description>
            Rux compiles through its own pipeline straight to x86-64, with no LLVM and, so far, no optimization passes
            and a register allocator that spills everything to the stack. Its run times are a baseline to track from
            release to release, not a verdict. Memory use and binary size already reflect the language design: no
            garbage collector, no runtime. The
            <ULink to="/blog/language-without-llvm" class="font-medium underline">compiler design post</ULink>
            explains why.
          </template>
        </UAlert>

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
            </dl>

            <details class="group mt-6 border-t border-default pt-4">
              <summary
                class="flex cursor-pointer list-none items-center gap-1.5 text-sm font-medium text-toned hover:text-highlighted [&::-webkit-details-marker]:hidden"
              >
                <UIcon name="i-lucide-chevron-right" class="size-4 transition-transform group-open:rotate-90" />
                Toolchains
                <span class="font-normal text-muted">
                  · benchmarks commit
                  <ULink :to="`${repository}/commit/${machine.machine.commit}`" target="_blank" class="font-mono">
                    {{ machine.machine.commit }}
                  </ULink>
                </span>
              </summary>
              <dl class="mt-3 grid gap-x-8 gap-y-2 text-sm sm:grid-cols-[auto_1fr]">
                <template v-for="(version, tool) in machine.toolchains" :key="tool">
                  <dt class="text-muted">{{ tool }}</dt>
                  <dd class="font-mono text-xs break-all text-toned sm:text-sm">{{ version }}</dd>
                </template>
              </dl>
            </details>
          </UCard>
        </section>

        <!-- Summary -->
        <section aria-labelledby="summary">
          <h2 id="summary" class="scroll-mt-24 text-2xl font-semibold text-highlighted">Summary</h2>
          <p class="mt-2 text-muted">
            Each cell is the geometric mean, over all ten apps, of the language's value divided by Rux's. Rux is 1.00×
            by definition.
          </p>
          <BenchmarkSummary :machine="machine" class="mt-5" @select="selectMetric" />
        </section>

        <!-- Results by metric -->
        <section aria-labelledby="results">
          <h2 id="results" class="scroll-mt-24 text-2xl font-semibold text-highlighted">Results by app</h2>

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

          <div class="mt-5 flex flex-wrap items-center gap-x-2 gap-y-2" role="group" aria-label="Compare Rux with">
            <span class="mr-1 inline-flex items-center gap-1.5 text-sm text-toned">
              <span class="inline-block size-3 rounded-full bg-(--bench-rux)" aria-hidden="true" />
              Rux compared with
            </span>
            <UButton
              v-for="language in compareOptions"
              :key="language.key"
              size="xs"
              color="neutral"
              :variant="language.key === compare ? 'solid' : 'outline'"
              :aria-pressed="language.key === compare"
              @click="compareChoice = language.key"
            >
              <span
                v-if="language.key === compare"
                class="inline-block size-2 rounded-full bg-(--bench-compare) ring-1 ring-(--ui-bg)"
                aria-hidden="true"
              />
              {{ language.label }}
            </UButton>
          </div>

          <UCard variant="outline" class="mt-5">
            <BenchmarkDotPlot :machine="machine" :metric="metric" :compare="compare" />
            <p class="mt-4 flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-muted">
              <span class="inline-flex items-center gap-1.5">
                <span class="inline-block size-2.5 rounded-full bg-(--bench-other)" aria-hidden="true" />
                Other languages
              </span>
              <span class="inline-flex items-center gap-1.5">
                <span class="inline-block size-2.5 rounded-full border-2 border-(--bench-other)" aria-hidden="true" />
                Hollow: JIT, needs an installed runtime
              </span>
              <span>Hover, tap or focus the chart for values.</span>
            </p>
          </UCard>

          <div class="mt-8 flex flex-wrap items-center justify-between gap-3">
            <h3 class="font-semibold text-highlighted">
              {{ metricInfo.label }} {{ relative ? "relative to Rux" : `(${metricInfo.unit})` }}
            </h3>
            <USwitch v-model="relative" label="Relative to Rux" size="sm" />
          </div>
          <BenchmarkTable :machine="machine" :metric="metric" :relative="relative" :compare="compare" class="mt-3" />
        </section>

        <!-- Apps -->
        <section aria-labelledby="apps">
          <h2 id="apps" class="scroll-mt-24 text-2xl font-semibold text-highlighted">The programs</h2>
          <p class="mt-2 text-muted">
            Each is an ordinary console program written the same way in every language. It takes its sizes as arguments,
            prints a deterministic result and exits; there is no timing code inside.
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

            <h3>How it is measured</h3>
            <p>
              Each app is built with the language's usual tool: rux, cargo, clang++, go build, dotnet publish, javac and
              jar, or native-image. After one untimed warm-up build come {{ machine.settings.buildRuns }} timed clean
              release builds. Go starts from a cache holding only the precompiled standard library, so the app itself is
              always compiled from scratch.
            </p>
            <p>
              Each program then gets {{ machine.settings.warmups }} unmeasured warm-up run{{
                machine.settings.warmups === 1 ? "" : "s"
              }}
              and {{ machine.settings.runs }} measured runs, with the languages taking turns so that drifts in the
              machine's state hit all of them alike. Execution time includes process start-up, which for the JIT builds
              means starting the runtime and compiling.
            </p>
            <p>
              Every run must exit with code 0 and print exactly the expected output; otherwise the cell is marked FAIL
              and left out. The page shows medians, and the chart tooltips add the minimum, the standard deviation and
              the run count.
            </p>

            <h3>Reading the numbers</h3>
            <p>
              C# and Java appear twice. <strong class="text-highlighted">AOT</strong> is one native executable
              (NativeAOT, GraalVM Native Image); <strong class="text-highlighted">JIT</strong> runs on an installed
              runtime (framework-dependent .NET, <code>java -jar</code>). The JIT builds' executable and deployable
              sizes exclude the shared runtime they need, which is why the Java jar is only a few KiB.
            </p>
            <p>
              Peak memory is the working set on Windows and maxrss on Linux, so it is not comparable across operating
              systems, and times are not comparable across machines. Ratios are a language's value divided by Rux's,
              summarised by geometric mean so that a 2× win and a 2× loss cancel out.
            </p>
            <p>
              The apps, the runner and full instructions to reproduce these results on your own machine are in
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
