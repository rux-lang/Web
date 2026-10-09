/**
 * The /benchmarks page's data and the arithmetic over it.
 *
 * One JSON file per machine under data/benchmarks/, written by
 * scripts/import-benchmarks.mjs from a run of github.com/rux-lang/Benchmarks.
 * They are globbed rather than listed, so adding a machine is the import
 * command and nothing else. The path is relative, not `~~/`, because Vitest
 * only knows the `~` alias.
 *
 * Every metric is lower-is-better, and every ratio is "value ÷ Rux value", the
 * same convention as the runner's own report.
 */
import type {
  BenchmarkApp,
  BenchmarkCell,
  BenchmarkLanguage,
  BenchmarkMachine,
  BenchmarkMetric,
  BenchmarkMetricKey,
} from "~/types/benchmarks";

const files = import.meta.glob<BenchmarkMachine>("../../data/benchmarks/*.json", { eager: true, import: "default" });

export const benchmarkMachines: BenchmarkMachine[] = Object.values(files).sort(
  (a, b) => a.order - b.order || a.label.localeCompare(b.label),
);

/**
 * A machine label as the import writes it, "Laptop · Core i5-8250U", split into
 * its form factor and processor. The machine tabs show only the processor —
 * three full labels overflow a phone — and the form factor moves into the
 * machine card. A label without " · " is all processor.
 */
export function benchmarkMachineName(label: string): { kind?: string; processor: string } {
  const [kind, ...rest] = label.split(" · ");
  return rest.length ? { kind, processor: rest.join(" · ") } : { processor: label };
}

export const benchmarkBaseline = "Rux";

export const benchmarkLanguages: BenchmarkLanguage[] = [
  { key: "Rux", label: "Rux", mode: "aot" },
  { key: "Rust", label: "Rust", mode: "aot" },
  { key: "Cpp", label: "C++", mode: "aot" },
  { key: "Go", label: "Go", mode: "aot" },
  { key: "CSharpAot", label: "C# AOT", mode: "aot" },
  { key: "CSharpJit", label: "C# JIT", mode: "jit" },
  { key: "JavaAot", label: "Java AOT", mode: "aot" },
  { key: "JavaJit", label: "Java JIT", mode: "jit" },
];

// Descriptions follow the Benchmarks README; they describe the programs, which
// do not change from machine to machine, so they live here rather than in the
// per-machine files.
export const benchmarkApps: BenchmarkApp[] = [
  {
    key: "Sha512",
    description: "SHA-512 of a pseudo-random buffer, re-hashed with the digest fed back in",
    stresses: "64-bit integer and bit operations",
    size: "16 MiB × 16 rounds",
  },
  {
    key: "Mandelbrot",
    description: "Renders the Mandelbrot set and writes it as a PPM image",
    stresses: "Floating point, file output",
    size: "2000×2000, 500 iterations",
  },
  {
    key: "WordCount",
    description: "Generates text from a random vocabulary, counts words in a hash map, prints the top 10",
    stresses: "Strings, hashing, hash maps",
    size: "10M words, 100k vocabulary",
  },
  {
    key: "BinaryTrees",
    description: "Builds and frees many complete binary trees",
    stresses: "Allocation",
    size: "depth 18",
  },
  {
    key: "Sort",
    description: "Quicksort (median of three, insertion sort below 16) of random 32-bit integers",
    stresses: "Branches, memory access",
    size: "10M integers",
  },
  {
    key: "NBody",
    description: "Five-body planetary simulation",
    stresses: "Floating point, square root",
    size: "5M steps",
  },
  {
    key: "MatrixMultiply",
    description: "Dense double-precision matrix product, i-k-j loop order",
    stresses: "Loops, cache, vectorization",
    size: "1024×1024",
  },
  {
    key: "PrimeSieve",
    description: "Sieve of Eratosthenes over a byte array, prints count and sum",
    stresses: "Memory bandwidth",
    size: "primes up to 100M",
  },
  {
    key: "Fannkuch",
    description: "Pancake flips over every permutation (fannkuch-redux)",
    stresses: "Small arrays, branches",
    size: "n = 10",
  },
  {
    key: "Base64",
    description: "Hand-written Base64 encode and decode round trip",
    stresses: "Byte manipulation, table lookups",
    size: "32 MiB × 4 rounds",
  },
];

export const benchmarkMetrics: BenchmarkMetric[] = [
  {
    key: "execution",
    label: "Execution time",
    unit: "s",
    digits: 3,
    description: "Wall-clock time from process start to exit, including start-up.",
  },
  {
    key: "cpu",
    label: "CPU time",
    unit: "s",
    digits: 3,
    description: "User plus kernel CPU time of the process.",
  },
  {
    key: "memory",
    label: "Peak memory",
    unit: "MiB",
    digits: 1,
    description: "Peak working set on Windows, maximum resident set size on Linux.",
  },
  {
    key: "compile",
    label: "Compile time",
    unit: "s",
    digits: 2,
    description: "Clean release build with the language's own build tool.",
  },
  {
    key: "executable",
    label: "Executable size",
    unit: "KiB",
    digits: 0,
    description: "Size of the program file.",
  },
  {
    key: "deployable",
    label: "Deployable size",
    unit: "KiB",
    digits: 0,
    description: "Every file needed to run the program without an SDK.",
  },
];

export function benchmarkMachine(id: unknown): BenchmarkMachine | undefined {
  return benchmarkMachines.find((machine) => machine.id === id) ?? benchmarkMachines[0];
}

export function benchmarkMetric(key: BenchmarkMetricKey): BenchmarkMetric {
  return benchmarkMetrics.find((metric) => metric.key === key)!;
}

export function benchmarkLanguage(key: string): BenchmarkLanguage {
  return benchmarkLanguages.find((language) => language.key === key) ?? { key, label: key, mode: "aot" };
}

/** The languages the machine actually ran, in the page's fixed order. */
export function machineLanguages(machine: BenchmarkMachine): BenchmarkLanguage[] {
  const known = benchmarkLanguages.filter((language) => machine.languages.includes(language.key));
  const unknown = machine.languages.filter((key) => !known.some((language) => language.key === key));
  return [...known, ...unknown.map(benchmarkLanguage)];
}

export function benchmarkCell(
  machine: BenchmarkMachine,
  metric: BenchmarkMetricKey,
  app: string,
  language: string,
): BenchmarkCell | null {
  return machine.metrics[metric]?.cells[app]?.[language] ?? null;
}

export function benchmarkRatio(
  machine: BenchmarkMachine,
  metric: BenchmarkMetricKey,
  app: string,
  language: string,
): number | null {
  const value = benchmarkCell(machine, metric, app, language);
  const baseline = benchmarkCell(machine, metric, app, benchmarkBaseline);
  if (!value || !baseline || baseline.median <= 0) return null;
  return value.median / baseline.median;
}

export function geometricMean(values: number[]): number | null {
  const positive = values.filter((value) => value > 0);
  if (!positive.length) return null;
  return Math.exp(positive.reduce((sum, value) => sum + Math.log(value), 0) / positive.length);
}

export function median(values: number[]): number | null {
  if (!values.length) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[middle]! : (sorted[middle - 1]! + sorted[middle]!) / 2;
}

/** Geometric mean over all apps of value ÷ Rux — one cell of the report's summary table. */
export function benchmarkGeomean(
  machine: BenchmarkMachine,
  metric: BenchmarkMetricKey,
  language: string,
): number | null {
  const ratios = machine.apps
    .map((app) => benchmarkRatio(machine, metric, app, language))
    .filter((ratio): ratio is number => ratio !== null);
  return geometricMean(ratios);
}

/** Languages holding the lowest median for one app (several on a tie). */
export function bestLanguages(machine: BenchmarkMachine, metric: BenchmarkMetricKey, app: string): string[] {
  let best = Infinity;
  let keys: string[] = [];
  for (const language of machine.languages) {
    const value = benchmarkCell(machine, metric, app, language)?.median;
    if (value === undefined) continue;
    if (value < best) {
      best = value;
      keys = [language];
    } else if (value === best) {
      keys.push(language);
    }
  }
  return keys;
}

/** Languages with the lowest geometric mean for a metric. */
export function bestGeomeanLanguages(machine: BenchmarkMachine, metric: BenchmarkMetricKey): string[] {
  const means = machine.languages.map((language) => [language, benchmarkGeomean(machine, metric, language)] as const);
  const best = Math.min(...means.map(([, mean]) => mean ?? Infinity));
  return means.filter(([, mean]) => mean === best).map(([language]) => language);
}

export interface BenchmarkStanding {
  language: string;
  geomean: number;
}

/** Languages ordered by geometric mean against Rux, best first. */
export function benchmarkStandings(
  machine: BenchmarkMachine,
  metric: BenchmarkMetricKey,
  filter: (language: BenchmarkLanguage) => boolean = () => true,
): BenchmarkStanding[] {
  return machineLanguages(machine)
    .filter(filter)
    .map((language) => ({ language: language.key, geomean: benchmarkGeomean(machine, metric, language.key) }))
    .filter((standing): standing is BenchmarkStanding => standing.geomean !== null)
    .sort((a, b) => a.geomean - b.geomean);
}

/**
 * Rux against the other languages on one metric, for the headline cards: the
 * best of the others (several on a tie), Rux's place, and the spread of the
 * others' geomeans. Every geomean is "their value ÷ Rux's", so above 1 means
 * Rux does better and below 1 means it does worse.
 */
export interface BenchmarkComparison {
  /** The best other language(s) and their shared geomean against Rux. */
  rivals: string[];
  ratio: number;
  /** Rux's 1-based place among `field` languages, best first. */
  rank: number;
  field: number;
  /** The others' geomeans, lowest and highest. */
  spread: [number, number];
}

export function benchmarkComparison(
  machine: BenchmarkMachine,
  metric: BenchmarkMetricKey,
  filter: (language: BenchmarkLanguage) => boolean = () => true,
): BenchmarkComparison | null {
  const standings = benchmarkStandings(machine, metric, filter);
  const others = standings.filter((standing) => standing.language !== benchmarkBaseline);
  const rank = standings.findIndex((standing) => standing.language === benchmarkBaseline) + 1;
  if (!others.length || rank === 0) return null;
  const ratio = others[0]!.geomean;
  return {
    rivals: others.filter((standing) => standing.geomean === ratio).map((standing) => standing.language),
    ratio,
    rank,
    field: standings.length,
    spread: [ratio, others.at(-1)!.geomean],
  };
}

export function ordinal(value: number): string {
  const tens = value % 100;
  if (tens >= 11 && tens <= 13) return `${value}th`;
  return `${value}${{ 1: "st", 2: "nd", 3: "rd" }[value % 10] ?? "th"}`;
}

export interface BenchmarkHighlights {
  appCount: number;
  memory: BenchmarkComparison | null;
  /** Among self-contained (AOT) builds only: a JIT build ships its runtime separately. */
  executable: BenchmarkComparison | null;
  compile: BenchmarkComparison | null;
  execution: BenchmarkComparison | null;
  /** Apps where Rux has the lowest peak memory (ties included). */
  memoryWins: number;
  /** Median over apps of Rux's executable size, KiB. */
  executableMedian: number | null;
  /** Median over apps of Rux's clean build time, s. */
  compileMedian: number | null;
}

export function benchmarkHighlights(machine: BenchmarkMachine): BenchmarkHighlights {
  const baseline = (metric: BenchmarkMetricKey) =>
    machine.apps
      .map((app) => benchmarkCell(machine, metric, app, benchmarkBaseline)?.median)
      .filter((value): value is number => value !== undefined);

  const memoryWins = machine.apps.filter((app) =>
    bestLanguages(machine, "memory", app).includes(benchmarkBaseline),
  ).length;

  return {
    appCount: machine.apps.length,
    memory: benchmarkComparison(machine, "memory"),
    executable: benchmarkComparison(machine, "executable", (language) => language.mode === "aot"),
    compile: benchmarkComparison(machine, "compile"),
    execution: benchmarkComparison(machine, "execution"),
    memoryWins,
    executableMedian: median(baseline("executable")),
    compileMedian: median(baseline("compile")),
  };
}

/**
 * The runner records Environment.OSVersion, which reports Windows 11 as
 * "Windows 10.0.<build>" — every build from 22000 up is Windows 11.
 */
export function describeOs(os: string): string {
  const windows = /Windows 10\.0\.(\d+)/.exec(os);
  if (windows) {
    const build = Number(windows[1]);
    return `Windows ${build >= 22000 ? 11 : 10} (build ${build})`;
  }
  return os;
}

/** The calendar day the run started, as the runner's machine saw it. */
export function formatBenchmarkDate(date: string): string {
  const day = date.slice(0, 10);
  return new Intl.DateTimeFormat("en", { dateStyle: "long", timeZone: "UTC" }).format(new Date(`${day}T00:00:00Z`));
}

export function formatMemory(bytes: number): string {
  return `${Math.round(bytes / 2 ** 30)} GiB`;
}
