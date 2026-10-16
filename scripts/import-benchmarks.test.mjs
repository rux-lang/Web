import assert from "node:assert/strict";
import test from "node:test";
import { buildAppRun, buildCompileRun, osFamily, planImport } from "./import-benchmarks.mjs";

const machine = {
  os: "Microsoft Windows 10.0.26300",
  cpu: "AMD Ryzen 5 5500",
  logicalCores: 12,
  memoryBytes: 17041051648,
  commit: "73e4999",
  toolchains: { Rux: "Rux 0.4.0", Go: "go version go1.27.1 windows/amd64" },
  removedVariables: ["SECRET_LOOKING_THING"],
};

const results = {
  schemaVersion: 1,
  command: "all",
  profile: "standard",
  startedAt: "2026-10-15T16:35:52.5309298+03:00",
  settings: { baseline: "Rux", apps: ["Sort"], languages: ["Rux", "Go"], buildRuns: 3, runs: 5, warmups: 1 },
  machine,
  cases: [
    { app: "Sort", language: "Rux", status: "ok", runs: [{ wallMs: 726 }], output: "deadbeef" },
    { app: "Sort", language: "Go", status: "run-failed", runs: [], output: "" },
  ],
};

const summaryCsv = [
  "app,language,metric,unit,median,min,mean,stddev,count,ratio_vs_baseline",
  "Sort,Rux,execution,s,0.72612345678,0.72,0.73,0.01,5,1",
  "Sort,Rux,compile,s,0.66,0.65,0.66,0.004,3,1",
  "Sort,Go,compile,s,0.35,0.34,0.35,0.002,3,0.53",
].join("\r\n");

const compileResults = {
  ...results,
  command: "compile",
  startedAt: "2026-10-15T17:10:41.8310767+03:00",
  settings: {
    baseline: "Rux",
    apps: ["Baseline", "Large"],
    languages: ["Rux", "Go"],
    buildRuns: 3,
    runs: 0,
    warmups: 0,
    cpu: 0,
  },
  cases: [
    { app: "Baseline", language: "Rux", status: "ok", sourceFiles: 4, sourceLines: 128, output: "ccab150c" },
    { app: "Large", language: "Rux", status: "ok", sourceFiles: 112, sourceLines: 98574, output: "ccab150c" },
    { app: "Large", language: "Go", status: "build-failed", sourceFiles: 112, sourceLines: 96155, output: "" },
  ],
};

const compileCsv = [
  "project,language,metric,unit,median,min,mean,stddev,count,ratio_vs_baseline",
  "Baseline,Rux,clean,s,0.1350235,0.1348992,0.139,0.008,3,1",
  "Large,Rux,clean,s,1.1375334,1.133945,1.137,0.004,3,1",
  "Large,Rux,speed,lines/s,98200.4,98100,98200,10,3,1",
  "Large,Go,speed,lines/s,37997,37900,37997,10,0,0.39",
].join("\n");

const app = buildAppRun({ results, summaryCsv, machine: "ryzen5-5500" });
const compile = buildCompileRun({ results: compileResults, summaryCsv: compileCsv, machine: "ryzen5-5500" });

test("describes the run and drops samples, output and environment", () => {
  assert.equal(app.schemaVersion, 2);
  assert.equal(app.kind, "apps");
  assert.equal(app.machine, "ryzen5-5500");
  assert.equal(app.date, results.startedAt);
  assert.equal(app.commit, "73e4999");
  assert.deepEqual(app.settings, { baseline: "Rux", buildRuns: 3, runs: 5, warmups: 1 });
  assert.deepEqual(Object.keys(app.hardware), ["cpu", "logicalCores", "memoryBytes", "os"]);
  for (const data of [app, compile]) {
    assert.equal(JSON.stringify(data).includes("deadbeef"), false);
    assert.equal(JSON.stringify(data).includes("ccab150c"), false);
    assert.equal(JSON.stringify(data).includes("SECRET_LOOKING_THING"), false);
    assert.equal("cases" in data, false);
  }
});

test("takes the runner's statistics from summary.csv, rounded to six digits", () => {
  assert.deepEqual(app.metrics.execution.cells.Sort.Rux, { median: 0.726123, min: 0.72, stddev: 0.01, count: 5 });
  assert.equal(app.metrics.compile.unit, "s");
  assert.equal(app.metrics.compile.cells.Sort.Go.median, 0.35);
});

test("leaves a failed case as null and lists it", () => {
  assert.equal(app.metrics.execution.cells.Sort.Go, null);
  assert.deepEqual(app.failures, [{ app: "Sort", language: "Go", status: "run-failed" }]);
});

test("rejects a metric reported in two units", () => {
  assert.throws(
    () => buildAppRun({ results, summaryCsv: `${summaryCsv}\nSort,Go,execution,ms,1,1,1,0,5,1`, machine: "x" }),
    /mixes units/,
  );
});

test("reads a compile run by project, with each project's size", () => {
  assert.equal(compile.kind, "compile");
  assert.deepEqual(compile.projects, ["Baseline", "Large"]);
  assert.deepEqual(compile.settings, { baseline: "Rux", buildRuns: 3, cpu: 0 });
  assert.equal(compile.metrics.clean.cells.Large.Rux.median, 1.13753);
  assert.equal(compile.metrics.speed.unit, "lines/s");
  // Speed is measured on Large only, so Baseline is absent rather than a failure.
  assert.deepEqual(Object.keys(compile.metrics.speed.cells), ["Large"]);
  assert.equal(compile.metrics.speed.cells.Large.Go, null);
  assert.equal(compile.metrics.clean.cells.Baseline.Go, null);
  assert.deepEqual(compile.sources.Large, { Rux: { files: 112, lines: 98574 }, Go: { files: 112, lines: 96155 } });
  assert.deepEqual(compile.failures, [{ project: "Large", language: "Go", status: "build-failed" }]);
});

const machines = [
  { id: "ryzen5-5500", label: "Desktop · Ryzen 5 5500", order: 1, cpu: "AMD Ryzen 5 5500", os: "windows" },
];
const run = (folder, data, csv) => ({ folder, results: data, summaryCsv: csv });

test("files each run under its benchmark and machine, newest first", () => {
  const older = { ...results, startedAt: "2026-10-07T14:40:47+03:00" };
  const plan = planImport(
    [run("old", older, summaryCsv), run("new", results, summaryCsv), run("compile", compileResults, compileCsv)],
    machines,
  );
  assert.deepEqual(
    plan.files.map((file) => [file.path, file.folder]),
    [
      ["apps/ryzen5-5500.json", "new"],
      ["compile/ryzen5-5500.json", "compile"],
    ],
  );
  assert.deepEqual(plan.skipped, ["old"]);
  assert.deepEqual(plan.machines, machines);
});

test("tells machines apart by CPU and operating system", () => {
  assert.equal(osFamily("Microsoft Windows 10.0.26300"), "windows");
  assert.equal(osFamily("Ubuntu 26.04.1 LTS"), "linux");
  const linux = { ...results, machine: { ...machine, os: "Ubuntu 26.04.1 LTS" } };
  assert.throws(() => planImport([run("linux", linux, summaryCsv)], machines), /No machine .* matches[\s\S]*--machine/);
});

test("adds a new computer named with --machine and --label", () => {
  const laptop = { ...results, machine: { ...machine, cpu: "Intel(R) Core(TM) i5-8250U CPU @ 1.60GHz", os: "Ubuntu" } };
  assert.throws(() => planImport([run("a", laptop, summaryCsv)], machines, { machine: "i5-8250u" }), /--label/);
  const plan = planImport([run("a", laptop, summaryCsv)], machines, { machine: "i5-8250u", label: "Laptop · i5" });
  assert.deepEqual(plan.machines.at(-1), {
    id: "i5-8250u",
    label: "Laptop · i5",
    order: 2,
    cpu: "Intel(R) Core(TM) i5-8250U CPU @ 1.60GHz",
    os: "linux",
  });
  assert.equal(plan.files[0].path, "apps/i5-8250u.json");
  assert.throws(
    () =>
      planImport([run("a", laptop, summaryCsv), run("b", results, summaryCsv)], machines, { machine: "x", label: "x" }),
    /names one computer/,
  );
});

test("refuses partial runs", () => {
  assert.throws(() => planImport([run("b", { ...results, command: "build" }, summaryCsv)], machines), /"build" run/);
  assert.throws(() => planImport([run("v", { ...results, schemaVersion: 2 }, summaryCsv)], machines), /schemaVersion/);
});
