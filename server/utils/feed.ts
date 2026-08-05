/**
 * RSS 2.0 serializer for the blog feed.
 *
 * Hand-rolled rather than pulled from the `feed` package: the site needs one
 * channel with five entries and no Atom/JSON variants, and a dependency that
 * ships its own XML builder is more supply-chain surface than the ~40 lines
 * below (every dependency here goes through `supply-chain:licenses`).
 *
 * Kept free of nitro imports so `test/feed.test.ts` can exercise it directly —
 * the same split as `app/utils/*.ts`, which hold the parsing the Vitest suite
 * tests instead of mounting components.
 */

export interface FeedItem {
  title: string;
  /** Absolute URL of the post. Doubles as its permalink guid. */
  url: string;
  description?: string;
  /** Frontmatter `date`, which arrives as a string out of the content dump. */
  date?: string | Date | null;
}

export interface FeedOptions {
  title: string;
  description: string;
  /** Absolute URL of the page the feed describes — the blog index. */
  link: string;
  /** Absolute URL of the feed document itself, for `<atom:link rel="self">`. */
  self: string;
  language?: string;
  items: FeedItem[];
}

const XML_ESCAPES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&apos;",
};

function escapeXml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => XML_ESCAPES[character]!);
}

/**
 * RSS dates are RFC 822. `toUTCString()` emits the RFC 1123 profile of it
 * ("Tue, 23 Jun 2026 00:00:00 GMT"), which is what every reader expects and
 * what the spec's own examples use.
 */
function rfc822(value: string | Date): string | null {
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toUTCString();
}

function tag(name: string, value: string): string {
  return `    <${name}>${escapeXml(value)}</${name}>`;
}

export function buildRssFeed(options: FeedOptions): string {
  const items = options.items.map((item) => {
    const lines = [tag("title", item.title), tag("link", item.url)];
    lines.push(`    <guid isPermaLink="true">${escapeXml(item.url)}</guid>`);

    const published = item.date ? rfc822(item.date) : null;
    if (published) lines.push(tag("pubDate", published));
    if (item.description) lines.push(tag("description", item.description));

    return ["    <item>", ...lines.map((line) => "  " + line), "    </item>"].join("\n");
  });

  // Derived from the newest post rather than Date.now(): a static build should
  // produce a byte-identical feed until a post is actually added, so rebuilds
  // do not look like new content to a reader polling with If-Modified-Since.
  // Computed from the timestamps instead of trusting the caller's ordering.
  const timestamps = options.items
    .map((item) => (item.date ? new Date(item.date).getTime() : Number.NaN))
    .filter((time) => !Number.isNaN(time));
  const lastBuildDate = timestamps.length ? new Date(Math.max(...timestamps)).toUTCString() : null;

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    "  <channel>",
    tag("title", options.title),
    tag("link", options.link),
    tag("description", options.description),
    tag("language", options.language ?? "en"),
    `    <atom:link href="${escapeXml(options.self)}" rel="self" type="application/rss+xml"/>`,
    ...(lastBuildDate ? [tag("lastBuildDate", lastBuildDate)] : []),
    ...items,
    "  </channel>",
    "</rss>",
    "",
  ].join("\n");
}
