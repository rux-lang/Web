import { readdir, stat, unlink, writeFile } from "node:fs/promises";
import { join } from "node:path";

export const SITEMAP_PAGE_LIMIT = 1_000;
export const SITEMAP_URL_LIMIT = 50_000;
export const SITEMAP_BYTE_LIMIT = 50_000_000;

const XML_HEADER = '<?xml version="1.0" encoding="UTF-8"?>\n';
const URLSET_OPEN = '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
const URLSET_CLOSE = "</urlset>\n";
const INDEX_OPEN = '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
const INDEX_CLOSE = "</sitemapindex>\n";

export function exactHttpOrigin(name, value) {
  if (!value) throw new Error(`${name} is required`);

  let url;
  try {
    url = new URL(value);
  } catch {
    throw new Error(`${name} must be an absolute HTTP or HTTPS origin`);
  }

  if (
    !["http:", "https:"].includes(url.protocol) ||
    url.username ||
    url.password ||
    url.pathname !== "/" ||
    url.search ||
    url.hash
  ) {
    throw new Error(`${name} must be an HTTP or HTTPS origin without credentials, path, query, or fragment`);
  }

  return url.origin;
}

function sitemapDocument(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error("sitemap response must be an object");
  }
  if (!Array.isArray(value.data)) {
    throw new Error("sitemap response data must be an array");
  }
  if (!value.meta || typeof value.meta !== "object" || Array.isArray(value.meta)) {
    throw new Error("sitemap response meta must be an object");
  }

  const nextCursor = value.meta.next_cursor;
  if (nextCursor !== null && typeof nextCursor !== "string") {
    throw new Error("sitemap response next_cursor must be a string or null");
  }
  if (nextCursor === "") {
    throw new Error("sitemap response next_cursor must not be empty");
  }

  return { data: value.data, nextCursor };
}

function requiredString(entry, field) {
  const value = entry[field];
  if (typeof value !== "string" || value === "") {
    throw new Error(`sitemap entry ${field} must be a non-empty string`);
  }
  return value;
}

function normalizedIdentity(entry, field) {
  const value = requiredString(entry, field);
  if (value.length > 64 || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)) {
    throw new Error(`sitemap entry ${field} must be a normalized registry identity`);
  }
  return value;
}

function sitemapEntry(entry) {
  if (!entry || typeof entry !== "object" || Array.isArray(entry)) {
    throw new Error("sitemap entry must be an object");
  }

  const kind = requiredString(entry, "kind");
  const lastmod = requiredString(entry, "last_modified");
  if (Number.isNaN(Date.parse(lastmod))) {
    throw new Error("sitemap entry last_modified must be an ISO 8601 timestamp");
  }

  if (kind === "keyword") {
    return {
      path: `/packages/-/keywords/${normalizedIdentity(entry, "normalized_keyword")}`,
      lastmod,
    };
  }
  if (kind === "namespace") {
    return {
      path: `/packages/-/namespaces/${normalizedIdentity(entry, "normalized_namespace")}`,
      lastmod,
    };
  }
  if (kind === "package") {
    const namespace = normalizedIdentity(entry, "normalized_namespace");
    const packageName = normalizedIdentity(entry, "normalized_package");
    return { path: `/packages/${namespace}/${packageName}`, lastmod };
  }

  throw new Error(`unsupported sitemap entry kind: ${kind}`);
}

export async function fetchSitemapEntries(apiBaseUrl, fetchImpl = fetch) {
  const origin = exactHttpOrigin("RUX_SITEMAP_API_BASE_URL", apiBaseUrl);
  const entries = [];
  const seenCursors = new Set();
  let cursor = null;

  do {
    const url = new URL("/v1/sitemap", origin);
    url.searchParams.set("limit", String(SITEMAP_PAGE_LIMIT));
    if (cursor) url.searchParams.set("cursor", cursor);

    const response = await fetchImpl(url, {
      headers: { accept: "application/json" },
    });
    if (!response.ok) {
      throw new Error(`sitemap source returned HTTP ${response.status}`);
    }

    let body;
    try {
      body = await response.json();
    } catch {
      throw new Error("sitemap source did not return valid JSON");
    }

    const document = sitemapDocument(body);
    entries.push(...document.data.map(sitemapEntry));
    cursor = document.nextCursor;

    if (cursor) {
      if (seenCursors.has(cursor)) {
        throw new Error("sitemap source repeated a cursor");
      }
      seenCursors.add(cursor);
    }
  } while (cursor);

  return entries;
}

export async function sitemapEntriesForBuild(apiBaseUrl, fetchImpl = fetch) {
  return fetchSitemapEntries(apiBaseUrl, fetchImpl);
}

function xmlEscape(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function urlFragment(entry) {
  const lastmod = entry.lastmod ? `<lastmod>${xmlEscape(entry.lastmod)}</lastmod>` : "";
  return `  <url><loc>${xmlEscape(entry.loc)}</loc>${lastmod}</url>\n`;
}

function sitemapXml(fragments) {
  return `${XML_HEADER}${URLSET_OPEN}${fragments.join("")}${URLSET_CLOSE}`;
}

export function buildSitemapFiles(siteOrigin, sourceEntries) {
  const origin = exactHttpOrigin("RUX_SITE_ORIGIN", siteOrigin);
  const unique = new Map([
    ["/", { path: "/" }],
    ["/packages/-/keywords", { path: "/packages/-/keywords" }],
    ["/packages", { path: "/packages" }],
  ]);

  for (const entry of sourceEntries) {
    if (!entry || typeof entry.path !== "string" || !entry.path.startsWith("/")) {
      throw new Error("sitemap source entry path must be root-relative");
    }
    unique.set(entry.path, entry);
  }

  const entries = [...unique.values()]
    .map((entry) => ({
      loc: new URL(entry.path, `${origin}/`).toString(),
      ...(entry.lastmod ? { lastmod: entry.lastmod } : {}),
    }))
    .sort((left, right) => (left.loc < right.loc ? -1 : left.loc > right.loc ? 1 : 0));

  const chunks = [];
  let fragments = [];
  let byteLength = Buffer.byteLength(`${XML_HEADER}${URLSET_OPEN}${URLSET_CLOSE}`);

  for (const entry of entries) {
    const fragment = urlFragment(entry);
    const fragmentBytes = Buffer.byteLength(fragment);
    if (fragmentBytes + Buffer.byteLength(`${XML_HEADER}${URLSET_OPEN}${URLSET_CLOSE}`) > SITEMAP_BYTE_LIMIT) {
      throw new Error(`sitemap URL exceeds the ${SITEMAP_BYTE_LIMIT}-byte file limit`);
    }

    if (
      fragments.length > 0 &&
      (fragments.length >= SITEMAP_URL_LIMIT || byteLength + fragmentBytes > SITEMAP_BYTE_LIMIT)
    ) {
      chunks.push(sitemapXml(fragments));
      fragments = [];
      byteLength = Buffer.byteLength(`${XML_HEADER}${URLSET_OPEN}${URLSET_CLOSE}`);
    }

    fragments.push(fragment);
    byteLength += fragmentBytes;
  }
  chunks.push(sitemapXml(fragments));

  const parts = chunks.map((contents, index) => ({
    name: `sitemap-${index + 1}.xml`,
    contents,
  }));
  const indexEntries = parts
    .map((part) => `  <sitemap><loc>${xmlEscape(new URL(`/${part.name}`, `${origin}/`).toString())}</loc></sitemap>\n`)
    .join("");

  return {
    index: `${XML_HEADER}${INDEX_OPEN}${indexEntries}${INDEX_CLOSE}`,
    parts,
  };
}

export async function writeSitemapFiles(outputDirectory, files) {
  const output = await stat(outputDirectory).catch(() => null);
  if (!output?.isDirectory()) {
    throw new Error(`Nuxt public output directory does not exist: ${outputDirectory}`);
  }

  const existing = await readdir(outputDirectory);
  await Promise.all(
    existing.filter((name) => /^sitemap-\d+\.xml$/.test(name)).map((name) => unlink(join(outputDirectory, name))),
  );

  await Promise.all(files.parts.map((part) => writeFile(join(outputDirectory, part.name), part.contents, "utf8")));
  await writeFile(join(outputDirectory, "sitemap.xml"), files.index, "utf8");
}
