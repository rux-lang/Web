import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { renderCliDocs } from "./cli-docs.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const contract = JSON.parse(readFileSync(resolve(root, "data/cli-reference.json"), "utf8"));
const packageJson = JSON.parse(readFileSync(resolve(root, "package.json"), "utf8"));
const failures = [];

if (contract.schemaVersion !== 1) failures.push("CLI snapshot schemaVersion must be 1");
if (contract.program?.name !== "rux") failures.push("CLI snapshot program must be rux");
if (contract.program?.version !== packageJson.version) {
  failures.push(`CLI snapshot version ${contract.program?.version} does not match website ${packageJson.version}`);
}
if (contract.commands?.length !== 23) failures.push(`Expected 23 commands, found ${contract.commands?.length ?? 0}`);
if ("buildDate" in (contract.program ?? {}) || "buildTime" in (contract.program ?? {})) {
  failures.push("CLI snapshot must not contain build timestamps");
}

for (const [relative, expected] of await renderCliDocs(contract)) {
  let actual;
  try {
    actual = readFileSync(resolve(root, relative), "utf8");
  } catch {
    failures.push(`Missing CLI Markdown page: ${relative}`);
    continue;
  }
  if (actual !== expected) failures.push(`${relative} has drifted from data/cli-reference.json`);
}

if (failures.length) {
  console.error(failures.map((failure) => `- ${failure}`).join("\n"));
  process.exit(1);
}
console.log(`Verified Rux ${contract.program.version} CLI contract across 25 Markdown pages`);
