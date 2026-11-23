import { describe, expect, it } from "vitest";

import { assembleSets, bookOf, books, joinSet, llmsFileFor, renderPages } from "../scripts/llms-files.mjs";

type Page = { path: string; stem?: string; title?: string; description?: string; seo?: Record<string, string> };

const rendered = (page: Page) => ({ ...page, markdown: `# ${page.title}\n\nSource: ${page.path}\n` });

const PAGES = [
  { path: "/docs", title: "Documentation", description: "Every book." },
  { path: "/docs/learn", title: "Learn Rux", description: "The course." },
  { path: "/docs/learn/cheatsheet", title: "Cheat sheet", seo: { description: "On one page." } },
  { path: "/docs/learn/hello", title: "Hello" },
  { path: "/docs/lang", title: "Rux Reference" },
  { path: "/docs/lang/types/integers", title: "Integers" },
  { path: "/docs/cli", title: "CLI" },
  { path: "/docs/packaging", title: "Packaging" },
  { path: "/docs/api", title: "API" },
].map(rendered);

const files = () => new Map(assembleSets(PAGES, "9.9.9").map(({ path, text }) => [path, text]));

describe("llmsFileFor", () => {
  it("maps a page's Markdown URL to the route it was made from", () => {
    expect(llmsFileFor("/docs/learn/literal.md")).toEqual({
      path: "/docs/learn/literal.md",
      page: "/docs/learn/literal",
      contentType: "text/markdown; charset=utf-8",
    });
    expect(llmsFileFor("/docs.md")?.page).toBe("/docs");
    expect(llmsFileFor("/docs/api/log.log/logger.md")?.page).toBe("/docs/api/log.log/logger");
  });

  it("recognises every document set as plain text", () => {
    for (const path of ["/llms.txt", "/llms-small.txt", "/llms-full.txt", "/docs/lang/llms-full.txt"])
      expect(llmsFileFor(path)).toEqual({ path, contentType: "text/plain; charset=utf-8" });
  });

  it("leaves every other URL alone, HTML pages under /docs included", () => {
    for (const path of [
      "/docs",
      "/docs/learn/literal",
      "/docs/.md",
      "/readme.md",
      "/llms-tiny.txt",
      "/docs/learn/hello/llms-full.txt",
      "/docs/learn/literal.md/",
    ])
      expect(llmsFileFor(path)).toBeUndefined();
  });
});

describe("assembleSets", () => {
  it("writes the core, one file per book, the full set and the index, in that order", () => {
    expect([...files().keys()]).toEqual([
      "/llms-small.txt",
      "/docs/learn/llms-full.txt",
      "/docs/lang/llms-full.txt",
      "/docs/cli/llms-full.txt",
      "/docs/packaging/llms-full.txt",
      "/docs/api/llms-full.txt",
      "/llms-full.txt",
      "/llms.txt",
    ]);
  });

  it("leads the core with the course overview and cheat sheet, then the whole reference", () => {
    const small = files().get("/llms-small.txt")!;
    expect(small).toMatch(/^# Rux — core documentation\n\n> .*rux 9\.9\.9 implements it/);
    const order = ["# Learn Rux", "# Cheat sheet", "# Rux Reference", "# Integers"].map((h) => small.indexOf(h));
    expect(order.every((at, i) => at > 0 && (i === 0 || at > order[i - 1]!))).toBe(true);
    expect(small).not.toContain("# Hello");
  });

  it("keeps a book's file to that book", () => {
    const learn = files().get("/docs/learn/llms-full.txt")!;
    expect(learn).toBe(joinSet("Rux — Learn Rux", books("9.9.9")[0]!.description, PAGES.slice(1, 4)));
  });

  it("indexes every page's Markdown URL with its description, and sizes each set", () => {
    const index = files().get("/llms.txt")!;
    expect(index).toContain("- [Documentation](https://rux-lang.dev/docs.md): Every book.");
    expect(index).toContain("- [Cheat sheet](https://rux-lang.dev/docs/learn/cheatsheet.md): On one page.");
    expect(index).toMatch(
      /- \[Rux Reference\]\(https:\/\/rux-lang\.dev\/docs\/lang\/llms-full\.txt\): .*\(≈\d+k tokens\)/,
    );
  });

  it("refuses a book with no pages", () => {
    expect(() => assembleSets(PAGES.filter((page) => bookOf(page.path) !== "cli"))).toThrow("/docs/cli");
  });
});

describe("renderPages", () => {
  it("names a component the cleaner cannot write, and the pages it is on", async () => {
    const page = {
      path: "/docs/learn/hello",
      title: "Hello",
      body: { type: "minimark", value: [["fancy-widget", {}]] },
    };
    await expect(renderPages([page])).rejects.toThrow("<fancy-widget> on /docs/learn/hello");
  });
});
