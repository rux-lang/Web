import { execFileSync } from "node:child_process";
import { mkdirSync, renameSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { renderCliDocs } from "./cli-docs.mjs";
import { format } from "prettier";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const binary = process.argv[2];
if (!binary) {
  console.error("Usage: npm run sync:cli -- <path-to-rux>");
  process.exit(2);
}

let contract;
try {
  contract = JSON.parse(execFileSync(resolve(binary), ["help", "--json"], { encoding: "utf8" }));
} catch (error) {
  console.error(`Failed to read CLI contract: ${error.message}`);
  process.exit(1);
}
if (contract.schemaVersion !== 1 || contract.program?.name !== "rux" || contract.commands?.length !== 23) {
  console.error("The supplied binary did not return the expected Rux CLI schema version 1 contract");
  process.exit(1);
}

const snapshot = resolve(root, "data/cli-reference.json");
mkdirSync(dirname(snapshot), { recursive: true });
writeFileSync(`${snapshot}.tmp`, await format(JSON.stringify(contract), { parser: "json", printWidth: 120 }));
renameSync(`${snapshot}.tmp`, snapshot);
for (const [relative, markdown] of await renderCliDocs(contract)) {
  writeFileSync(resolve(root, relative), markdown);
}
console.log(`Synchronized Rux ${contract.program.version}: ${contract.commands.length} commands and CLI Markdown`);
