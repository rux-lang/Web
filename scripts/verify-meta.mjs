/**
 * Page metadata.
 *
 *   node scripts/verify-meta.mjs [distDir]
 *
 * Self-referential — every assertion is about the built output alone:
 *
 *   1. every page carries a canonical link, and it does not end in a slash
 *   2. every page carries a non-empty <title>
 *   3. a page that opts into a share image supplies the rest of the card
 *
 * Check 3 is the one worth having: og:title and og:description are emitted for
 * every page automatically, but og:image and og:url are not, and a card with an
 * image but no URL is half-configured in a way nothing else would flag.
 *
 * Missing `description` is reported as a count, not a failure — 64 section
 * index pages have never had one. Raise it to a failure once they do.
 */
import { readFileSync } from "node:fs";
import { walkFiles, routeFromHtmlPath } from "./lib/html.mjs";

const distDir = process.argv[2] ?? ".output/public";

function metaOf(html) {
  const out = {};
  for (const m of html.matchAll(/<meta\b([^>]*)>/gi)) {
    const attrs = {};
    for (const a of m[1].matchAll(/([a-zA-Z:_-]+)="([^"]*)"/g)) attrs[a[1]] = a[2];
    const key = attrs.property ?? attrs.name ?? attrs.itemprop;
    if (!key || attrs.content === undefined) continue;
    out[key] = attrs.content;
  }
  return out;
}

// Required once a page declares og:image — that is the explicit opt-in to a
// share card, and the rest of the card has to be there for it to render.
const OG_REQUIRED = ["og:title", "og:description", "og:type", "og:url"];

const FALLBACKS = new Set(["/404", "/200"]);

let pages = 0;
let withOg = 0;
let missingCanonical = 0;
let missingDescription = 0;
const problems = [];

for (const file of walkFiles(distDir, ".html")) {
  const route = routeFromHtmlPath(distDir, file);
  if (FALLBACKS.has(route)) continue;

  const html = readFileSync(file, "utf8");
  const meta = metaOf(html);
  const canonical = (html.match(/<link\b[^>]*rel="canonical"[^>]*href="([^"]*)"/i) ?? [undefined, null])[1];
  const title = (html.match(/<title[^>]*>([\s\S]*?)<\/title>/i) ?? [undefined, ""])[1].trim();
  pages++;

  if (!canonical) {
    missingCanonical++;
    problems.push(`NO CANONICAL  ${route}`);
  } else {
    // Compare the path, not the whole URL — the home page's canonical is
    // correctly `https://rux-lang.dev/`, whose path is a bare slash.
    const canonicalPath = canonical.startsWith("http") ? new URL(canonical).pathname : canonical;
    if (canonicalPath !== "/" && canonicalPath.endsWith("/")) {
      problems.push(`TRAILING /    ${route}  ${canonical}`);
    }
  }

  if (!title) problems.push(`NO TITLE      ${route}`);
  if (!meta.description) missingDescription++;

  if (meta["og:image"]) {
    withOg++;
    for (const key of OG_REQUIRED) {
      if (!meta[key]) problems.push(`PARTIAL OG    ${route}  missing ${key}`);
    }
  }
}

console.log(`pages checked           : ${pages}`);
console.log(`pages with a share card : ${withOg}`);
console.log(`pages missing canonical : ${missingCanonical}`);
console.log(`pages missing desc      : ${missingDescription}  (reported, not failed)`);
console.log(`problems                : ${problems.length}`);
for (const p of problems.slice(0, 30)) console.log("  " + p);
if (problems.length > 30) console.log(`  ... and ${problems.length - 30} more`);

console.log(problems.length ? "FAIL" : "PASS");
process.exit(problems.length ? 1 : 0);
