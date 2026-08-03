/**
 * Inline the home page's Rux samples into an MDC partial.
 *
 *   node scripts/sync-examples.mjs [--check]
 *
 * VitePress had `<<< @/examples/Hello.rux`, which Nuxt Content has no
 * equivalent for. Rather than importing the files at runtime (which would lose
 * build-time Shiki highlighting), generate a partial containing real fenced
 * blocks. The .rux files stay the single source of truth — they are still used
 * by /start/examples and by Playground.vue when it is restored.
 *
 * --check fails if the generated partial has drifted from the sources, which
 * replaces the freshness guarantee `<<<` gave for free.
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import path from "node:path";

const check = process.argv.includes("--check");

const SRC_DIR = "app/assets/examples";
const OUT = "content/partials/home-examples.md";

// Display order on the home page.
const EXAMPLES = [
  "Hello.rux",
  "Greet.rux",
  "Factorial.rux",
  "Func.rux",
  "Variadic.rux",
  "Struct.rux",
  "Mut.rux",
  "Pointer.rux",
  "Interface.rux",
  "Import.rux",
];

const parts = ["::code-group", ""];

for (const name of EXAMPLES) {
  const file = path.join(SRC_DIR, name);
  if (!existsSync(file)) {
    console.error(`ERROR: missing example ${file}`);
    process.exit(1);
  }
  const code = readFileSync(file, "utf8").replace(/\s+$/, "");
  parts.push("```rux [" + name + "]", code, "```", "");
}

parts.push("::", "");
const generated = parts.join("\n");

if (check) {
  const current = existsSync(OUT) ? readFileSync(OUT, "utf8") : "";
  if (current !== generated) {
    console.error(`FAIL: ${OUT} is out of date with ${SRC_DIR}/ — run: node scripts/sync-examples.mjs`);
    process.exit(1);
  }
  console.log(`PASS: ${OUT} matches ${EXAMPLES.length} source files`);
  process.exit(0);
}

mkdirSync(path.dirname(OUT), { recursive: true });
writeFileSync(OUT, generated);
console.log(`wrote ${OUT} (${EXAMPLES.length} examples)`);
