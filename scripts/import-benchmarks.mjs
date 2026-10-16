/**
 * Turns runs of github.com/rux-lang/Benchmarks into data files for the
 * /benchmarks page.
 *
 *   npm run import:benchmarks -- <run folder | Results folder>... [--machine <id> [--label "<label>"] [--order <n>]]
 *
 * The runner has two benchmarks, and each run of one writes a folder:
 *
 *   Results/<date>-<os>/          `all`: ten small programs, built and run   → data/benchmarks/apps/<machine>.json
 *   Results/<date>-compile-<os>/  `compile`: a generated 100,000-line project → data/benchmarks/compile/<machine>.json
 *
 * Both hold results.json (machine, settings, toolchains, every sample) and
 * summary.csv (median, min, stddev and count per case and metric). The
 * statistics are taken from summary.csv as they are, so the page shows exactly
 * the numbers in the runner's own report; only the description of the run comes
 * from results.json. Raw samples and program output stay behind — the page
 * never shows them, and they are nine tenths of the file.
 *
 * Which benchmark a folder holds is read from results.json, and which computer
 * ran it from its CPU and operating system, matched against
 * data/benchmarks/machines.json. So the usual import is the whole Results
 * folder, gathered from every computer:
 *
 *   npm run import:benchmarks -- ../Benchmarks/Results
 *
 * For each machine and benchmark the newest run wins, and a file is written
 * only when it changes. A computer that is not in machines.json yet is named
 * once with --machine and --label, which adds it.
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dataDir = resolve(root, "data/benchmarks");
const machinesFile = resolve(dataDir, "machines.json");

/** The runner command behind each benchmark the page shows. */
const kinds = { all: "apps", compile: "compile" };

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

/** "windows", "linux" or "macos": memory is measured differently on each, so it is part of a machine's identity. */
export function osFamily(os) {
  if (/windows/i.test(os)) return "windows";
  if (/mac ?os|darwin|os x/i.test(os)) return "macos";
  return "linux";
}

/** "apps" or "compile", from the runner command that wrote results.json. */
export function benchmarkKind(results) {
  if (results.schemaVersion !== 1) throw new Error(`Unsupported results.json schemaVersion ${results.schemaVersion}`);
  const kind = kinds[results.command];
  if (!kind) {
    throw new Error(
      `A "${results.command}" run has only part of the results; import a run of "all" (the programs) or "compile"`,
    );
  }
  return kind;
}

/**
 * metric → case → language → statistics. A cell is null when the runner
 * recorded no statistics for it: a build or run that failed validation is left
 * out of summary.csv, and the page shows FAIL. `fill` lists the cases every
 * metric must have; the compile benchmark measures some metrics on Large only,
 * so there a metric has the cases it reports.
 */
function collectMetrics(rows, column, languages, fill) {
  const metrics = {};
  for (const row of rows) {
    const metric = (metrics[row.metric] ??= { unit: row.unit, cells: {} });
    if (metric.unit !== row.unit) throw new Error(`Metric ${row.metric} mixes units ${metric.unit} and ${row.unit}`);
    const cells = (metric.cells[row[column]] ??= {});
    const count = Number(row.count);
    if (!count) continue;
    cells[row.language] = {
      median: round(Number(row.median)),
      min: round(Number(row.min)),
      stddev: round(Number(row.stddev)),
      count,
    };
  }
  for (const metric of Object.values(metrics)) {
    for (const key of fill) metric.cells[key] ??= {};
    for (const cells of Object.values(metric.cells)) {
      for (const language of languages) cells[language] ??= null;
    }
  }
  return metrics;
}

/** What both benchmarks record about the run itself. */
function describeRun(kind, results, machine) {
  return {
    schemaVersion: 2,
    kind,
    machine,
    date: results.startedAt,
    profile: results.profile,
    hardware: {
      cpu: results.machine.cpu,
      logicalCores: results.machine.logicalCores,
      memoryBytes: results.machine.memoryBytes,
      os: results.machine.os,
    },
    commit: results.machine.commit,
    toolchains: results.machine.toolchains,
  };
}

/** The data file for one run of the programs (`all`). Pure, so the test can feed it fixtures. */
export function buildAppRun({ results, summaryCsv, machine }) {
  const { apps, languages, baseline, buildRuns, runs, warmups } = results.settings;
  return {
    ...describeRun("apps", results, machine),
    settings: { baseline, buildRuns, runs, warmups },
    apps,
    languages,
    failures: results.cases
      .filter((entry) => entry.status !== "ok")
      .map((entry) => ({ app: entry.app, language: entry.language, status: entry.status })),
    metrics: collectMetrics(parseSummary(summaryCsv), "app", languages, apps),
  };
}

/**
 * The data file for one run of the compile benchmark. The runner calls its
 * projects "apps" in results.json and "project" in summary.csv; the file says
 * projects throughout, and keeps each project's size per language.
 */
export function buildCompileRun({ results, summaryCsv, machine }) {
  const { apps: projects, languages, baseline, buildRuns, cpu } = results.settings;
  const sources = {};
  for (const entry of results.cases) {
    if (entry.sourceFiles === undefined) continue;
    (sources[entry.app] ??= {})[entry.language] = { files: entry.sourceFiles, lines: entry.sourceLines };
  }
  return {
    ...describeRun("compile", results, machine),
    settings: { baseline, buildRuns, cpu },
    projects,
    languages,
    sources,
    failures: results.cases
      .filter((entry) => entry.status !== "ok")
      .map((entry) => ({ project: entry.app, language: entry.language, status: entry.status })),
    metrics: collectMetrics(parseSummary(summaryCsv), "project", languages, []),
  };
}

export function buildRun(kind, input) {
  return kind === "compile" ? buildCompileRun(input) : buildAppRun(input);
}

/** The machines.json entry that ran these results: the same CPU on the same operating system. */
export function findMachine(machines, results) {
  const os = osFamily(results.machine.os);
  return machines.find((machine) => machine.cpu === results.machine.cpu && machine.os === os);
}

/**
 * Decides what an import writes. Pure: `runs` are loaded folders
 * ({ folder, results, summaryCsv }), `machines` is machines.json, and the
 * result is the new machines.json plus one data file per machine and benchmark.
 *
 * Without `options.machine` every run is matched by CPU and operating system.
 * With it, every run belongs to that machine: an existing id takes them (and
 * may get a new label or order), a new id is added with `options.label`.
 */
export function planImport(runs, machines, options = {}) {
  const registry = machines.map((machine) => ({ ...machine }));

  if (options.machine) {
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(options.machine)) {
      throw new Error(`--machine must be lowercase words joined by hyphens, got "${options.machine}"`);
    }
    const signatures = new Set(runs.map((run) => `${run.results.machine.cpu} (${osFamily(run.results.machine.os)})`));
    if (signatures.size > 1) {
      throw new Error(`--machine names one computer, but these runs come from ${[...signatures].join(", ")}`);
    }
    let entry = registry.find((machine) => machine.id === options.machine);
    if (!entry) {
      if (!options.label) throw new Error(`--label is required to add the new machine "${options.machine}"`);
      const first = runs[0].results.machine;
      entry = {
        id: options.machine,
        label: options.label,
        order: options.order ?? Math.max(0, ...registry.map((machine) => machine.order)) + 1,
        cpu: first.cpu,
        os: osFamily(first.os),
      };
      registry.push(entry);
    } else {
      if (options.label) entry.label = options.label;
      if (options.order !== undefined) entry.order = options.order;
    }
  }

  const unknown = new Set();
  const newest = new Map();
  const skipped = [];
  for (const run of runs) {
    const kind = benchmarkKind(run.results);
    const machine = options.machine ?? findMachine(registry, run.results)?.id;
    if (!machine) {
      unknown.add(`${run.results.machine.cpu} on ${run.results.machine.os} (${run.folder})`);
      continue;
    }
    const key = `${kind}/${machine}`;
    const current = newest.get(key);
    if (!current || run.results.startedAt > current.run.results.startedAt) {
      if (current) skipped.push(current.run.folder);
      newest.set(key, { kind, machine, run });
    } else {
      skipped.push(run.folder);
    }
  }
  if (unknown.size) {
    throw new Error(
      `No machine in data/benchmarks/machines.json matches:\n${[...unknown].map((line) => `  ${line}`).join("\n")}\n` +
        'Import each new computer once on its own with --machine <id> --label "<label>".',
    );
  }

  const files = [...newest.values()]
    .sort((a, b) => a.kind.localeCompare(b.kind) || a.machine.localeCompare(b.machine))
    .map(({ kind, machine, run }) => ({
      path: `${kind}/${machine}.json`,
      folder: run.folder,
      data: buildRun(kind, { results: run.results, summaryCsv: run.summaryCsv, machine }),
    }));
  registry.sort((a, b) => a.order - b.order || a.id.localeCompare(b.id));
  return { machines: registry, files, skipped };
}

/** A run folder, or every run folder directly inside a folder such as Results/. */
function findRunFolders(path) {
  if (existsSync(join(path, "results.json"))) return [path];
  const folders = readdirSync(path, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && existsSync(join(path, entry.name, "results.json")))
    .map((entry) => join(path, entry.name));
  if (!folders.length) throw new Error(`${path} has no results.json, and no folder in it has one`);
  return folders;
}

function loadRun(folder) {
  return {
    folder,
    results: JSON.parse(readFileSync(join(folder, "results.json"), "utf8")),
    summaryCsv: readFileSync(join(folder, "summary.csv"), "utf8"),
  };
}

function writeIfChanged(file, content) {
  const current = existsSync(file) ? readFileSync(file, "utf8") : null;
  if (current === content) return "unchanged";
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, content);
  return current === null ? "create" : "update";
}

function main() {
  const { values, positionals } = parseArgs({
    allowPositionals: true,
    options: {
      machine: { type: "string" },
      label: { type: "string" },
      order: { type: "string" },
    },
  });
  if (!positionals.length || ((values.label || values.order) && !values.machine)) {
    console.error(
      'Usage: npm run import:benchmarks -- <run folder | Results folder>... [--machine <id> [--label "<label>"] [--order <n>]]',
    );
    process.exit(1);
  }

  try {
    const runs = positionals.flatMap((path) => findRunFolders(resolve(path))).map(loadRun);
    const machines = existsSync(machinesFile) ? JSON.parse(readFileSync(machinesFile, "utf8")) : [];
    const plan = planImport(runs, machines, {
      machine: values.machine,
      label: values.label,
      order: values.order === undefined ? undefined : Number(values.order),
    });

    const repo = (file) => relative(root, file).replaceAll("\\", "/");
    const status = writeIfChanged(machinesFile, `${JSON.stringify(plan.machines, null, 2)}\n`);
    if (status !== "unchanged") console.log(`${status} ${repo(machinesFile)}`);
    for (const file of plan.files) {
      const target = resolve(dataDir, file.path);
      const data = file.data;
      const cases = data.kind === "compile" ? data.projects : data.apps;
      console.log(
        `${writeIfChanged(target, `${JSON.stringify(data, null, 2)}\n`)} ${repo(target)} ← ${basename(file.folder)}: ` +
          `${cases.length} ${data.kind === "compile" ? "projects" : "apps"} × ${data.languages.length} languages, ` +
          `${Object.keys(data.metrics).length} metrics` +
          (data.failures.length ? `, ${data.failures.length} failed cases` : ""),
      );
    }
    for (const folder of plan.skipped) console.log(`skip older ${basename(folder)}`);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}

if (process.argv[1] && import.meta.url.endsWith(basename(process.argv[1]))) main();
