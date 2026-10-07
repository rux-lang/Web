/**
 * npm run sync:api -- <path-to-Rux> [--package Allocator] [--target <triple>] [--from <dir>] [--check]
 *
 * Takes a `rux doc --format json` snapshot of each requested package for every
 * target, merges them into one (scripts/api-docs.mjs, mergeSnapshots), copies
 * it and the package README into data/api/, and regenerates the package's
 * pages under content/docs/5.api/<folder>/. Without `--package` it syncs every
 * package that already has a snapshot. Syncing a package for the first time
 * makes it generated, and removes a hand-written 0.3 folder at the same URL
 * (`10.core` for Core, whose folder is now `01.core`).
 *
 * Snapshots are taken for TARGETS, or for the `--target` triples given. A
 * platform package (the registry's `platform`, such as Linux) is documented
 * only for its own operating system's targets. Without `--from`, it runs
 * `<rux>/Bin/rux doc --format json --target <t>` once per target at the root
 * of the Rux workspace; `--from` reads a previous run instead, either one
 * `<dir>/<target>/<Name>.json` per target or a single `<dir>/<Name>.json`.
 * The README always comes from `<rux>/Packages/<Name>/README.md`, so verify
 * can re-render later without a Rux checkout. `--check` writes nothing and
 * exits 1 when anything would change.
 */
import { execFileSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  rmdirSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { format } from "prettier";
import { GENERATED } from "./api-generated.mjs";
import { API_ROOT, PACKAGES } from "./api-packages.mjs";
import { TARGETS, mergeSnapshots, renderApiPackage, targetOs } from "./api-docs.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const usage =
  "Usage: npm run sync:api -- <path-to-Rux> [--package <Name>]… [--target <triple>]… [--from <dir>] [--check]";

function parseArguments(argv) {
  const options = { rux: null, packages: [], targets: [], from: null, check: false };
  const list = (value) => (value ?? "").split(",").filter(Boolean);
  for (let index = 0; index < argv.length; index++) {
    const argument = argv[index];
    if (argument === "--check") options.check = true;
    else if (argument === "--package") options.packages.push(...list(argv[++index]));
    else if (argument === "--target") options.targets.push(...list(argv[++index]));
    else if (argument === "--from") options.from = argv[++index];
    else if (argument.startsWith("--")) throw new Error(`Unknown option ${argument}`);
    else if (!options.rux) options.rux = argument;
    else throw new Error(`Unexpected argument ${argument}`);
  }
  if (!options.rux || options.from === undefined) throw new Error(usage);
  for (const target of options.targets) {
    if (!TARGETS.includes(target)) throw new Error(`Unknown target ${target}; expected one of ${TARGETS.join(", ")}`);
  }
  return options;
}

function listFiles(directory) {
  if (!existsSync(directory)) return [];
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const full = join(directory, entry.name);
    return entry.isDirectory() ? listFiles(full) : [full];
  });
}

function removeEmptyDirectories(directory) {
  if (!existsSync(directory)) return;
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (entry.isDirectory()) removeEmptyDirectories(join(directory, entry.name));
  }
  if (!readdirSync(directory).length) rmdirSync(directory);
}

const toRepo = (file) => relative(root, file).split("\\").join("/");

/**
 * Every folder that serves the package's URL: its own, and a 0.3-era one
 * under another number (`10.core` beside `01.core`), whose files are stale.
 */
const packageFolders = (entry) =>
  readdirSync(resolve(root, API_ROOT), { withFileTypes: true })
    .filter((folder) => folder.isDirectory() && folder.name.replace(/^\d+\./, "") === entry.slug)
    .map((folder) => resolve(root, API_ROOT, folder.name));

/** The targets a package is documented for: its own OS's for a platform package, every requested one otherwise. */
const targetsFor = (entry, targets) =>
  entry.platform ? targets.filter((target) => targetOs(target) === entry.platform.toLowerCase()) : targets;

let options;
try {
  options = parseArguments(process.argv.slice(2));
} catch (error) {
  console.error(error.message);
  process.exit(2);
}

const rux = resolve(options.rux);
const requested = options.packages.length
  ? options.packages
  : PACKAGES.filter((entry) => GENERATED.has(entry.slug)).map((entry) => entry.name);
const entries = [];
for (const name of requested) {
  const entry = PACKAGES.find((candidate) => candidate.name === name || candidate.slug === name.toLowerCase());
  if (!entry) {
    console.error(`${name} is not in the API registry (scripts/api-packages.mjs)`);
    process.exit(2);
  }
  entries.push(entry);
}
const targets = options.targets.length ? TARGETS.filter((target) => options.targets.includes(target)) : TARGETS;
const needed = TARGETS.filter((target) => entries.some((entry) => targetsFor(entry, targets).includes(target)));

// Where each target's snapshots are: target → directory, or null when that target's run failed.
const sources = new Map();
let single = null;
let scratch = null;
if (options.from) {
  const from = resolve(options.from);
  const perTarget = TARGETS.filter((target) => existsSync(join(from, target)));
  if (perTarget.length)
    for (const target of needed) sources.set(target, perTarget.includes(target) ? join(from, target) : null);
  else single = from;
} else {
  const binary = join(rux, "Bin", process.platform === "win32" ? "rux.exe" : "rux");
  scratch = mkdtempSync(join(tmpdir(), "rux-api-"));
  for (const target of needed) {
    const output = join(scratch, target);
    try {
      execFileSync(binary, ["doc", "--format", "json", "--target", target, "--output", output], {
        cwd: rux,
        stdio: ["ignore", "ignore", "pipe"],
      });
      sources.set(target, output);
    } catch (error) {
      console.warn(`warning: rux doc --target ${target} failed: ${String(error.stderr ?? error.message).trim()}`);
      sources.set(target, null);
    }
  }
}

/**
 * The per-target snapshots of one package. A target may be missing only when
 * the package's dependencies are gated away from that target's OS (a
 * dependency whose `TargetOS` leaves it out); anything else is an error.
 */
function snapshotsOf(entry) {
  if (single) {
    const file = join(single, `${entry.name}.json`);
    if (!existsSync(file)) throw new Error(`No snapshot for ${entry.name}: ${file} does not exist`);
    return [JSON.parse(readFileSync(file, "utf8"))];
  }
  const found = [];
  const missing = [];
  for (const target of targetsFor(entry, targets)) {
    const file = sources.get(target) && join(sources.get(target), `${entry.name}.json`);
    if (file && existsSync(file)) found.push(JSON.parse(readFileSync(file, "utf8")));
    else missing.push(target);
  }
  if (!found.length)
    throw new Error(`No snapshot of ${entry.name} for any of ${targetsFor(entry, targets).join(", ")}`);
  const gated = (target) =>
    found[0].package.dependencies.some(
      (dependency) =>
        dependency.targetOS?.length &&
        !dependency.targetOS.some((os) => os.toLowerCase() === targetOs(target).toLowerCase()),
    );
  for (const target of missing) {
    if (!gated(target)) throw new Error(`No snapshot of ${entry.name} for ${target}`);
    console.warn(`warning: ${entry.name} has no snapshot for ${target}; its dependencies leave that target out`);
  }
  return found;
}

const drift = [];
const writes = new Map();
const deletes = [];
try {
  for (const entry of entries) {
    const snapshot = mergeSnapshots(snapshotsOf(entry));
    const readmeFile = join(rux, "Packages", entry.name, "README.md");
    const readme = existsSync(readmeFile)
      ? await format(readFileSync(readmeFile, "utf8"), { parser: "markdown", printWidth: 120 })
      : null;

    const snapshotPath = resolve(root, `data/api/${entry.slug}.json`);
    const readmePath = resolve(root, `data/api/${entry.slug}.readme.md`);
    writes.set(snapshotPath, await format(JSON.stringify(snapshot), { parser: "json", printWidth: 120 }));
    if (readme) writes.set(readmePath, readme);
    else if (existsSync(readmePath)) deletes.push(readmePath);

    const pages = await renderApiPackage(snapshot, readme, entry);
    for (const [path, text] of pages) writes.set(resolve(root, path), text);
    for (const folder of packageFolders(entry)) {
      for (const file of listFiles(folder)) if (!writes.has(file)) deletes.push(file);
    }
    console.log(
      `${entry.name} ${snapshot.package.version}: ${snapshot.items.length} items for ${snapshot.targets.join(", ")}, ${pages.size} files`,
    );
  }
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
} finally {
  if (scratch) rmSync(scratch, { recursive: true, force: true });
}
if (process.exitCode) process.exit();

for (const [file, text] of writes) {
  const current = existsSync(file) ? readFileSync(file, "utf8") : null;
  if (current === text) continue;
  drift.push(`${current === null ? "create" : "update"} ${toRepo(file)}`);
  if (!options.check) {
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, text);
  }
}
for (const file of deletes) {
  drift.push(`delete ${toRepo(file)}`);
  if (!options.check) rmSync(file);
}
if (!options.check) {
  for (const entry of entries) for (const folder of packageFolders(entry)) removeEmptyDirectories(folder);
}

if (options.check) {
  if (drift.length) {
    console.error(`The API Reference has drifted from the snapshots:\n${drift.map((line) => `- ${line}`).join("\n")}`);
    process.exit(1);
  }
  console.log("The API Reference matches the snapshots");
} else {
  console.log(drift.length ? drift.map((line) => `- ${line}`).join("\n") : "Nothing changed");
}
