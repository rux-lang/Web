import { describe, expect, it } from "vitest";

import {
  kebab,
  memberSlug,
  pageAnchors,
  planRoutes,
  readmeGuide,
  renderApiPackage,
  signatureParams,
  transformProse,
} from "../scripts/api-docs.mjs";

import fixture from "./fixtures/api-fixture.json";
const entry = {
  name: "Gadget",
  slug: "gadget",
  folder: "99.gadget",
  icon: "i-lucide-box",
  description: "Storage contracts and the stores that meet them",
  topics: { "empty-blocks": "Empty blocks" },
};
const base = "content/docs/5.api/99.gadget";
const url = (page: string, anchor?: string) =>
  `https://rux-lang.dev/docs/api/gadget/${page}${anchor ? `#${anchor}` : ""}`;

// A deep copy the test can change without touching the shared fixture.
const copy = () => structuredClone(fixture);
const item = (snapshot: typeof fixture, name: string) =>
  snapshot.items.find((candidate: { name: string }) => candidate.name === name);

/** The text of a page between two headings, so a test can assert what sits in one section. */
function between(markdown: string, start: string, end?: string) {
  const from = markdown.indexOf(start);
  expect(from, `${start} is missing`).toBeGreaterThan(-1);
  const to = end ? markdown.indexOf(end, from + start.length) : -1;
  return markdown.slice(from, to === -1 ? undefined : to);
}

describe("slugs", () => {
  it("kebab-cases PascalCase names, acronyms and digits included", () => {
    expect(kebab("BytesUsed")).toBe("bytes-used");
    expect(kebab("IsEmptyBlock")).toBe("is-empty-block");
    expect(kebab("IOError")).toBe("io-error");
    expect(kebab("UTF8Decode")).toBe("utf8-decode");
    expect(kebab("Reset")).toBe("reset");
  });

  it("names constructors, destructors and operators by what they are", () => {
    const member = (kind: string, name: string, params: unknown[] = [{ name: "other", type: "T" }]) =>
      memberSlug({ kind, name, params });
    expect(member("constructor", "Arena")).toBe("new");
    expect(member("destructor", "~Arena")).toBe("destructor");
    expect(member("operator", "==")).toBe("equals");
    expect(member("operator", "!=")).toBe("not-equals");
    expect(member("operator", "[]")).toBe("index");
    expect(member("operator", "-", [])).toBe("negate");
    expect(member("operator", "-")).toBe("subtract");
    expect(() => member("operator", "@@")).toThrow(/OPERATOR_SLUGS/);
  });
});

describe("planRoutes", () => {
  const routes = planRoutes(fixture);

  it("makes an item with a fragment-free URL the owner of that page", () => {
    expect(routes.get(url("arena"))).toEqual({ page: "arena", anchor: null });
    expect(routes.get(url("store"))).toEqual({ page: "store", anchor: null });
  });

  it("gives an item without an API URL a page of its own kebab name", () => {
    expect(routes.get(url("natural-alignment"))).toEqual({ page: "natural-alignment", anchor: null });
  });

  it("places an item with a fragment URL as a section of that page", () => {
    expect(routes.get(url("arena", "arena-handle"))).toEqual({ page: "arena", anchor: "arena-handle" });
  });

  it("routes members by their own fragment, or by name on their type's page", () => {
    expect(routes.get(url("arena", "new"))).toEqual({ page: "arena", anchor: "new" });
    expect(routes.get(url("arena", "reset"))).toEqual({ page: "arena", anchor: "reset" });
    expect(routes.get(url("arena", "bytes-used"))).toEqual({ page: "arena", anchor: "bytes-used" });
    expect(routes.get(url("arena", "equals"))).toEqual({ page: "arena", anchor: "equals" });
    expect(routes.get(url("arena", "destructor"))).toEqual({ page: "arena", anchor: "destructor" });
    expect(routes.get(url("store", "put"))).toEqual({ page: "store", anchor: "put" });
  });

  it("prefixes the members of a placed item with its anchor", () => {
    expect(routes.get(url("arena", "arena-handle-reset"))).toEqual({ page: "arena", anchor: "arena-handle-reset" });
  });

  it("leaves private members out", () => {
    expect(routes.has(url("arena", "copy"))).toBe(false);
  });

  it("collects a page only fragments point at as a topic page", () => {
    expect(routes.get(url("empty-blocks", "empty-block"))).toEqual({ page: "empty-blocks", anchor: "empty-block" });
    expect(routes.has(url("empty-blocks"))).toBe(false);
  });

  it("throws when two items claim one page", () => {
    const snapshot = copy();
    item(snapshot, "Fault").doc.see = [url("arena")];
    expect(() => planRoutes(snapshot)).toThrow(/Arena and Fault both claim/);
  });

  it("throws when two things claim one anchor", () => {
    const snapshot = copy();
    item(snapshot, "Arena").members.find((member: { name: string }) => member.name === "BytesUsed").doc.see = [
      url("arena", "reset"),
    ];
    expect(() => planRoutes(snapshot)).toThrow(/both claim .*arena#reset/);
  });

  it("throws when a URL names another package", () => {
    const snapshot = copy();
    item(snapshot, "Fault").doc.see = ["https://rux-lang.dev/docs/api/allocator/alloc-error"];
    expect(() => planRoutes(snapshot)).toThrow(/names another package/);
  });

  it("throws when a member tries to own a page or leave its type's page", () => {
    const owner = copy();
    item(owner, "Fault").members[0].doc.see = [url("is-transient")];
    expect(() => planRoutes(owner)).toThrow(/cannot own a page/);
    const elsewhere = copy();
    item(elsewhere, "Fault").members[0].doc.see = [url("arena", "is-transient")];
    expect(() => planRoutes(elsewhere)).toThrow(/renders with Fault on page fault/);
  });

  it("refuses the old nested page URLs", () => {
    const snapshot = copy();
    item(snapshot, "Fault").members[0].doc.see = [url("fault/is-transient")];
    expect(() => planRoutes(snapshot)).toThrow(/one kebab-case segment/);
  });

  it("numbers same-name overloads that have no URL", () => {
    const snapshot = copy();
    const fault = item(snapshot, "Fault");
    fault.members.push({ ...structuredClone(fault.members[0]), line: 40 });
    const overloaded = planRoutes(snapshot);
    expect(overloaded.get(url("fault", "is-transient-2"))).toEqual({ page: "fault", anchor: "is-transient-2" });
  });
});

describe("prose", () => {
  const resolve = (text: string) => ({ Arena: "/docs/api/gadget/arena" })[text] ?? null;

  it("links a code span that names an item", () => {
    expect(transformProse("Use an `Arena` here.", resolve)).toBe("Use an [`Arena`](/docs/api/gadget/arena) here.");
  });

  it("never links inside a fence, a heading or existing link text", () => {
    const markdown = "```rux\nlet a = `Arena`;\n```\n\n## The `Arena`\n\n[the `Arena` type](/x)";
    expect(transformProse(markdown, resolve)).toBe(markdown);
  });

  it("escapes a generic in prose so MDC does not read it as an element", () => {
    expect(transformProse("A Box<T> and `Box<T>` and <https://rux-lang.dev>.")).toBe(
      "A Box&lt;T> and `Box<T>` and <https://rux-lang.dev>.",
    );
  });

  it("does not link a name two items share, but prefers the described item's own member", async () => {
    const pages = await renderApiPackage(fixture, null, entry);
    // Arena and ArenaHandle both have a Reset; on the Arena page, Arena's prose means Arena's own.
    const arena = pages.get(`${base}/2.types/arena.md`)!;
    expect(arena).toContain("Call [`Reset`](/docs/api/gadget/arena#reset) to start over");
    expect(arena).toContain("see [`Arena::Reset`](/docs/api/gadget/arena#reset)");
    expect(arena).toContain("arena.Reset(); // `Reset` here is code, not a link");
    // The Store interface is not Arena: its prose leaves the ambiguous name alone.
    const index = pages.get(`${base}/0.index.md`)!;
    expect(index).not.toMatch(/\[`Reset`\]/);
  });
});

describe("signatures", () => {
  it("reads typed parameters from a function signature, generics and nesting included", () => {
    expect(signatureParams("pub func Map<K, V>(size: uint, limit: Map<uint, uint>, f: (int) -> int) -> uint")).toEqual([
      { name: "size", type: "uint" },
      { name: "limit", type: "Map<uint, uint>" },
      { name: "f", type: "(int) -> int" },
    ]);
  });
});

describe("renderApiPackage", async () => {
  const pages = await renderApiPackage(fixture, null, entry);

  it("writes one page per owner and topic, grouped by kind, with navigation files", () => {
    expect([...pages.keys()]).toEqual([
      `${base}/.navigation.yml`,
      `${base}/0.index.md`,
      `${base}/1.interfaces/.navigation.yml`,
      `${base}/1.interfaces/store.md`,
      `${base}/2.types/.navigation.yml`,
      `${base}/2.types/arena.md`,
      `${base}/2.types/box.md`,
      `${base}/2.types/fault.md`,
      `${base}/3.functions/.navigation.yml`,
      `${base}/3.functions/natural-alignment.md`,
      `${base}/4.constants/.navigation.yml`,
      `${base}/4.constants/empty-blocks.md`,
    ]);
    expect(pages.get(`${base}/.navigation.yml`)).toBe("title: Gadget\nicon: i-lucide-box\n");
    expect(pages.get(`${base}/2.types/.navigation.yml`)).toBe("title: Types\n");
  });

  it("gives every page the frontmatter the page header reads", () => {
    const box = pages.get(`${base}/2.types/box.md`)!;
    expect(box).toMatch(/^---\ntitle: "Box<T>"\ndescription: One heap value of T\.\npath: \/docs\/api\/gadget\/box\n/);
    expect(box).toContain(
      "api:\n  package: Gadget\n  kind: struct\n  version: 0.2.0\n  source: Src/Box.rux\n  line: 10\n",
    );
    expect(box).toContain('seo:\n  title: "Box<T> — Gadget API"');
    expect(box).toContain(
      "<!-- Generated by scripts/sync-api-reference.mjs from data/api/gadget.json. Do not edit. -->",
    );
  });

  it("opens an item page with its name, its summary, then its signature", () => {
    const arena = pages.get(`${base}/2.types/arena.md`)!;
    const body = arena.slice(arena.indexOf("# Arena"));
    expect(body).toMatch(
      /^# Arena\n\nA store that advances a pointer and reclaims everything at once\.\n\n```rux\npub struct Arena \{\n {4}pub capacity: uint;\n {4}\/\/ private fields\n\}\n```\n\nCall /,
    );
  });

  it("orders an item page's sections and leaves empty ones out", () => {
    const arena = pages.get(`${base}/2.types/arena.md`)!;
    const headings = [...arena.matchAll(/^## (.+)$/gm)].map((match) => match[1]);
    expect(headings).toEqual([
      "Fields",
      "Constructors",
      "Methods",
      "Operators",
      "Implements Store",
      "Constants",
      "Destructor",
      "Related",
    ]);
    expect(pages.get(`${base}/2.types/box.md`)!.match(/^## (.+)$/gm)).toEqual([
      "## Type parameters",
      "## Associated functions",
      "## Methods",
    ]);
  });

  it("renders a member as an anchored heading, signature, prose, parameters and returns", () => {
    const arena = pages.get(`${base}/2.types/arena.md`)!;
    expect(between(arena, '<h3 id="new">', "## Methods")).toBe(
      [
        '<h3 id="new"><code>Arena</code></h3>',
        "```rux\npub func Arena(capacity: uint) -> Arena\n```",
        "An empty arena.",
        "| Name       | Type   | Description                    |\n| ---------- | ------ | ------------------------------ |\n| `capacity` | `uint` | how many bytes it may hand out |",
        "**Returns**: the arena",
        "[Source](https://github.com/rux-lang/Rux/blob/main/Packages/Gadget/Src/Arena.rux#L30)",
        "",
      ].join("\n\n"),
    );
  });

  it("warns about a deprecated member", () => {
    expect(pages.get(`${base}/2.types/arena.md`)).toContain(
      "::warning\n**Deprecated.**\\\nUse [`Reset`](/docs/api/gadget/arena#reset) instead; it keeps the largest block.\n::",
    );
  });

  it("puts the destructor under its section without a second #destructor", () => {
    const arena = pages.get(`${base}/2.types/arena.md`)!;
    expect(between(arena, "## Destructor", "## Related")).toMatch(/^## Destructor\n\n```rux\nfunc ~Arena/);
    expect(arena).not.toContain('id="destructor"');
  });

  it("groups conformance members under the interface they implement", () => {
    const section = between(pages.get(`${base}/2.types/arena.md`)!, "## Implements Store", "## Constants");
    expect(section).toContain("`Arena` conforms to [`Store`](/docs/api/gadget/store).");
    expect(section).toContain('<h3 id="put"><code>Put</code></h3>');
    expect(section).toContain('<h3 id="take"><code>Take</code></h3>');
  });

  it("lists an interface's implementations and requirements", () => {
    const store = pages.get(`${base}/1.interfaces/store.md`)!;
    expect(store).toContain("pub interface Store {\n    func Put(value: uint) -> ! Fault;\n");
    expect(between(store, "## Requirements", "## Implementations")).toContain('<h3 id="put">');
    const implementations = between(store, "## Implementations");
    expect(implementations).toContain("[`Arena`](/docs/api/gadget/arena)");
    expect(implementations).toContain("[`ArenaHandle`](/docs/api/gadget/arena#arena-handle)");
  });

  it("renders items placed on another page under Related, with prefixed member anchors", () => {
    const related = between(pages.get(`${base}/2.types/arena.md`)!, "## Related");
    expect(related).toContain('<h3 id="arena-handle"><code>ArenaHandle</code></h3>');
    expect(related).toContain('<h4 id="arena-handle-reset"><code>Reset</code></h4>');
  });

  it("shows only public fields, and enum cases with their values", () => {
    const arena = pages.get(`${base}/2.types/arena.md`)!;
    expect(between(arena, "## Fields", "## Constructors")).not.toContain("head");
    expect(pages.get(`${base}/2.types/fault.md`)).toContain("| `Full`  | `1`   | No room is left \\| try later. |");
  });

  it("titles a topic page from the registry and fails without one", async () => {
    const topic = pages.get(`${base}/4.constants/empty-blocks.md`)!;
    expect(topic).toContain("# Empty blocks");
    expect(topic).toContain("kind: topic");
    expect(topic).toContain('<h2 id="empty-block"><code>EmptyBlock</code></h2>');
    expect(topic).toContain("pub const EmptyBlock: uint = 0xFFFF0000;");
    await expect(renderApiPackage(fixture, null, { ...entry, topics: undefined })).rejects.toThrow(
      /topic page .* no topics\["empty-blocks"\]/,
    );
  });

  it("refuses an anchor that collides with a section heading", async () => {
    const snapshot = copy();
    item(snapshot, "Arena").members.find((member: { name: string }) => member.name === "Reset").doc.see = [
      url("arena", "methods"),
    ];
    await expect(renderApiPackage(snapshot, null, entry)).rejects.toThrow(/#methods collides/);
  });

  it("indexes every item on the overview, by kind group, linked to its page or anchor", () => {
    const overview = pages.get(`${base}/0.index.md`)!;
    expect(overview).toMatch(/^# Gadget\n\nStorage contracts and the stores that meet them\.\n/m);
    expect(overview).toContain('Gadget = { Namespace = "Rux", Version = "0.2.0" }');
    const index = between(overview, "## Index");
    expect([...index.matchAll(/^### (.+)$/gm)].map((match) => match[1])).toEqual([
      "Interfaces",
      "Types",
      "Functions",
      "Constants",
    ]);
    for (const link of [
      "[`Store`](/docs/api/gadget/store)",
      "[`ArenaHandle`](/docs/api/gadget/arena#arena-handle)",
      "[`Box<T>`](/docs/api/gadget/box)",
      "[`IsEmptyBlock`](/docs/api/gadget/empty-blocks#is-empty-block)",
      "[`NaturalAlignment`](/docs/api/gadget/natural-alignment)",
      "[`EmptyBlock`](/docs/api/gadget/empty-blocks#empty-block)",
    ]) {
      expect(index).toContain(link);
    }
  });

  it("links a dependency only when its reference is generated", () => {
    const dependencies = between(pages.get(`${base}/0.index.md`)!, "## Dependencies", "## Index");
    expect(dependencies).toContain("- `Core` 0.1.0");
    expect(dependencies).toContain("- [`Allocator`](/docs/api/allocator) 0.1.0");
    expect(dependencies).toContain("- `Windows` 0.1.0 (Windows only)");
  });

  it("collects every heading id a page will have", () => {
    const ids = pageAnchors(pages.get(`${base}/2.types/arena.md`)!);
    for (const id of ["arena", "fields", "new", "reset", "equals", "implements-store", "destructor", "arena-handle"]) {
      expect(ids.has(id), id).toBe(true);
    }
  });
});

describe("readmeGuide", () => {
  const readme = `# Gadget

Storage contracts and the stores that meet them.

## Installation

\`\`\`sh
rux add Rux/Gadget
\`\`\`

## What it provides

Stores. See [the licence](LICENSE.md).

### Details

\`\`\`rux
## not a heading
\`\`\`

## Documentation

<https://rux-lang.dev/docs/api/gadget>

## License

MIT.
`;

  it("drops the title, the repeated description and the boilerplate sections, and demotes the rest", () => {
    expect(readmeGuide(readme, fixture)).toBe(
      [
        "### What it provides",
        "",
        "Stores. See [the licence](https://github.com/rux-lang/Rux/blob/main/Packages/Gadget/LICENSE.md).",
        "",
        "#### Details",
        "",
        "```rux\n## not a heading\n```",
      ].join("\n"),
    );
  });
});
