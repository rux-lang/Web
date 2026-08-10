import { flushPromises, mount, shallowMount } from "@vue/test-utils";
import type { Component } from "vue";
import { ref } from "vue";
import { afterEach, describe, expect, it, vi } from "vitest";
import PackageDependencies from "../app/components/PackageDependencies.vue";
import PackageDependents from "../app/components/PackageDependents.vue";
import PackageDownloadChart from "../app/components/PackageDownloadChart.vue";
import PackageInstallCommand from "../app/components/PackageInstallCommand.vue";
import SanitizedReadme from "../app/components/SanitizedReadme.vue";
import type { PackageSearchResult } from "../app/types/catalog";
import type { PackageDependency, PackageDownloadStatistics } from "../app/types/package";
import { downloadChartGeometry, nearestDownloadIndex } from "../app/utils/download-chart";
import {
  dependencyPackagePath,
  exactInstallCommand,
  formatBytes,
  packageApiPath,
  packageDownloadsApiPath,
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
    expect(packageDownloadsApiPath("Rux Tools", "Json/Parser")).toBe(
      "/v1/packages/Rux%20Tools/Json%2FParser/downloads",
    );
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

describe("download chart geometry", () => {
  it("builds a bounded area and preserves a zero baseline", () => {
    const zero = downloadChartGeometry([
      { date: "2026-07-01", downloads: 0 },
      { date: "2026-07-02", downloads: 0 },
    ]);
    expect(zero.maximum).toBe(0);
    expect(zero.points.every((point) => point.y === zero.baseline)).toBe(true);

    const varied = downloadChartGeometry([
      { date: "2026-07-01", downloads: 2 },
      { date: "2026-07-02", downloads: 8 },
      { date: "2026-07-03", downloads: 4 },
    ]);
    expect(varied.points[1]?.y).toBe(6);
    expect(varied.area).toMatch(/^M 6 90 L /);
    expect(varied.area).toMatch(/ L 294 90 Z$/);
  });

  it("selects the nearest point while clamping pointer positions", () => {
    expect(nearestDownloadIndex(-20, 300, 30)).toBe(0);
    expect(nearestDownloadIndex(150, 300, 30)).toBe(15);
    expect(nearestDownloadIndex(400, 300, 30)).toBe(29);
    expect(nearestDownloadIndex(10, 0, 30)).toBeNull();
    expect(nearestDownloadIndex(10, 300, 0)).toBeNull();
  });
});

describe("PackageDownloadChart", () => {
  const statistics: PackageDownloadStatistics = {
    window_days: 30,
    start_date: "2026-07-08",
    end_date: "2026-08-06",
    total_downloads: 12_540,
    total_all_time: 98_450,
    daily: [
      { date: "2026-07-08", downloads: 120 },
      { date: "2026-07-09", downloads: 180 },
      { date: "2026-07-10", downloads: 90 },
    ],
  };

  afterEach(() => vi.unstubAllGlobals());

  function mountChart(options?: {
    data?: PackageDownloadStatistics | null;
    error?: Error | null;
    status?: "idle" | "pending" | "success" | "error";
    refresh?: ReturnType<typeof vi.fn>;
  }) {
    const refresh = options?.refresh ?? vi.fn();
    vi.stubGlobal("useRegistryApi", () => ({ get: vi.fn() }));
    vi.stubGlobal("useLazyAsyncData", () => ({
      data: ref(options?.data === null ? null : { data: options?.data ?? statistics }),
      error: ref(options?.error ?? null),
      status: ref(options?.status ?? "success"),
      refresh,
    }));
    return {
      refresh,
      wrapper: mount(PackageDownloadChart, {
        props: { namespace: "Rux", packageName: "Json" },
        global: {
          stubs: {
            UCard: { template: '<section><slot name="header" /><slot /></section>' },
            USkeleton: { template: "<div data-skeleton />" },
            ApiProblemAlert: {
              props: ["failure"],
              emits: ["retry"],
              template: "<button data-retry @click=\"$emit('retry')\">Retry</button>",
            },
          },
        },
      }),
    };
  }

  it("renders package-wide totals and exposes daily keyboard inspection", async () => {
    const { wrapper } = mountChart();
    expect(wrapper.text()).toContain("Across all versions");
    expect(wrapper.text()).toContain("12,540");
    expect(wrapper.text()).toContain("98,450");
    expect(wrapper.text()).toContain("Jul 8, 2026 – Aug 6, 2026");
    expect(wrapper.get("polyline").attributes("points")).not.toBe("");

    const chart = wrapper.get('[role="group"]');
    expect(chart.attributes("aria-label")).toContain("Peak day");
    await chart.trigger("keydown", { key: "End" });
    expect(wrapper.text()).toContain("Jul 10, 2026: 90 downloads");
    await chart.trigger("keydown", { key: "Escape" });
    expect(wrapper.text()).not.toContain("Jul 10, 2026: 90 downloads");
  });

  it("keeps loading, empty, and retry states local to the chart card", async () => {
    const loading = mountChart({ data: null, status: "pending" }).wrapper;
    expect(loading.get('[role="status"]').attributes("aria-label")).toBe("Loading download statistics");

    const empty = mountChart({
      data: {
        ...statistics,
        total_downloads: 0,
        total_all_time: 0,
        daily: statistics.daily.map((day) => ({ ...day, downloads: 0 })),
      },
    }).wrapper;
    expect(empty.text()).toContain("No downloads have been recorded yet");

    const refresh = vi.fn();
    const failed = mountChart({ data: null, error: new Error("offline"), status: "error", refresh });
    await failed.wrapper.get("[data-retry]").trigger("click");
    expect(refresh).toHaveBeenCalledOnce();
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

describe("tabbed package documents", () => {
  afterEach(() => vi.unstubAllGlobals());

  const dependency: PackageDependency = {
    alias: "Json",
    target_namespace: "Rux_Tools",
    target_package: "Json_Parser",
    version_range: "^1.2",
    target_os: ["Windows", "Linux"],
  };

  it("leaves the Dependencies heading to the tab label while keeping it for assistive technology", () => {
    const wrapper = mount(PackageDependencies, {
      props: { dependencies: [dependency] },
      global: {
        stubs: {
          UButton: { props: ["label"], template: "<a>{{ label }}</a>" },
          UBadge: { template: "<span><slot /></span>" },
          UEmpty: { template: "<div data-empty />" },
        },
      },
    });

    // The tab strip names the section on screen, so the h2 must not be a second visible title.
    const heading = wrapper.get("#dependencies-heading");
    expect(heading.classes()).toContain("sr-only");
    expect(heading.classes()).not.toContain("text-2xl");
    expect(wrapper.text()).toContain("Registry packages required by this exact release.");
    expect(wrapper.text()).toContain("Rux_Tools/Json_Parser");
    expect(wrapper.text()).toContain("Targets");
    expect(wrapper.text()).toContain("Windows");
    expect(wrapper.text()).toContain("Linux");
  });

  function mountDependents(page: { data: unknown[]; meta: { next_cursor: string | null } } | null) {
    vi.stubGlobal("useRegistryApi", () => ({ get: vi.fn() }));
    vi.stubGlobal("useLazyAsyncData", () => ({
      data: ref(page),
      error: ref(null),
      status: ref("success"),
      refresh: vi.fn(),
    }));
    return mount(PackageDependents, {
      props: { namespace: "Rux", packageName: "Json" },
      global: {
        stubs: {
          AppLoadingState: { template: "<div data-loading />" },
          ApiProblemAlert: { props: ["failure"], template: "<div data-problem />" },
          UPageCard: { props: ["title"], template: "<article>{{ title }}<slot name='footer' /></article>" },
          UBadge: { template: "<span><slot /></span>" },
          UButton: { props: ["label"], template: "<button>{{ label }}</button>" },
          UEmpty: { template: "<div data-empty />" },
        },
      },
    });
  }

  it("reports its loaded count so the page can badge the tab without a second request", () => {
    const wrapper = mountDependents({
      data: [
        {
          namespace: "Rux",
          package: "Io",
          version: "0.1.1",
          description: "Streams",
          package_type: "source",
          published_at: "2026-08-08T00:00:00Z",
          yanked: false,
          requirements: [{ alias: "Json", version_range: "^1.2", target_os: ["MacOS"] }],
        },
      ],
      meta: { next_cursor: null },
    });

    expect(wrapper.emitted("count")).toEqual([[{ loaded: 1, hasMore: false }]]);
    expect(wrapper.text()).toContain("MacOS");
  });

  it("flags a truncated first page so the badge can read as a lower bound", () => {
    const wrapper = mountDependents({ data: [], meta: { next_cursor: "cursor-2" } });

    expect(wrapper.emitted("count")).toEqual([[{ loaded: 0, hasMore: true }]]);
  });

  it("stays silent until its request settles so the badge never flashes a placeholder zero", () => {
    const wrapper = mountDependents(null);

    expect(wrapper.emitted("count")).toBeUndefined();
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
