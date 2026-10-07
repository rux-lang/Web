/** One machine's run of github.com/rux-lang/Benchmarks, as scripts/import-benchmarks.mjs writes it. */
export type BenchmarkMetricKey = "execution" | "cpu" | "memory" | "compile" | "executable" | "deployable";

export interface BenchmarkCell {
  median: number;
  min: number;
  stddev: number;
  /** Measured runs (or timed builds) behind the median. */
  count: number;
}

export interface BenchmarkMetricResults {
  unit: string;
  /** app → language → statistics; null when the case failed validation. */
  cells: Record<string, Record<string, BenchmarkCell | null>>;
}

export interface BenchmarkMachine {
  schemaVersion: 1;
  id: string;
  label: string;
  order: number;
  /** ISO timestamp of the start of the run. */
  date: string;
  profile: string;
  settings: { baseline: string; buildRuns: number; runs: number; warmups: number };
  machine: { cpu: string; logicalCores: number; memoryBytes: number; os: string; commit: string };
  toolchains: Record<string, string>;
  apps: string[];
  languages: string[];
  failures: { app: string; language: string; status: string }[];
  metrics: Record<BenchmarkMetricKey, BenchmarkMetricResults>;
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
}
