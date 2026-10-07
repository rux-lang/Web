/**
 * The packages whose API Reference is generated: exactly those with a
 * snapshot in data/api/ (`<slug>.json`, written by sync:api). Node-only, so it
 * lives apart from scripts/api-packages.mjs, which the app imports too; the
 * app derives the same set with import.meta.glob in app/utils/api-catalog.ts.
 */
import { existsSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";

export const API_DATA = fileURLToPath(new URL("../data/api/", import.meta.url));

export const GENERATED = new Set(
  existsSync(API_DATA)
    ? readdirSync(API_DATA)
        .filter((file) => /^[a-z0-9]+\.json$/.test(file))
        .map((file) => file.slice(0, -".json".length))
    : [],
);
