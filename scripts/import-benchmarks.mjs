/**
 * Turns one run of github.com/rux-lang/Benchmarks into a data file for the
 * /benchmarks page.
 *
 *   npm run import:benchmarks -- <results folder> --id <machine-id> --label "<label>" [--order <n>]
 *
 * The runner writes Results/<date>-<os>/ with results.json (machine, settings,
 * toolchains, every sample) and summary.csv (median, min, stddev and count per
 * app, language and metric). The statistics are taken from summary.csv as they
 * are, so the page shows exactly the numbers in the runner's own report; only
 * the machine description comes from results.json. Raw samples and program
 * output stay behind — the page never shows them, and they are nine tenths of
 * the file.
 *
 * Re-running with the same --id replaces that machine's file, so a fresh run on
 * the same computer is the same command again.
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

// Six significant digits keeps every value the report prints (three decimals
// of a 20-second time) without the float noise of the CSV.
function round(value) {
  return Number(value.toPrecision(6));
}

function parseSummary(csv) {
  const [header, ...lines] = csv.trim().split(/\r?\n/);
  const columns = header.split(",");
  return lines.map((line) => {
    const cells = line.split(",");
    return Object.fromEntries(columns.map((column, index) => [column, cells[index]]));
  });
}

/**
 * The data file for one machine. Pure, so the test can feed it fixtures.
 *
 * A cell is null when the runner recorded no statistics for it: a build or run
 * that failed validation is left out of summary.csv, and the page shows FAIL.
 */
export function buildBenchmarkData({ results, summaryCsv, id, label, order }) {
  const { apps, languages, baseline, buildRuns, runs, warmups } = results.settings;
  const rows = parseSummary(summaryCsv);

  const metrics = {};
  for (const row of rows) {
    const metric = (metrics[row.metric] ??= { unit: row.unit, cells: {} });
    if (metric.unit !== row.unit) throw new Error(`Metric ${row.metric} mixes units ${metric.unit} and ${row.unit}`);
    const count = Number(row.count);
    if (!count) continue;
    (metric.cells[row.app] ??= {})[row.language] = {
      median: round(Number(row.median)),
      min: round(Number(row.min)),
      stddev: round(Number(row.stddev)),
      count,
    };
  }

  for (const metric of Object.values(metrics)) {
    for (const app of apps) {
      const cells = (metric.cells[app] ??= {});
      for (const language of languages) cells[language] ??= null;
    }
  }

  const failures = results.cases
    .filter((entry) => entry.status !== "ok")
    .map((entry) => ({ app: entry.app, language: entry.language, status: entry.status }));

  return {
    schemaVersion: 1,
    id,
    label,
    order,
    date: results.startedAt,
    profile: results.profile,
    settings: { baseline, buildRuns, runs, warmups },
    machine: {
      cpu: results.machine.cpu,
      logicalCores: results.machine.logicalCores,
      memoryBytes: results.machine.memoryBytes,
      os: results.machine.os,
      commit: results.machine.commit,
    },
    toolchains: results.machine.toolchains,
    apps,
    languages,
    failures,
    metrics,
  };
}

function main() {
  const { values, positionals } = parseArgs({
    allowPositionals: true,
    options: {
      id: { type: "string" },
      label: { type: "string" },
      order: { type: "string", default: "1" },
    },
  });
  const [folder] = positionals;
  if (!folder || !values.id || !values.label) {
    console.error(
      'Usage: npm run import:benchmarks -- <results folder> --id <machine-id> --label "<label>" [--order <n>]',
    );
    process.exit(1);
  }
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(values.id)) {
    console.error(`--id must be lowercase words joined by hyphens, got "${values.id}"`);
    process.exit(1);
  }

  const results = JSON.parse(readFileSync(resolve(folder, "results.json"), "utf8"));
  if (results.schemaVersion !== 1) throw new Error(`Unsupported results.json schemaVersion ${results.schemaVersion}`);
  const data = buildBenchmarkData({
    results,
    summaryCsv: readFileSync(resolve(folder, "summary.csv"), "utf8"),
    id: values.id,
    label: values.label,
    order: Number(values.order),
  });

  const target = resolve(root, "data/benchmarks", `${values.id}.json`);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, `${JSON.stringify(data, null, 2)}\n`);
  console.log(
    `Wrote ${target}: ${data.apps.length} apps × ${data.languages.length} languages, ${Object.keys(data.metrics).length} metrics` +
      (data.failures.length ? `, ${data.failures.length} failed cases` : ""),
  );
}

if (process.argv[1] && import.meta.url.endsWith(basename(process.argv[1]))) main();
