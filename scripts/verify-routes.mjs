/**
 * Content coverage.
 *
 *   node scripts/verify-routes.mjs <distDir>
 *
 * Self-referential: the built output is checked against the content tree it was
 * generated from, so adding or removing pages needs no bookkeeping here.
 *
 *   1. every Markdown file under content/ produced a route
 *   2. no route leaked a numeric ordering prefix (e.g. /docs/03.signed/...)
 *
 * Check 1 is the one that matters. Nitro only prerenders what it is told about
 * or can crawl to, so a page nobody links to yet can sit on disk and never
 * reach the build — a silent omission no broken link would reveal.
 */
import { walkFiles, routeFromHtmlPath, normalizeRoute } from "./lib/html.mjs";
import { contentRoutes } from "./routes.mjs";

const distDir = process.argv[2];

if (!distDir) {
  console.error("usage: node scripts/verify-routes.mjs <distDir>");
  process.exit(2);
}

// Host fallbacks, not site content.
const FALLBACKS = new Set(["/404", "/200"]);

const actual = new Set(
  walkFiles(distDir, ".html")
    .map((f) => routeFromHtmlPath(distDir, f))
    .filter((r) => !FALLBACKS.has(r))
    .map(normalizeRoute),
);

const expected = new Set(contentRoutes().map(normalizeRoute));

const missing = [...expected].filter((r) => !actual.has(r)).sort();
const leaked = [...actual].filter((r) => /\/\d{1,2}\.[^/]/.test(r)).sort();

console.log(`content routes  : ${expected.size}`);
console.log(`built routes    : ${actual.size}`);
console.log(`not built       : ${missing.length}`);
console.log(`prefix leakage  : ${leaked.length}`);

for (const r of missing) console.log(`  MISSING  ${r}`);
for (const r of leaked) console.log(`  LEAKED   ${r}`);

const ok = !missing.length && !leaked.length;
console.log(ok ? "PASS" : "FAIL");
process.exit(ok ? 0 : 1);
