import { flushPromises, mount, shallowMount } from "@vue/test-utils";
import type { Component } from "vue";
import { afterEach, describe, expect, it, vi } from "vitest";
import PackageInstallCommand from "../app/components/PackageInstallCommand.vue";
import SanitizedReadme from "../app/components/SanitizedReadme.vue";
import type { PackageSearchResult } from "../app/types/catalog";
import type { PackageDependency } from "../app/types/package";
import {
  dependencyPackagePath,
  exactInstallCommand,
  formatBytes,
  packageApiPath,
  packageVersionTarget,
  packageVersionApiPath,
  representativePackage,
} from "../app/utils/package";
import { safeReadmeLink, sanitizedReadmeTree, textContent } from "../app/utils/readme";

const representative: PackageSearchResult = {
  namespace: "Rux_Tools",
  package: "Json_Parser",
  version: "1.2.3+native",
  package_type: "library",
  description: "JSON parsing",
  published_at: "2026-08-02T12:00:00Z",
  yanked: false,
  package_url: "/v1/packages/rux-tools/json-parser",
  version_url: "/v1/packages/rux-tools/json-parser/1.2.3+native",
};

describe("package page helpers", () => {
  it("builds encoded API paths and compiler-compatible exact install commands", () => {
    expect(packageApiPath("Rux Tools", "Json/Parser")).toBe("/v1/packages/Rux%20Tools/Json%2FParser");
    expect(packageVersionApiPath("Rux", "Json", "1.2.3+native")).toBe("/v1/packages/Rux/Json/1.2.3%2Bnative");
    expect(exactInstallCommand("Rux_Tools", "Json_Parser", "1.2.3+native")).toBe(
      "rux add Rux_Tools/Json_Parser@1.2.3+native",
    );
    expect(packageVersionTarget("Rux_Tools", "Json_Parser", "1.2.3", "1.2.3")).toEqual({
      path: "/packages/rux-tools/json-parser",
    });
    expect(packageVersionTarget("Rux_Tools", "Json_Parser", "1.1.0+native", "1.2.3")).toEqual({
      path: "/packages/rux-tools/json-parser",
      query: { version: "1.1.0+native" },
    });
  });

  it("accepts only the exact normalized package from representative search results", () => {
    expect(representativePackage([representative], "rux-tools", "json-parser")).toBe(representative);
    expect(representativePackage([representative], "rux-tools", "other")).toBeNull();
  });

  it("links dependencies through normalized catalog paths and formats bounded metrics", () => {
    const dependency: PackageDependency = {
      alias: "Json",
      target_namespace: "Rux_Tools",
      target_package: "Json_Parser",
      version_range: "^1.2.0",
    };

    expect(dependencyPackagePath(dependency)).toBe("/packages/rux-tools/json-parser");
    expect(formatBytes(999)).toBe("999 B");
    expect(formatBytes(1500)).toBe("1.5 kB");
    expect(formatBytes(2_000_000)).toBe("2 MB");
  });
});

describe("PackageInstallCommand", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  function mountCommand(add: ReturnType<typeof vi.fn>, writeText: ReturnType<typeof vi.fn>) {
    vi.stubGlobal("useToast", () => ({ add }));
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText },
    });
    return shallowMount(PackageInstallCommand, {
      props: {
        namespace: "Rux",
        packageName: "Json",
        version: "1.1.0",
      },
      global: {
        stubs: {
          UCard: {
            template: '<section><slot name="header" /><slot /></section>',
          },
          UButton: {
            emits: ["click"],
            template: "<button @click=\"$emit('click')\">Copy</button>",
          },
        },
      },
    });
  }

  it("copies the exact add command and confirms success", async () => {
    const add = vi.fn();
    const writeText = vi.fn().mockResolvedValue(undefined);
    const wrapper = mountCommand(add, writeText);

    expect(wrapper.text()).toContain("rux add Rux/Json@1.1.0");
    await wrapper.get("button").trigger("click");
    await flushPromises();

    expect(writeText).toHaveBeenCalledWith("rux add Rux/Json@1.1.0");
    expect(add).toHaveBeenCalledWith(expect.objectContaining({ color: "success" }));
  });

  it("leaves the visible command available when clipboard access fails", async () => {
    const add = vi.fn();
    const writeText = vi.fn().mockRejectedValue(new Error("denied"));
    const wrapper = mountCommand(add, writeText);

    await wrapper.get("button").trigger("click");
    await flushPromises();

    expect(wrapper.text()).toContain("rux add Rux/Json@1.1.0");
    expect(add).toHaveBeenCalledWith(
      expect.objectContaining({
        color: "error",
        description: "Select the command and copy it manually.",
      }),
    );
  });
});

function elements(node: unknown): Record<string, unknown>[] {
  if (!node || typeof node !== "object") return [];
  const value = node as Record<string, unknown>;
  const children = Array.isArray(value.children) ? value.children.flatMap(elements) : [];
  return value.type === "element" ? [value, ...children] : children;
}

describe("README sanitization", () => {
  const hostileReadme = `# Safe heading

[Safe](https://example.com/docs) [Relative](./private) [Script](javascript:alert(1))

![Tracking pixel](https://tracker.example/pixel.png)

<script>alert('xss')</script>
<iframe src="https://attacker.example"></iframe>
<img src=x onerror="alert(1)">

| Name | Value |
| --- | --- |
| one | **two** |
`;

  it("keeps safe GFM while dropping executable HTML, remote images, and unsafe attributes", () => {
    const tree = sanitizedReadmeTree(hostileReadme);
    const nodes = elements(tree);
    const tags = nodes.map((node) => node.tagName);

    expect(tags).toContain("h1");
    expect(tags).toContain("table");
    expect(tags).not.toContain("script");
    expect(tags).not.toContain("iframe");
    expect(tags).not.toContain("img");
    expect(JSON.stringify(tree)).not.toContain("onerror");
    expect(textContent(tree)).toContain("[Image: Tracking pixel]");
  });

  it("allows only absolute HTTP(S) and mail links at render time", () => {
    expect(safeReadmeLink("https://example.com/docs")).toBe("https://example.com/docs");
    expect(safeReadmeLink("mailto:team@example.com")).toBe("mailto:team@example.com");
    expect(safeReadmeLink("./private")).toBeNull();
    expect(safeReadmeLink("#heading")).toBeNull();
    expect(safeReadmeLink("javascript:alert(1)")).toBeNull();
    expect(safeReadmeLink("data:text/html,unsafe")).toBeNull();
  });

  it("renders sanitized links through prose components without making blocked content interactive", () => {
    const proseStub = (tag: string): Component => ({
      template: `<${tag}><slot /></${tag}>`,
    });
    const wrapper = mount(SanitizedReadme, {
      props: { source: hostileReadme },
      global: {
        stubs: {
          ProseA: {
            props: ["href", "target"],
            template: '<a :href="href" :target="target"><slot /></a>',
          },
          ProseBlockquote: proseStub("blockquote"),
          ProseCode: proseStub("code"),
          ProseEm: proseStub("em"),
          ProseH3: proseStub("h3"),
          ProseH4: proseStub("h4"),
          ProseHr: proseStub("hr"),
          ProseLi: proseStub("li"),
          ProseOl: proseStub("ol"),
          ProseP: proseStub("p"),
          ProsePre: proseStub("pre"),
          ProseStrong: proseStub("strong"),
          ProseTable: proseStub("table"),
          ProseTbody: proseStub("tbody"),
          ProseTd: proseStub("td"),
          ProseTh: proseStub("th"),
          ProseThead: proseStub("thead"),
          ProseTr: proseStub("tr"),
          ProseUl: proseStub("ul"),
        },
      },
    });

    const links = wrapper.findAll("a");
    expect(links).toHaveLength(1);
    expect(links[0]?.attributes()).toMatchObject({
      href: "https://example.com/docs",
      target: "_blank",
      rel: "noopener noreferrer nofollow",
    });
    expect(wrapper.text()).toContain("Relative");
    expect(wrapper.text()).toContain("Script");
    expect(wrapper.text()).toContain("[Image: Tracking pixel]");
    expect(wrapper.find("img").exists()).toBe(false);
    expect(wrapper.find("iframe").exists()).toBe(false);
  });
});
