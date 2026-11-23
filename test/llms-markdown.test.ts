import { describe, expect, it } from "vitest";

import {
  absoluteUrl,
  apiPackageNodes,
  approxTokens,
  cleanBody,
  fixTablePipes,
  naturalStemCompare,
  renderIndex,
  renderPage,
  roadmapNodes,
} from "../scripts/llms-markdown.mjs";
import { PARTS } from "../scripts/learn-course.mjs";

type Node = string | [string, Record<string, unknown>, ...Node[]];

const page = (value: Node[], extra: Record<string, unknown> = {}) =>
  renderPage({ path: "/docs/learn/hello", title: "Hello, World", body: { type: "minimark", value }, ...extra });

describe("renderPage", () => {
  it("opens with the title and canonical URL and drops the body's own H1", async () => {
    const md = await page([
      ["h1", { id: "hello-world" }, "Hello, World"],
      ["p", {}, "Print one line."],
    ]);
    expect(md).toBe("# Hello, World\n\nSource: https://rux-lang.dev/docs/learn/hello\n\nPrint one line.\n");
  });

  it("adds the summary unless the body already opens with it", async () => {
    expect(await page([["p", {}, "Body."]], { description: "A  short\nsummary." })).toContain("> A short summary.");
    expect(await page([["p", {}, "Same."]], { description: "Same." })).not.toContain("> Same.");
  });

  it("turns a mistake into a blockquote whose first paragraph is its title", async () => {
    const md = await page([
      [
        "mistake",
        {},
        ["p", {}, ["strong", {}, "Leaving out a semicolon."], ["br", {}], "\nThe compiler stops:"],
        ["pre", { code: "error: expected ';'\n", language: "text", className: ["x"] }, ["code", {}, "ignored"]],
      ],
    ]);
    expect(md).toContain(
      "> **Leaving out a semicolon.**\n>\n> The compiler stops:\n>\n> ```text\n> error: expected ';'\n> ```",
    );
    expect(md).not.toMatch(/:br|::|className/);
  });

  it("labels a callout with no bold title by its kind", async () => {
    const md = await page([["tip", {}, ["p", {}, "Run it again."]]]);
    expect(md).toContain("> **Tip**\n>\n> Run it again.");
  });

  it("keeps a callout's own leading bold run without a label", async () => {
    const md = await page([["note", {}, ["p", {}, ["strong", {}, "You'll need"], ": nothing."]]]);
    expect(md).toContain("> **You'll need**: nothing.");
    expect(md).not.toContain("**Note**");
  });

  it("drops rel and makes site links absolute", async () => {
    const md = await page([
      [
        "p",
        {},
        ["a", { href: "https://github.com/rux-lang/Examples", rel: ["nofollow"] }, "Examples"],
        " and ",
        ["a", { href: "/docs/lang/types" }, "types"],
        " and ",
        ["a", { href: "#run-it" }, "below"],
      ],
    ]);
    expect(md).toContain("[Examples](https://github.com/rux-lang/Examples)");
    expect(md).toContain("[types](https://rux-lang.dev/docs/lang/types)");
    expect(md).toContain("[below](https://rux-lang.dev/docs/learn/hello#run-it)");
    expect(md).not.toContain("{rel");
  });

  it("flattens a code tree into fenced blocks named by file", async () => {
    const md = await page([
      [
        "code-tree",
        { "default-value": "Src/Main.rux" },
        ["pre", { code: "[Package]\n", language: "toml", filename: "Rux.toml" }, ["code", {}, ""]],
        ["pre", { code: "func Main() {}\n", language: "rux", filename: "Src/Main.rux" }, ["code", {}, ""]],
      ],
    ]);
    expect(md).toContain("```toml [Rux.toml]\n[Package]\n```");
    expect(md).toContain("```rux [Src/Main.rux]\nfunc Main() {}\n```");
    expect(md).not.toContain("code-tree");
  });

  it("turns a grid of cards into one link list", async () => {
    const md = await page([
      [
        "u-page-grid",
        {},
        [
          "u-page-card",
          { title: "Introduction", description: "Design goals.", to: "/docs/lang/introduction", icon: "x" },
        ],
        "\n",
        ["link-card", { name: "YouTube", description: "Videos.", to: "https://youtube.com/@ruxlang" }],
      ],
    ]);
    expect(md).toContain(
      "- [Introduction](https://rux-lang.dev/docs/lang/introduction): Design goals.\n- [YouTube](https://youtube.com/@ruxlang): Videos.",
    );
  });

  it("escapes a pipe inside code in a table cell", async () => {
    const md = await page([
      [
        "table",
        {},
        ["thead", {}, ["tr", {}, ["th", {}, "Kind"], ["th", {}, "Form"]]],
        ["tbody", {}, ["tr", {}, ["td", {}, "Sum"], ["td", {}, ["code", {}, "A | B"]]]],
      ],
    ]);
    expect(md).toMatch(/\| Sum +\| `A \\\| B` \|/);
  });
});

describe("cleanBody", () => {
  it("reports a tag it does not know and keeps its content", () => {
    const unknown = new Set<string>();
    const nodes = cleanBody([["fancy-box", {}, ["p", {}, "kept"]]], { page: "/docs", unknown });
    expect(nodes).toEqual([["p", {}, "kept"]]);
    expect([...unknown]).toEqual(["fancy-box"]);
  });

  it("substitutes a data-driven component", () => {
    const nodes = cleanBody([["learn-roadmap", {}]], {
      page: "/docs/learn",
      components: { "learn-roadmap": roadmapNodes(PARTS) },
    });
    const text = JSON.stringify(nodes);
    for (const part of PARTS) expect(text).toContain(`${part.number}. ${part.title}`);
    expect(PARTS).toHaveLength(27);
  });
});

describe("fixTablePipes", () => {
  it("escapes pipes in code spans on table rows only", () => {
    expect(fixTablePipes("| `a || b` | `!a` |")).toBe("| `a \\|\\| b` | `!a` |");
    expect(fixTablePipes("Use `a | b` in prose.")).toBe("Use `a | b` in prose.");
    expect(fixTablePipes("> | `A | B` | x |")).toBe("> | `A \\| B` | x |");
  });

  it("leaves escaped pipes and fenced code alone", () => {
    expect(fixTablePipes("| `A \\| B` |")).toBe("| `A \\| B` |");
    expect(fixTablePipes("```text\n| `A | B` |\n```")).toBe("```text\n| `A | B` |\n```");
  });

  it("matches a code span by its backtick run length", () => {
    expect(fixTablePipes("| ``a ` | b`` | c |")).toBe("| ``a ` \\| b`` | c |");
  });
});

describe("naturalStemCompare", () => {
  it("orders numeric prefixes as numbers and index pages first", () => {
    const stems = ["docs/2.lang/10.tuples", "docs/2.lang/02.lexical/1.x", "docs/2.lang/index", "docs/1.learn/00.index"];
    expect([...stems].sort(naturalStemCompare)).toEqual([
      "docs/1.learn/00.index",
      "docs/2.lang/index",
      "docs/2.lang/02.lexical/1.x",
      "docs/2.lang/10.tuples",
    ]);
  });
});

describe("index helpers", () => {
  it("renders llms.txt sections with one-line descriptions", () => {
    const txt = renderIndex({
      title: "Rux",
      summary: "A language.",
      notes: ["Pre-1.0."],
      sets: [{ title: "Core", url: "https://rux-lang.dev/llms-small.txt", description: "Small." }],
      sections: [
        {
          title: "CLI",
          links: [{ title: "rux run", url: "https://rux-lang.dev/docs/cli/run.md", description: "Builds\nand runs." }],
        },
      ],
    });
    expect(txt).toBe(
      "# Rux\n\n> A language.\n\n- Pre-1.0.\n\n## Documentation sets\n\n- [Core](https://rux-lang.dev/llms-small.txt): Small.\n\n" +
        "## CLI\n\n- [rux run](https://rux-lang.dev/docs/cli/run.md): Builds and runs.\n",
    );
  });

  it("lists only packages that have pages", () => {
    const nodes = apiPackageNodes(
      [{ slug: "text", title: "Text" }],
      [
        { name: "Text", area: "text", path: "/docs/api/text", description: "Strings" },
        { name: "Regex", area: "text", path: "/docs/api/regex" },
      ],
      (path: string) => path === "/docs/api/text",
    );
    expect(JSON.stringify(nodes)).toContain("/docs/api/text");
    expect(JSON.stringify(nodes)).not.toContain("Regex");
  });

  it("formats token estimates and absolute URLs", () => {
    expect(approxTokens(4_000_000)).toBe("≈1.0M tokens");
    expect(approxTokens(48_000)).toBe("≈12k tokens");
    expect(absoluteUrl("mailto:a@b.c", "/docs")).toBe("mailto:a@b.c");
  });
});
