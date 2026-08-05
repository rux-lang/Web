import { describe, expect, it } from "vitest";

import { buildRssFeed } from "../server/utils/feed";

const BASE = {
  title: "Rux Blog",
  description: "Release notes and articles from the Rux programming language project.",
  link: "https://rux-lang.dev/blog",
  self: "https://rux-lang.dev/blog/rss.xml",
};

describe("buildRssFeed", () => {
  it("emits one channel with an item per post, newest first", () => {
    const xml = buildRssFeed({
      ...BASE,
      items: [
        {
          title: "Rux 0.3.0",
          url: "https://rux-lang.dev/blog/release-v0.3.0",
          description: "Newer",
          date: "2026-06-23",
        },
        {
          title: "Rux 0.2.0",
          url: "https://rux-lang.dev/blog/release-v0.2.0",
          description: "Older",
          date: "2026-05-10",
        },
      ],
    });

    expect(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(true);
    expect(xml).toContain('<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">');
    expect(xml).toContain(
      '<atom:link href="https://rux-lang.dev/blog/rss.xml" rel="self" type="application/rss+xml"/>',
    );
    expect(xml.match(/<item>/g)).toHaveLength(2);
    expect(xml.indexOf("Rux 0.3.0")).toBeLessThan(xml.indexOf("Rux 0.2.0"));
    expect(xml).toContain("<language>en</language>");
  });

  it("dates every item in RFC 822 and stamps the channel with the newest one", () => {
    const xml = buildRssFeed({
      ...BASE,
      items: [
        { title: "Older", url: "https://rux-lang.dev/blog/a", date: "2025-11-02" },
        { title: "Newest", url: "https://rux-lang.dev/blog/b", date: "2026-06-23" },
      ],
    });

    expect(xml).toContain("<pubDate>Sun, 02 Nov 2025 00:00:00 GMT</pubDate>");
    expect(xml).toContain("<pubDate>Tue, 23 Jun 2026 00:00:00 GMT</pubDate>");
    // Newest wins even though it is not the first item — the channel date is
    // computed from the timestamps, not from the caller's ordering.
    expect(xml).toContain("<lastBuildDate>Tue, 23 Jun 2026 00:00:00 GMT</lastBuildDate>");
  });

  it("omits pubDate for an item with a missing or unparseable date", () => {
    const xml = buildRssFeed({
      ...BASE,
      items: [
        { title: "No date", url: "https://rux-lang.dev/blog/a" },
        { title: "Bad date", url: "https://rux-lang.dev/blog/b", date: "not a date" },
      ],
    });

    expect(xml).not.toContain("<pubDate>");
    expect(xml).not.toContain("<lastBuildDate>");
    expect(xml.match(/<item>/g)).toHaveLength(2);
  });

  it("escapes markup and ampersands in titles, descriptions and urls", () => {
    const xml = buildRssFeed({
      ...BASE,
      items: [
        {
          title: 'Traits & <generics> "v2"',
          url: "https://rux-lang.dev/blog/a?x=1&y=2",
          description: "Comparing a < b && c > d",
          date: "2026-06-23",
        },
      ],
    });

    expect(xml).toContain("<title>Traits &amp; &lt;generics&gt; &quot;v2&quot;</title>");
    expect(xml).toContain("<link>https://rux-lang.dev/blog/a?x=1&amp;y=2</link>");
    expect(xml).toContain('<guid isPermaLink="true">https://rux-lang.dev/blog/a?x=1&amp;y=2</guid>');
    expect(xml).toContain("<description>Comparing a &lt; b &amp;&amp; c &gt; d</description>");
    // Nothing unescaped leaks through: the only < and > left are tag delimiters.
    expect(xml).not.toMatch(/<generics>/);
  });

  it("drops the description element when a post has none", () => {
    const xml = buildRssFeed({
      ...BASE,
      items: [{ title: "Bare", url: "https://rux-lang.dev/blog/a", date: "2026-06-23" }],
    });

    // The channel keeps its own description; the item does not gain an empty one.
    expect(xml.match(/<description>/g)).toHaveLength(1);
  });
});
