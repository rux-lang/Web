import assert from "node:assert/strict";
import test from "node:test";
import { buildBenchmarkData } from "./import-benchmarks.mjs";

const results = {
  schemaVersion: 1,
  profile: "standard",
  startedAt: "2026-10-07T14:40:47.5240133+03:00",
  settings: { baseline: "Rux", apps: ["Sort"], languages: ["Rux", "Go"], buildRuns: 3, runs: 5, warmups: 1 },
  machine: {
    os: "Microsoft Windows 10.0.26300",
    cpu: "AMD Ryzen 5 5500",
    logicalCores: 12,
    memoryBytes: 17041051648,
    commit: "a4370eb",
    toolchains: { Rux: "Rux 0.4.0", Go: "go version go1.27.1 windows/amd64" },
    removedVariables: ["SECRET_LOOKING_THING"],
  },
  cases: [
    { app: "Sort", language: "Rux", status: "ok", runs: [{ wallMs: 4867 }], output: "deadbeef" },
    { app: "Sort", language: "Go", status: "run-failed", runs: [], output: "" },
  ],
};

const summaryCsv = [
  "app,language,metric,unit,median,min,mean,stddev,count,ratio_vs_baseline",
  "Sort,Rux,execution,s,4.86712345678,4.8,4.87,0.01,5,1",
  "Sort,Rux,compile,s,0.66,0.65,0.66,0.004,3,1",
  "Sort,Go,compile,s,0.35,0.34,0.35,0.002,3,0.53",
].join("\r\n");

const data = buildBenchmarkData({ results, summaryCsv, id: "ryzen5-5500", label: "Desktop", order: 1 });

test("keeps the machine description and drops samples, output and environment", () => {
  assert.equal(data.schemaVersion, 1);
  assert.equal(data.id, "ryzen5-5500");
  assert.equal(data.date, results.startedAt);
  assert.deepEqual(data.settings, { baseline: "Rux", buildRuns: 3, runs: 5, warmups: 1 });
  assert.deepEqual(Object.keys(data.machine), ["cpu", "logicalCores", "memoryBytes", "os", "commit"]);
  assert.equal(JSON.stringify(data).includes("deadbeef"), false);
  assert.equal(JSON.stringify(data).includes("SECRET_LOOKING_THING"), false);
  assert.equal("cases" in data, false);
});

test("takes the runner's statistics from summary.csv, rounded to six digits", () => {
  assert.deepEqual(data.metrics.execution.cells.Sort.Rux, { median: 4.86712, min: 4.8, stddev: 0.01, count: 5 });
  assert.equal(data.metrics.compile.unit, "s");
  assert.equal(data.metrics.compile.cells.Sort.Go.median, 0.35);
});

test("leaves a failed case as null and lists it", () => {
  assert.equal(data.metrics.execution.cells.Sort.Go, null);
  assert.deepEqual(data.failures, [{ app: "Sort", language: "Go", status: "run-failed" }]);
});

test("rejects a metric reported in two units", () => {
  assert.throws(
    () =>
      buildBenchmarkData({
        results,
        summaryCsv: `${summaryCsv}\nSort,Go,execution,ms,1,1,1,0,5,1`,
        id: "x",
        label: "x",
        order: 1,
      }),
    /mixes units/,
  );
});
