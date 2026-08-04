/**
 * Anchor-aware internal link checker.
 *
 *   node scripts/verify-links.mjs <distDir> [--out file]
 *
 * Three assertions, all self-referential — the site is checked against itself,
 * so no external reference data is needed:
 *   1. every internal href resolves to a route the build actually emitted
 *   2. every #fragment matches an id present in the target document
 *   3. every internal href that names a file resolves to a file in the output
 *
 * The site currently has zero broken links, so any failure is a regression.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import {
  walkFiles,
  routeFromHtmlPath,
  browserUrlFromHtmlPath,
  extractIds,
  extractHrefs,
  resolveHref,
} from "./lib/html.mjs";

const args = process.argv.slice(2);
const distDir = args[0];
const outFile = valueOf("--out");

function valueOf(flag) {
  const i = args.indexOf(flag);
  return i === -1 ? null : args[i + 1];
}

if (!distDir) {
  console.error("usage: node scripts/verify-links.mjs <distDir> [--out file]");
  process.exit(2);
}

// A trailing extension on the last segment marks a file rather than a route.
// `.html` is excluded: those ARE routes, just spelled with the extension.
const isAsset = (route) => /\.[a-z0-9]{2,5}$/i.test(route) && !route.endsWith(".html");

const files = walkFiles(distDir, ".html");

// Pass 1 — build the route -> ids index.
const idsByRoute = new Map();
const pages = [];

for (const file of files) {
  const html = readFileSync(file, "utf8");
  const route = routeFromHtmlPath(distDir, file);
  const baseUrl = browserUrlFromHtmlPath(distDir, file);
  idsByRoute.set(route, extractIds(html));
  pages.push({ file, route, baseUrl, html });
}

// Pass 2 — resolve and check every internal link.
const failures = [];
let checked = 0;

for (const page of pages) {
  for (const href of extractHrefs(page.html)) {
    const resolved = resolveHref(href, page.baseUrl);
    if (!resolved) continue; // external
    checked++;

    const { route, fragment } = resolved;

    // Not every internal href is a page. /design-kit links straight at the logo
    // files in public/assets/, and those never produce an .html so they are
    // absent from idsByRoute. Check them against the emitted file instead —
    // a download button pointing at a missing asset still fails.
    if (isAsset(route)) {
      if (!existsSync(path.join(distDir, route))) {
        failures.push({ from: page.route, href, kind: "MISSING_ASSET", target: route });
      }
      continue;
    }

    if (!idsByRoute.has(route)) {
      failures.push({
        from: page.route,
        href,
        kind: "MISSING_PAGE",
        target: route,
      });
      continue;
    }
    if (fragment && !idsByRoute.get(route).has(fragment)) {
      failures.push({
        from: page.route,
        href,
        kind: "MISSING_ANCHOR",
        target: `${route}#${fragment}`,
      });
    }
  }
}

// Deduplicate: the same broken link repeated across pages is one defect.
// The comparison key is (kind, target, from) and deliberately EXCLUDES the raw
// href — the same defect reached by two different link forms is one problem,
// not two.
const key = (f) => `${f.kind}\t${f.target}\t<- ${f.from}`;
const unique = [...new Map(failures.map((f) => [key(f), f])).values()];
unique.sort((a, b) => key(a).localeCompare(key(b)));

const lines = unique.map(key);

console.log(`pages           : ${pages.length}`);
console.log(`internal links  : ${checked}`);
console.log(`failures        : ${unique.length}`);
console.log(`  MISSING_PAGE  : ${unique.filter((f) => f.kind === "MISSING_PAGE").length}`);
console.log(`  MISSING_ANCHOR: ${unique.filter((f) => f.kind === "MISSING_ANCHOR").length}`);
console.log(`  MISSING_ASSET : ${unique.filter((f) => f.kind === "MISSING_ASSET").length}`);

if (outFile) {
  mkdirSync(path.dirname(outFile), { recursive: true });
  writeFileSync(outFile, lines.join("\n") + (lines.length ? "\n" : ""));
  console.log(`-> ${outFile}`);
}

for (const l of lines) console.log("  " + l);

console.log(unique.length ? "FAIL" : "PASS");
process.exit(unique.length ? 1 : 0);
