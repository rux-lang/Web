/**
 * Markdown for language models.
 *
 *   node scripts/verify-llms.mjs <distDir>
 *
 * Checks what scripts/generate-llms.mjs wrote into the built site:
 *
 *   1. every /docs route from the content tree has its `<route>.md`
 *   2. every link in /llms.txt resolves to a file that was emitted
 *   3. no MDC syntax or component HTML survived the cleaner
 *   4. no table row holds a bare `|` inside a code span (it splits the cell)
 *   5. every document set exists, and /llms-small.txt stays within its budget
 *
 * Check 3 is the one the cleaner exists for: MDC's serializer writes any tag
 * it does not know back as `::name`, `:name{…}` or `{rel=…}`, which reads as
 * noise to an assistant and silently costs tokens on every page.
 */
import { existsSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

import { walkFiles } from "./lib/html.mjs";
import { contentRoutes } from "./routes.mjs";

const distDir = process.argv[2];

if (!distDir) {
  console.error("usage: node scripts/verify-llms.mjs <distDir>");
  process.exit(2);
}

const SITE = "https://rux-lang.dev";
const BOOKS = ["learn", "lang", "cli", "packaging", "api"];
const SETS = ["/llms.txt", "/llms-small.txt", "/llms-full.txt", ...BOOKS.map((book) => `/docs/${book}/llms-full.txt`)];
// About 300k tokens: the core file must fit an assistant's context with room to work.
const SMALL_BUDGET = 1_200_000;

const REMNANTS = [
  ["link attributes", /\]\([^)\s]*\)\{[^}]*\}/],
  ["`:br` line break", /:br\b/],
  ["block component", /^(?:>\s?)*\s*::[a-z]/m],
  ["inline component", /^(?:>\s?)*\s*:[a-z][a-z-]*\{/m],
  ["component HTML", /<\/?(?:note|tip|warning|caution|mistake|table|div|span|aside|u-[a-z-]+)[\s>]/],
];

const file = (route) => join(distDir, ...route.split("/").filter(Boolean));
const problems = [];

const routes = contentRoutes().filter((route) => route === "/docs" || route.startsWith("/docs/"));
const missingPages = routes.filter((route) => !existsSync(file(`${route}.md`)));
for (const route of missingPages) problems.push(`MISSING  ${route}.md`);

const missingSets = SETS.filter((set) => !existsSync(file(set)) || statSync(file(set)).size === 0);
for (const set of missingSets) problems.push(`MISSING  ${set}`);

const smallSize = existsSync(file("/llms-small.txt")) ? statSync(file("/llms-small.txt")).size : 0;
if (smallSize > SMALL_BUDGET) problems.push(`BUDGET   /llms-small.txt is ${smallSize} bytes, over ${SMALL_BUDGET}`);

let links = 0;
if (existsSync(file("/llms.txt"))) {
  const index = readFileSync(file("/llms.txt"), "utf8");
  if (index.includes("/raw/")) problems.push("STALE    /llms.txt still links to /raw/");
  for (const [, url] of index.matchAll(/\]\((https:\/\/rux-lang\.dev[^)\s]*)\)/g)) {
    links++;
    const route = url.slice(SITE.length);
    if (!existsSync(file(route))) problems.push(`BROKEN   ${url} in /llms.txt`);
  }
}

const outputs = [
  ...walkFiles(join(distDir, "docs"), ".md"),
  ...(existsSync(file("/docs.md")) ? [file("/docs.md")] : []),
  ...SETS.filter((set) => existsSync(file(set))).map(file),
];
let remnants = 0;
let pipeRows = 0;
for (const path of outputs) {
  const text = readFileSync(path, "utf8");
  for (const [name, pattern] of REMNANTS) {
    const match = text.match(pattern);
    if (!match) continue;
    remnants++;
    if (remnants <= 20) problems.push(`MDC      ${name} in ${path}: ${JSON.stringify(match[0].slice(0, 60))}`);
  }
  let fence = false;
  for (const line of text.split("\n")) {
    if (/^(?:>\s?)*\s*(?:```|~~~)/.test(line)) {
      fence = !fence;
      continue;
    }
    if (fence || !/^(?:>\s?)*\s*\|/.test(line)) continue;
    if (bareCodePipe(line)) {
      pipeRows++;
      if (pipeRows <= 20) problems.push(`PIPE     ${path}: ${line.slice(0, 80)}`);
    }
  }
}

/** Whether a table row holds an unescaped `|` inside a code span. */
function bareCodePipe(line) {
  let open = 0;
  for (let i = 0; i < line.length; i++) {
    if (line[i] === "\\") {
      i++;
      continue;
    }
    if (line[i] === "`") {
      let run = 0;
      while (line[i + run] === "`") run++;
      if (open === 0) open = run;
      else if (run === open) open = 0;
      i += run - 1;
      continue;
    }
    if (open && line[i] === "|") return true;
  }
  return false;
}

console.log(`docs routes      : ${routes.length}`);
console.log(`page .md missing : ${missingPages.length}`);
console.log(`sets missing     : ${missingSets.length}`);
console.log(`llms.txt links   : ${links}`);
console.log(`files scanned    : ${outputs.length}`);
console.log(`MDC remnants     : ${remnants}`);
console.log(`bare code pipes  : ${pipeRows}`);
console.log(`llms-small.txt   : ${smallSize} bytes (budget ${SMALL_BUDGET})`);
for (const problem of problems) console.log(`  ${problem}`);

const ok = problems.length === 0;
console.log(ok ? "PASS" : "FAIL");
process.exit(ok ? 0 : 1);
