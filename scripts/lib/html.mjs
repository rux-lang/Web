import { readdirSync, statSync } from "node:fs";
import path from "node:path";

/** Recursively list files under `dir` matching `ext` (e.g. '.html'). */
export function walkFiles(dir, ext) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...walkFiles(full, ext));
    else if (!ext || entry.endsWith(ext)) out.push(full);
  }
  return out;
}

/**
 * Map a generated .html file to the route it serves.
 *   dist/index.html          -> /
 *   dist/docs/index.html     -> /docs
 *   dist/docs/intro.html     -> /docs/intro
 * Trailing slashes are never emitted; `/` is the sole exception.
 */
export function routeFromHtmlPath(distDir, file) {
  let rel = path.relative(distDir, file).split(path.sep).join("/");
  rel = rel.replace(/\.html$/, "");
  if (rel === "index") return "/";
  rel = rel.replace(/\/index$/, "");
  return "/" + rel;
}

/** Every `id="..."` in the document — the set an in-page #fragment may target. */
export function extractIds(html) {
  const ids = new Set();
  for (const m of html.matchAll(/\sid="([^"]*)"/g)) {
    if (m[1]) ids.add(m[1]);
  }
  return ids;
}

/** Every `<a href="...">` in the document, in source order. */
export function extractHrefs(html) {
  const hrefs = [];
  for (const m of html.matchAll(/<a\b[^>]*?\shref="([^"]*)"/gi)) {
    hrefs.push(m[1]);
  }
  return hrefs;
}

/** True for links that point outside the site and are not our problem. */
export function isExternal(href) {
  return /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(href);
}

/** Strip a trailing slash, but never turn '/' into ''. */
export function normalizeRoute(route) {
  const stripped = route.replace(/\/+$/, "");
  return stripped === "" ? "/" : stripped;
}

/**
 * The URL a browser would be at when viewing this file — which is what
 * relative hrefs resolve against. Differs from the normalized route:
 *   dist/api/bsd/index.html -> /api/bsd/      (directory index)
 *   dist/api/bsd/read.html  -> /api/bsd/read  (leaf; relatives resolve to /api/bsd/)
 */
export function browserUrlFromHtmlPath(distDir, file) {
  const rel = path.relative(distDir, file).split(path.sep).join("/");
  if (rel === "index.html") return "/";
  if (rel.endsWith("/index.html")) return "/" + rel.slice(0, -"index.html".length);
  return "/" + rel.replace(/\.html$/, "");
}

/**
 * Resolve an href into { route, fragment } using real browser semantics.
 * `baseUrl` must come from browserUrlFromHtmlPath, not from the route.
 * Returns null for external links.
 */
export function resolveHref(href, baseUrl) {
  if (isExternal(href)) return null;

  const hashAt = href.indexOf("#");
  let pathPart = hashAt === -1 ? href : href.slice(0, hashAt);
  const fragment = hashAt === -1 ? "" : href.slice(hashAt + 1);

  pathPart = pathPart.split("?")[0];

  // Empty path => in-page anchor, stay on the current document.
  const resolved = pathPart === "" ? baseUrl : new URL(pathPart, "https://x" + baseUrl).pathname;

  return {
    route: normalizeRoute(decodeURIComponent(resolved)),
    fragment: decodeURIComponent(fragment),
  };
}
