import { mount } from "@vue/test-utils";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { nextTick } from "vue";
import BenchmarkDotPlot from "../app/components/BenchmarkDotPlot.vue";
import BenchmarkSummary from "../app/components/BenchmarkSummary.vue";
import BenchmarkTable from "../app/components/BenchmarkTable.vue";
import type { BenchmarkMachine } from "../app/types/benchmarks";
import {
  formatBenchmarkValue,
  formatRatio,
  formatTick,
  logDomain,
  logPosition,
  logTicks,
} from "../app/utils/benchmark-chart";
import {
  benchmarkGeomean,
  benchmarkHighlights,
  benchmarkMachine,
  benchmarkMachineName,
  benchmarkMachines,
  benchmarkMetrics,
  bestLanguages,
  describeOs,
  formatBenchmarkDate,
  geometricMean,
  machineLanguages,
  median,
  ordinal,
} from "../app/utils/benchmarks";

/**
 * The checks below hold the page to the runner's own report.md for the first
 * machine (Ryzen 5 5500, 2026-10-07), so a bad import or a slip in the
 * arithmetic shows up as a number that no longer matches what the runner
 * printed.
 */
const ryzen = benchmarkMachine("ryzen5-5500")!;

describe("benchmark data", () => {
  it("loads every machine file with the full matrix of apps, languages and metrics", () => {
    expect(benchmarkMachines.length).toBeGreaterThan(0);
    for (const machine of benchmarkMachines) {
      expect(machine.schemaVersion).toBe(1);
      expect(machine.languages).toContain("Rux");
      for (const metric of benchmarkMetrics) {
        const results = machine.metrics[metric.key];
        expect(results.unit).toBe(metric.unit);
        expect(Object.keys(results.cells)).toEqual(machine.apps);
      }
    }
    expect(ryzen.machine.cpu).toBe("AMD Ryzen 5 5500");
    expect(machineLanguages(ryzen).map((language) => language.label)).toEqual([
      "Rux",
      "Rust",
      "C++",
      "Go",
      "C# AOT",
      "C# JIT",
      "Java AOT",
      "Java JIT",
    ]);
  });

  it("splits a machine label into form factor and processor", () => {
    expect(benchmarkMachineName("Laptop · Core i5-8250U")).toEqual({ kind: "Laptop", processor: "Core i5-8250U" });
    expect(benchmarkMachineName("Ryzen 5 5500")).toEqual({ processor: "Ryzen 5 5500" });
  });

  it("falls back to the first machine for an unknown id", () => {
    expect(benchmarkMachine("no-such-machine")).toBe(benchmarkMachines[0]);
  });

  it("reproduces the report's geometric means", () => {
    const mean = (metric: Parameters<typeof benchmarkGeomean>[1], language: string) =>
      formatRatio(benchmarkGeomean(ryzen, metric, language)!);
    expect(mean("execution", "Rux")).toBe("1.00×");
    expect(mean("execution", "Rust")).toBe("0.07×");
    expect(mean("execution", "Cpp")).toBe("0.06×");
    expect(mean("memory", "JavaJit")).toBe("4.36×");
    expect(mean("memory", "Rust")).toBe("1.12×");
    expect(mean("compile", "Go")).toBe("0.49×");
    expect(mean("compile", "JavaAot")).toBe("51×");
    expect(mean("executable", "CSharpAot")).toBe("5.40×");
    expect(mean("deployable", "CSharpJit")).toBe("0.84×");
  });

  it("finds the best language per app, ties included", () => {
    expect(bestLanguages(ryzen, "execution", "BinaryTrees")).toEqual(["JavaJit"]);
    expect(bestLanguages(ryzen, "memory", "NBody")).toEqual(["Rux"]);
    expect(bestLanguages(ryzen, "cpu", "WordCount")).toEqual(["Rust", "Cpp"]);
  });

  it("derives the headline figures from the data", () => {
    const highlights = benchmarkHighlights(ryzen);
    expect(highlights.memoryWins).toBe(10);
    // Rux uses the least memory: every other language's geomean is above 1.
    expect(highlights.memory).toMatchObject({ rivals: ["Cpp"], rank: 1, field: 8 });
    expect(highlights.memory!.spread.map(formatRatio)).toEqual(["1.10×", "4.36×"]);
    // Executable size counts native builds only, where Rust is smaller.
    expect(highlights.executable).toMatchObject({ rivals: ["Rust"], rank: 2, field: 6 });
    expect(highlights.executable!.ratio).toBeLessThan(1);
    expect(highlights.compile?.rivals).toEqual(["Go"]);
    expect(highlights.compile!.spread[1]).toBeGreaterThan(1);
    expect(highlights.execution).toMatchObject({ rivals: ["Cpp"], rank: 8, field: 8 });
    expect(Math.round(1 / highlights.execution!.ratio)).toBe(17);
  });

  it("has small helpers that behave at the edges", () => {
    expect(geometricMean([])).toBeNull();
    expect(geometricMean([2, 8])).toBeCloseTo(4);
    expect(median([3, 1, 2])).toBe(2);
    expect(median([4, 1, 3, 2])).toBe(2.5);
    expect(median([])).toBeNull();
    expect([1, 2, 3, 4, 11, 12, 13, 21, 22].map(ordinal)).toEqual([
      "1st",
      "2nd",
      "3rd",
      "4th",
      "11th",
      "12th",
      "13th",
      "21st",
      "22nd",
    ]);
    expect(describeOs("Microsoft Windows 10.0.26300")).toBe("Windows 11 (build 26300)");
    expect(describeOs("Microsoft Windows 10.0.19045")).toBe("Windows 10 (build 19045)");
    expect(describeOs("Ubuntu 26.04 LTS")).toBe("Ubuntu 26.04 LTS");
    expect(formatBenchmarkDate("2026-10-07T23:40:47.5+03:00")).toBe("October 7, 2026");
  });
});

describe("benchmark chart geometry", () => {
  it("snaps a log domain outward to 1-2-5 steps", () => {
    expect(logDomain([0.157, 23.23])).toEqual([0.1, 50]);
    expect(logDomain([1, 5008])).toEqual([1, 10000]);
    expect(logDomain([3.3, 496.3])).toEqual([2, 500]);
    expect(logDomain([0.27, 0.84])).toEqual([0.2, 1]);
    expect(logDomain([5, 5])).toEqual([5, 50]);
    expect(logDomain([])).toEqual([1, 10]);
  });

  it("thins ticks to powers of ten past two decades and keeps both ends", () => {
    expect(logTicks([0.1, 50])).toEqual([0.1, 1, 10, 50]);
    expect(logTicks([0.2, 1])).toEqual([0.2, 0.5, 1]);
    expect(logTicks([2, 500])).toEqual([2, 10, 100, 500]);
    expect(logTicks([1, 50])).toEqual([1, 2, 5, 10, 20, 50]);
  });

  it("maps values onto the axis and clamps outliers", () => {
    expect(logPosition(1, [0.1, 10])).toBeCloseTo(0.5);
    expect(logPosition(0.1, [0.1, 10])).toBe(0);
    expect(logPosition(100, [0.1, 10])).toBe(1);
    expect(logPosition(0, [0.1, 10])).toBe(0);
    // Rounded, so the server and the browser render the same `left:` style.
    expect(logPosition(3, [1, 7])).toBe(0.564575);
  });

  it("formats values, ratios and ticks the way the report does", () => {
    expect(formatBenchmarkValue(22.3981, 3)).toBe("22.398");
    expect(formatBenchmarkValue(4992, 0)).toBe("4,992");
    expect(formatRatio(0.0257)).toBe("0.03×");
    expect(formatRatio(9.6)).toBe("9.60×");
    expect(formatRatio(51.2)).toBe("51×");
    expect(formatTick(0.05)).toBe("0.05");
    expect(formatTick(0.2)).toBe("0.2");
    expect(formatTick(10000)).toBe("10,000");
  });
});

describe("BenchmarkDotPlot", () => {
  function plot(metric: "execution" | "memory" = "execution") {
    return mount(BenchmarkDotPlot, { props: { machine: ryzen, metric, compare: "Cpp" } });
  }

  it("draws one dot per app and language and summarises the chart for screen readers", () => {
    const wrapper = plot("memory");
    expect(wrapper.findAll("span.rounded-full")).toHaveLength(80);
    expect(wrapper.findAll(".bg-\\(--bench-rux\\)")).toHaveLength(10);
    expect(wrapper.findAll(".bg-\\(--bench-compare\\)")).toHaveLength(10);
    // JIT builds are hollow rings in the grey of the other languages.
    expect(wrapper.findAll(".border-\\(--bench-other\\)")).toHaveLength(20);
    expect(wrapper.get('[role="group"]').attributes("aria-label")).toContain("Rux is lowest in 10 of 10 apps");
  });

  it("walks the dots from the keyboard and announces each one", async () => {
    const wrapper = plot();
    const chart = wrapper.get('[role="group"]');
    const live = () => wrapper.get('[aria-live="polite"]').text();

    await chart.trigger("keydown", { key: "ArrowDown" });
    expect(live()).toBe("Sha512, Rux: 22.398 s");
    await chart.trigger("keydown", { key: "Home" });
    expect(live()).toBe("Sha512, C++: 0.576 s, 0.03× Rux");
    await chart.trigger("keydown", { key: "ArrowDown" });
    expect(live()).toBe("Mandelbrot, C++: 0.866 s, 0.13× Rux");
    await chart.trigger("keydown", { key: "End" });
    expect(live()).toBe("Mandelbrot, Rux: 6.808 s");
    expect(wrapper.text()).toContain("min 6.");
    await chart.trigger("keydown", { key: "Escape" });
    expect(live()).toBe("");
  });
});

describe("BenchmarkTable", () => {
  it("prints medians with the best value in each row bold", () => {
    const wrapper = mount(BenchmarkTable, {
      props: { machine: ryzen, metric: "execution", relative: false, compare: "Rust" },
    });
    const first = wrapper.findAll("tbody tr")[0]!;
    expect(first.text()).toContain("Sha512");
    expect(first.text()).toContain("22.398");
    expect(first.get(".font-semibold").text()).toBe("0.576");
    expect(wrapper.find("tfoot").exists()).toBe(false);
  });

  it("adds the geometric mean in the relative view", () => {
    const wrapper = mount(BenchmarkTable, {
      props: { machine: ryzen, metric: "memory", relative: true, compare: "Rust" },
    });
    const footer = wrapper.get("tfoot").text();
    expect(footer).toContain("Geometric mean");
    expect(footer).toContain("4.36×");
  });

  it("marks a failed case instead of dropping the cell", () => {
    const failed: BenchmarkMachine = structuredClone(ryzen);
    failed.metrics.execution.cells.Sort!.Go = null;
    const wrapper = mount(BenchmarkTable, {
      props: { machine: failed, metric: "execution", relative: false, compare: "Rust" },
    });
    expect(wrapper.get(".text-error").text()).toBe("FAIL");
  });
});

describe("BenchmarkSummary", () => {
  it("tints cells away from 1.00× and opens a metric on request", async () => {
    const wrapper = mount(BenchmarkSummary, { props: { machine: ryzen } });
    const rows = wrapper.findAll("tbody tr");
    expect(rows).toHaveLength(6);
    const memory = rows[2]!;
    expect(memory.text()).toContain("Peak memory");
    const cells = memory.findAll("td");
    expect(cells[0]!.attributes("data-tone")).toBeUndefined();
    expect(cells[7]!.text()).toBe("4.36×");
    expect(cells[7]!.attributes("data-tone")).toBe("ahead");
    expect(rows[0]!.findAll("td")[1]!.attributes("data-tone")).toBe("behind");

    await memory.get("button").trigger("click");
    expect(wrapper.emitted("select")).toEqual([["memory"]]);
  });
});

describe("benchmarks page", () => {
  const replace = vi.fn();

  beforeEach(() => {
    replace.mockReset();
    vi.stubGlobal("definePageMeta", vi.fn());
    vi.stubGlobal("useSeoMeta", vi.fn());
    vi.stubGlobal("useHead", vi.fn());
    vi.stubGlobal("useRoute", () => ({ query: {}, hash: "" }));
    vi.stubGlobal("useRouter", () => ({ replace }));
  });

  afterEach(() => vi.unstubAllGlobals());

  const slot = (name: string) => `<slot name="${name}" />`;
  const stubs = {
    UContainer: { template: "<div><slot /></div>" },
    UPageHero: {
      props: ["title"],
      template: `<header><h1>{{ title }}</h1>${slot("description")}${slot("links")}<slot /></header>`,
    },
    UPageBody: { template: "<main><slot /></main>" },
    UButton: { template: "<button><slot /></button>" },
    UBadge: { template: "<span data-badge><slot /></span>" },
    UCard: { template: "<section><slot /></section>" },
    UIcon: { template: "<i />" },
    ULink: { template: "<a><slot /></a>" },
    UAlert: { props: ["title"], template: `<div data-alert>{{ title }}${slot("description")}</div>` },
    UTabs: { props: ["items", "modelValue"], template: "<nav data-tabs />" },
    USwitch: { props: ["modelValue", "label"], template: "<input type='checkbox' />" },
    BenchmarkSummary: { props: ["machine"], template: "<div data-summary />" },
    BenchmarkDotPlot: { name: "BenchmarkDotPlot", props: ["machine", "metric", "compare"], template: "<div />" },
    BenchmarkTable: {
      name: "BenchmarkTable",
      props: ["machine", "metric", "relative", "compare"],
      template: "<div />",
    },
  };

  it("renders the first machine with its headline figures and methodology", async () => {
    const Page = (await import("../app/pages/benchmarks.vue")).default;
    const wrapper = mount(Page, { global: { stubs } });
    await nextTick();

    const text = wrapper.text();
    expect(text).toContain("Benchmarks");
    expect(text).toContain("10 / 10");
    expect(text).toContain("Intel(R) Core(TM) i9-11900KF");
    expect(text).toContain("Windows 11 (build 26300)");
    expect(text).toContain("64 GiB");
    expect(text).toContain("does not optimize yet");
    expect(text).toContain("Fannkuch");
    expect(wrapper.find("#methodology").exists()).toBe(true);

    const plot = wrapper.getComponent({ name: "BenchmarkDotPlot" });
    expect(plot.props("metric")).toBe("execution");
    expect(plot.props("compare")).toBe("Rust");
  });
});
