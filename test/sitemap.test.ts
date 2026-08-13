import { describe, expect, it, vi } from "vitest";

import {
  SITEMAP_BYTE_LIMIT,
  SITEMAP_PAGE_LIMIT,
  SITEMAP_URL_LIMIT,
  buildSitemapFiles,
  exactHttpOrigin,
  fetchSitemapEntries,
  sitemapEntriesForBuild,
} from "../scripts/sitemap.mjs";

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

describe("sitemap source", () => {
  it("walks cursor pages and maps every supported catalog record", async () => {
    const fetchMock = vi.fn(async (input: URL | RequestInfo) => {
      const url = new URL(String(input));
      expect(url.searchParams.get("limit")).toBe(String(SITEMAP_PAGE_LIMIT));

      if (!url.searchParams.has("cursor")) {
        return jsonResponse({
          data: [
            {
              kind: "keyword",
              keyword: "Data_Formats",
              normalized_keyword: "data-formats",
              last_modified: "2026-08-01T12:00:00Z",
            },
          ],
          meta: { next_cursor: "page-two" },
        });
      }

      expect(url.searchParams.get("cursor")).toBe("page-two");
      return jsonResponse({
        data: [
          {
            kind: "namespace",
            namespace: "Rux_Tools",
            normalized_namespace: "rux-tools",
            last_modified: "2026-08-02T12:00:00Z",
          },
          {
            kind: "package",
            namespace: "Rux_Tools",
            normalized_namespace: "rux-tools",
            package: "Json_Parser",
            normalized_package: "json-parser",
            last_modified: "2026-08-03T12:00:00Z",
          },
        ],
        meta: { next_cursor: null },
      });
    });

    await expect(fetchSitemapEntries("https://api.rux-lang.dev", fetchMock)).resolves.toEqual([
      {
        path: "/packages/-/keywords/data-formats",
        lastmod: "2026-08-01T12:00:00Z",
      },
      {
        path: "/packages/-/namespaces/rux-tools",
        lastmod: "2026-08-02T12:00:00Z",
      },
      {
        path: "/packages/rux-tools/json-parser",
        lastmod: "2026-08-03T12:00:00Z",
      },
    ]);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("rejects source failures, malformed records, and repeated cursors", async () => {
    await expect(fetchSitemapEntries("https://api.rux-lang.dev", async () => jsonResponse({}, 503))).rejects.toThrow(
      "HTTP 503",
    );
    await expect(
      fetchSitemapEntries("https://api.rux-lang.dev", async () =>
        jsonResponse({
          data: [
            {
              kind: "keyword",
              normalized_keyword: "../escape",
              last_modified: "2026-08-01T12:00:00Z",
            },
          ],
          meta: { next_cursor: null },
        }),
      ),
    ).rejects.toThrow("normalized registry identity");

    const repeatedCursor = vi.fn(async () =>
      jsonResponse({
        data: [],
        meta: { next_cursor: "same-cursor" },
      }),
    );
    await expect(fetchSitemapEntries("https://api.rux-lang.dev", repeatedCursor)).rejects.toThrow("repeated a cursor");
  });

  it("requires exact HTTP origins", () => {
    expect(exactHttpOrigin("origin", "https://rux-lang.dev")).toBe("https://rux-lang.dev");
    expect(() => exactHttpOrigin("origin", "https://user@rux-lang.dev/path")).toThrow(
      "without credentials, path, query, or fragment",
    );
  });

  it("always loads registry entries from the API", async () => {
    const fetchMock = vi.fn(async () => jsonResponse({ data: [], meta: { next_cursor: null } }));

    await expect(sitemapEntriesForBuild("https://api.rux-lang.dev", fetchMock)).resolves.toEqual([]);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("degrades to no registry entries when the API is unreachable", async () => {
    const transportFailure = Object.assign(new Error("fetch failed"), {
      cause: new Error("connect ETIMEDOUT 188.166.62.211:443"),
    });
    const fetchMock = vi.fn(async () => {
      throw transportFailure;
    });
    const warnings: string[] = [];

    await expect(
      sitemapEntriesForBuild("https://api.rux-lang.dev", fetchMock, (message: string) => {
        warnings.push(message);
      }),
    ).resolves.toEqual([]);
    expect(warnings).toHaveLength(1);
    expect(warnings[0]).toContain("continuing without registry URLs");
    expect(warnings[0]).toContain("connect ETIMEDOUT 188.166.62.211:443");
  });

  it("degrades when the API answers but the payload breaks the contract", async () => {
    const fetchMock = vi.fn(async () => jsonResponse({ error: "boom" }, 503));
    const warnings: string[] = [];

    await expect(
      sitemapEntriesForBuild("https://api.rux-lang.dev", fetchMock, (message: string) => {
        warnings.push(message);
      }),
    ).resolves.toEqual([]);
    expect(warnings[0]).toContain("HTTP 503");
  });
});

describe("sitemap XML", () => {
  it("adds static routes, deduplicates URLs, and preserves last-modified timestamps", () => {
    const files = buildSitemapFiles("https://rux-lang.dev", [
      {
        path: "/packages/rux/json",
        lastmod: "2026-08-02T12:00:00Z",
      },
      {
        path: "/packages/rux/json",
        lastmod: "2026-08-03T12:00:00Z",
      },
    ]);

    expect(files.parts).toHaveLength(1);
    expect(files.index).toContain("https://rux-lang.dev/sitemap-1.xml");
    expect(files.parts[0]?.contents).toContain("<loc>https://rux-lang.dev/</loc>");
    expect(files.parts[0]?.contents).toContain("<loc>https://rux-lang.dev/packages/-/keywords</loc>");
    expect(files.parts[0]?.contents).toContain("<loc>https://rux-lang.dev/packages</loc>");
    expect(files.parts[0]?.contents.match(/packages\/rux\/json/g)).toHaveLength(1);
    expect(files.parts[0]?.contents).toContain("<lastmod>2026-08-03T12:00:00Z</lastmod>");
    expect(Buffer.byteLength(files.parts[0]?.contents ?? "")).toBeLessThanOrEqual(SITEMAP_BYTE_LIMIT);
  });

  it("splits collections that exceed the standard URL limit", () => {
    const entries = Array.from({ length: SITEMAP_URL_LIMIT + 1 }, (_, index) => ({
      path: `/packages/catalog/package-${index}`,
    }));
    const files = buildSitemapFiles("https://rux-lang.dev", entries);

    expect(files.parts).toHaveLength(2);
    expect(files.parts[0]?.contents.match(/<url>/g)).toHaveLength(SITEMAP_URL_LIMIT);
    expect(files.parts[1]?.contents.match(/<url>/g)).toHaveLength(4);
  });
});
