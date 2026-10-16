/**
 * Runs of github.com/rux-lang/Benchmarks, as scripts/import-benchmarks.mjs
 * writes them. There are two benchmarks, each run separately on each machine:
 * the programs (`apps/<machine>.json`) and the compile benchmark
 * (`compile/<machine>.json`); `machines.json` says which computer is which.
 */
export type BenchmarkMetricKey =
  "execution" | "cpu" | "memory" | "compile" | "compileMemory" | "executable" | "deployable";

export interface BenchmarkCell {
  median: number;
  min: number;
  stddev: number;
  /** Measured runs (or timed builds) behind the median. */
  count: number;
}

export interface BenchmarkMetricResults {
  unit: string;
  /** app or project → language → statistics; null when the case failed validation. */
  cells: Record<string, Record<string, BenchmarkCell | null>>;
}

/** One entry of data/benchmarks/machines.json. */
export interface BenchmarkMachineInfo {
  id: string;
  /** "Form factor · Processor", e.g. "Laptop · Core i5-8250U". */
  label: string;
  order: number;
  /** The CPU and OS family the importer matches a run against. */
  cpu: string;
  os: string;
}

interface BenchmarkRunBase {
  schemaVersion: 2;
  /** The machines.json id of the computer that ran it. */
  machine: string;
  /** ISO timestamp of the start of the run. */
  date: string;
  profile: string;
  hardware: { cpu: string; logicalCores: number; memoryBytes: number; os: string };
  /** The rux-lang/Benchmarks commit the run was made from. */
  commit: string;
  toolchains: Record<string, string>;
  languages: string[];
}

/** A run of the ten programs (`all`): built, then run. */
export interface BenchmarkAppRun extends BenchmarkRunBase {
  kind: "apps";
  settings: { baseline: string; buildRuns: number; runs: number; warmups: number };
  apps: string[];
  failures: { app: string; language: string; status: string }[];
  metrics: Record<BenchmarkMetricKey, BenchmarkMetricResults>;
}

/** A run of the compile benchmark (`compile`): the generated Baseline and Large projects, built several ways. */
export interface BenchmarkCompileRun extends BenchmarkRunBase {
  kind: "compile";
  /** `cpu` is the logical CPU the one-CPU builds were pinned to. */
  settings: { baseline: string; buildRuns: number; cpu: number };
  projects: string[];
  /** project → language → size of its source. */
  sources: Record<string, Record<string, { files: number; lines: number }>>;
  failures: { project: string; language: string; status: string }[];
  /** metric → project → language; some metrics are measured on Large only. */
  metrics: Record<string, BenchmarkMetricResults>;
}

/** A computer and the runs it has made; either run may be missing. */
export interface BenchmarkMachine {
  id: string;
  label: string;
  order: number;
  apps?: BenchmarkAppRun;
  compile?: BenchmarkCompileRun;
}

export interface BenchmarkLanguage {
  key: string;
  label: string;
  /** How the program reaches the CPU: compiled ahead of time, or by a JIT at run time. */
  mode: "aot" | "jit";
}

export interface BenchmarkApp {
  key: string;
  description: string;
  stresses: string;
  size: string;
}

export interface BenchmarkMetric {
  key: BenchmarkMetricKey;
  label: string;
  unit: string;
  /** Decimals the report prints for this metric. */
  digits: number;
  description: string;
  /**
   * Ranked among self-contained builds only: a JIT build's program file needs
   * its runtime to run, so the report shows it but leaves it out of the ranking.
   */
  aotOnly?: boolean;
}

/** One row of the compile benchmark's report: a metric of one project. */
export interface BenchmarkCompileRow {
  key: string;
  label: string;
  project: string;
  /** A metric in the run's `metrics`, or the size of the project's source. */
  metric: string;
  unit: string;
  digits: number;
  /** Which way is better; null for a row that is not ranked (the source size). */
  better: "lower" | "higher" | null;
  aotOnly?: boolean;
}
