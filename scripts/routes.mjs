import { readdirSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const CONTENT = path.join(ROOT, "content");

function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...walk(full));
    else if (entry.endsWith(".md")) out.push(full);
  }
  return out;
}

/** Strip Nuxt Content ordering prefixes: "03.signed" -> "signed". */
function stripPrefix(segment) {
  return segment.replace(/^\d+\./, "");
}

/**
 * Every route the content tree should produce.
 *
 * Used as the nitro prerender seed instead of relying on `crawlLinks` alone.
 * Crawling only finds what something links to — the first Nuxt build of this
 * site crawled 5 pages out of 550, because the home page's links are raw HTML
 * that had not been ported yet. A deterministic seed makes a navigation
 * regression impossible to miss, and doubles as the gate 1 oracle.
 */
export function contentRoutes() {
  return (
    walk(CONTENT)
      .map((file) => {
        const rel = path.relative(CONTENT, file).split(path.sep).map(stripPrefix).join("/");
        const noExt = rel.replace(/\.md$/, "");
        if (noExt === "index") return "/";
        return "/" + noExt.replace(/\/index$/, "");
      })
      .filter((r) => !r.startsWith("/partials"))
      // Vue pages, not markdown. A static route outranks the [...slug]
      // catch-all, so these have no file under content/ to be derived from —
      // and this function is both the prerender seed and the verify:routes
      // oracle, so a page missing here is a page that never gets built.
      .concat(["/", "/blog", "/play"])
      .sort()
      .filter((r, i, a) => a.indexOf(r) === i)
  );
}

// Allow `node scripts/routes.mjs` for inspection.
if (process.argv[1] && import.meta.url.endsWith(path.basename(process.argv[1]))) {
  const routes = contentRoutes();
  console.log(routes.join("\n"));
  console.error(`${routes.length} routes`);
}
