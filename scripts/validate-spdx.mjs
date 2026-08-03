import { readFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";

export function validateSpdxDocument(document) {
  const failures = [];
  if (document.spdxVersion !== "SPDX-2.3") failures.push("spdxVersion must be SPDX-2.3");
  if (typeof document.documentNamespace !== "string" || !document.documentNamespace) {
    failures.push("documentNamespace must be a non-empty string");
  }
  if (!Array.isArray(document.packages) || document.packages.length === 0) {
    failures.push("packages must contain at least one component");
  } else {
    for (const value of document.packages) {
      if (typeof value.name !== "string" || !value.name) {
        failures.push("every package must have a non-empty name");
        break;
      }
      if (typeof value.SPDXID !== "string" || !value.SPDXID.startsWith("SPDXRef-")) {
        failures.push("every package must have an SPDXRef identifier");
        break;
      }
    }
  }
  if (!Array.isArray(document.relationships)) failures.push("relationships must be an array");
  return failures;
}

export async function validateSpdxFile(path) {
  return validateSpdxDocument(JSON.parse(await readFile(path, "utf8")));
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const path = process.argv[2];
  if (!path) throw new Error("usage: validate-spdx.mjs SPDX_JSON");
  const failures = await validateSpdxFile(path);
  if (failures.length) {
    for (const failure of failures) console.error(`invalid release SBOM: ${failure}`);
    process.exitCode = 1;
  } else {
    console.log(`Verified SPDX 2.3 release SBOM ${path}`);
  }
}
