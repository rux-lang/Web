import type { ContentNavigationItem } from "@nuxt/content";
import { describe, expect, it } from "vitest";
import { apiHubBook, groupByStemFolder } from "../app/composables/useDocsSection";
import { apiGenerated, apiPackageCatalog } from "../app/utils/api-catalog";
import { apiSourceUrl } from "../app/utils/api-page";

const page = (path: string, stem: string, title = path.split("/").pop()!): ContentNavigationItem => ({
  title,
  path,
  stem,
});

// The /docs/api node as Nuxt Content returns it: one generated package whose
// pages are flat under it, a hand-written 0.3 folder for Io, and Legacy, a
// hand-written folder the registry does not list.
const apiBook: ContentNavigationItem = {
  title: "API Reference",
  path: "/docs/api",
  stem: "docs/5.api/index",
  children: [
    page("/docs/api", "docs/5.api/index", "Table of Contents"),
    {
      title: "Allocator",
      icon: "i-lucide-boxes",
      path: "/docs/api/allocator",
      stem: "docs/5.api/03.allocator/0.index",
      children: [
        page("/docs/api/allocator", "docs/5.api/03.allocator/0.index", "Overview"),
        page("/docs/api/allocator/allocator", "docs/5.api/03.allocator/1.interfaces/allocator"),
        page("/docs/api/allocator/arena", "docs/5.api/03.allocator/2.types/arena"),
        page("/docs/api/allocator/box", "docs/5.api/03.allocator/2.types/box"),
        page("/docs/api/allocator/constants", "docs/5.api/03.allocator/4.constants/constants"),
      ],
    },
    {
      title: "Io",
      path: "/docs/api/io",
      stem: "docs/5.api/05.io/index",
      children: [
        page("/docs/api/io", "docs/5.api/05.io/index", "Overview"),
        page("/docs/api/io/print", "docs/5.api/05.io/print"),
      ],
    },
    {
      title: "Legacy",
      path: "/docs/api/legacy",
      stem: "docs/5.api/02.legacy/index",
      children: [page("/docs/api/legacy", "docs/5.api/02.legacy/index", "Overview")],
    },
  ],
};

describe("groupByStemFolder", () => {
  it("regroups a generated package by kind folder with the overview first", () => {
    const allocator = apiBook.children![1]!;
    const grouped = groupByStemFolder(allocator, 3, {
      "1.interfaces": { title: "Interfaces" },
      "2.types": { title: "Types" },
    });

    expect(grouped.children!.map((item) => item.title)).toEqual(["Overview", "Interfaces", "Types", "4.constants"]);
    expect(grouped.children![2]!.children!.map((item) => item.path)).toEqual([
      "/docs/api/allocator/arena",
      "/docs/api/allocator/box",
    ]);
    expect(grouped.children![1]!.stem).toBe("docs/5.api/03.allocator/1.interfaces");
  });

  it("keeps a Learn part's overview node as its group and fills it with the part's lessons", () => {
    const learn: ContentNavigationItem = {
      title: "Learn Rux",
      path: "/docs/learn",
      stem: "docs/1.learn/00.index",
      children: [
        page("/docs/learn", "docs/1.learn/00.index", "Overview"),
        page("/docs/learn/build", "docs/1.learn/00.start/2.build"),
        {
          title: "Basics",
          path: "/docs/learn/basics",
          stem: "docs/1.learn/01.basics/00.index",
          children: [page("/docs/learn/basics", "docs/1.learn/01.basics/00.index", "Overview")],
        },
        page("/docs/learn/hello", "docs/1.learn/01.basics/01.hello"),
      ],
    };
    const grouped = groupByStemFolder(learn, 2, { "00.start": { title: "Getting Started", icon: "i-lucide-rocket" } });

    expect(grouped.children!.map((item) => item.title)).toEqual(["Overview", "Getting Started", "Basics"]);
    expect(grouped.children![1]!.icon).toBe("i-lucide-rocket");
    expect(grouped.children![2]!.children!.map((item) => item.path)).toEqual([
      "/docs/learn/basics",
      "/docs/learn/hello",
    ]);
    // The input tree is shared through provide(); it must not be mutated.
    expect(learn.children![2]!.children).toHaveLength(1);
  });
});

describe("apiPackageCatalog", () => {
  const catalog = apiPackageCatalog(apiBook);
  const find = (slug: string) => catalog.flatMap((area) => area.packages).find((entry) => entry.slug === slug);

  it("lists every registry package by area, in registry order", () => {
    expect(catalog[0]!.slug).toBe("foundation");
    expect(catalog[0]!.packages.map((entry) => entry.name)).toEqual(["Core", "Memory", "Allocator", "Math"]);
  });

  it("marks the packages the navigation tree has a folder for", () => {
    expect(find("allocator")).toMatchObject({ hasPages: true, generated: true });
    // Io stays hand-written until its snapshot lands; the flag follows data/api/.
    expect(find("io")).toMatchObject({ hasPages: true, generated: apiGenerated.has("io") });
    expect(find("json")).toMatchObject({ hasPages: false });
    expect(find("windows")).toMatchObject({ hasPages: false, platform: "Windows" });
  });

  it("appends hand-written folders the registry does not name", () => {
    expect(catalog.at(-1)).toMatchObject({ slug: "other", packages: [{ name: "Legacy", path: "/docs/api/legacy" }] });
  });

  it("drops nothing but empty areas when the tree is missing", () => {
    const empty = apiPackageCatalog(undefined);
    expect(empty.flatMap((area) => area.packages)).toHaveLength(25);
    expect(empty.every((area) => area.slug !== "other")).toBe(true);
  });
});

describe("apiHubBook", () => {
  it("outlines only the packages with pages, under their areas", () => {
    const hub = apiHubBook(apiBook);
    expect(hub.children!.map((area) => area.title)).toEqual(["Foundation", "System and I/O", "Other packages"]);
    expect(hub.children![0]!.children).toEqual([
      { title: "Allocator", icon: "i-lucide-boxes", path: "/docs/api/allocator" },
    ]);
  });
});

describe("apiSourceUrl", () => {
  it("links a declaration to its line", () => {
    expect(
      apiSourceUrl({ package: "Allocator", kind: "struct", version: "0.1.0", source: "Src/Arena.rux", line: 44 }),
    ).toBe("https://github.com/rux-lang/Rux/blob/main/Packages/Allocator/Src/Arena.rux#L44");
  });

  it("links an overview, or a page with no file, to the package tree", () => {
    const tree = "https://github.com/rux-lang/Rux/tree/main/Packages/Allocator";
    expect(apiSourceUrl({ package: "Allocator", kind: "package", version: "0.1.0", source: "Src/Arena.rux" })).toBe(
      tree,
    );
    expect(apiSourceUrl({ package: "Allocator", kind: "topic", version: "0.1.0" })).toBe(tree);
  });

  it("omits the fragment when the line is unknown", () => {
    expect(apiSourceUrl({ package: "Allocator", kind: "function", version: "0.1.0", source: "Src/Box.rux" })).toBe(
      "https://github.com/rux-lang/Rux/blob/main/Packages/Allocator/Src/Box.rux",
    );
  });
});
