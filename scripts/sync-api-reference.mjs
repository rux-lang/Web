/**
 * npm run sync:api -- <path-to-Rux> [--package Allocator] [--from <dir>] [--check]
 *
 * Takes a `rux doc --format json` snapshot of each requested package, copies it
 * and the package README into data/api/, and regenerates the package's pages
 * under content/docs/5.api/<folder>/ through scripts/api-docs.mjs. Without
 * `--package` it syncs every package in GENERATED.
 *
 * Without `--from`, it runs `<rux>/Bin/rux doc --format json` at the root of
 * the Rux workspace; `--from` reads `<Name>.json` files a previous run wrote.
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
import { API_ROOT, GENERATED, PACKAGES } from "./api-packages.mjs";
import { renderApiPackage } from "./api-docs.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const usage = "Usage: npm run sync:api -- <path-to-Rux> [--package <Name>]… [--from <dir-of-json>] [--check]";

function parseArguments(argv) {
  const options = { rux: null, packages: [], from: null, check: false };
  for (let index = 0; index < argv.length; index++) {
    const argument = argv[index];
    if (argument === "--check") options.check = true;
    else if (argument === "--package") options.packages.push(...(argv[++index] ?? "").split(",").filter(Boolean));
    else if (argument === "--from") options.from = argv[++index];
    else if (argument.startsWith("--")) throw new Error(`Unknown option ${argument}`);
    else if (!options.rux) options.rux = argument;
    else throw new Error(`Unexpected argument ${argument}`);
  }
  if (!options.rux || options.from === undefined) throw new Error(usage);
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
  if (!GENERATED.has(entry.slug)) {
    console.error(`${entry.name} is not in GENERATED; add "${entry.slug}" to it in scripts/api-packages.mjs first`);
    process.exit(2);
  }
  entries.push(entry);
}

let source = options.from && resolve(options.from);
let scratch = null;
if (!source) {
  const binary = join(rux, "Bin", process.platform === "win32" ? "rux.exe" : "rux");
  scratch = mkdtempSync(join(tmpdir(), "rux-api-"));
  source = join(scratch, "json");
  try {
    execFileSync(binary, ["doc", "--format", "json", "--output", source], { cwd: rux, stdio: "inherit" });
  } catch (error) {
    console.error(`rux doc --format json failed: ${error.message}`);
    rmSync(scratch, { recursive: true, force: true });
    process.exit(1);
  }
}

const drift = [];
const writes = new Map();
const deletes = [];
try {
  for (const entry of entries) {
    const jsonFile = join(source, `${entry.name}.json`);
    if (!existsSync(jsonFile)) throw new Error(`No snapshot for ${entry.name}: ${jsonFile} does not exist`);
    const snapshot = JSON.parse(readFileSync(jsonFile, "utf8"));
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
    for (const file of listFiles(resolve(root, API_ROOT, entry.folder))) {
      if (!writes.has(file)) deletes.push(file);
    }
    console.log(`${entry.name} ${snapshot.package.version}: ${snapshot.items.length} items, ${pages.size} files`);
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
  for (const entry of entries) removeEmptyDirectories(resolve(root, API_ROOT, entry.folder));
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
