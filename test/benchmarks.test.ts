import { mount } from "@vue/test-utils";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { nextTick } from "vue";
import BenchmarkBars from "../app/components/BenchmarkBars.vue";
import BenchmarkCompileTable from "../app/components/BenchmarkCompileTable.vue";
import BenchmarkDotPlot from "../app/components/BenchmarkDotPlot.vue";
import BenchmarkSummary from "../app/components/BenchmarkSummary.vue";
import BenchmarkTable from "../app/components/BenchmarkTable.vue";
import type { BenchmarkAppRun, BenchmarkCompileRun } from "../app/types/benchmarks";
import {
  formatBenchmarkValue,
  formatRatio,
  formatTick,
  logDomain,
  logPosition,
  logTicks,
} from "../app/utils/benchmark-chart";
import {
  benchmarkCompileRow,
  benchmarkGeomean,
  benchmarkHighlights,
  benchmarkMachine,
  benchmarkMachineName,
  benchmarkMachines,
  benchmarkMetrics,
  bestLanguages,
  compileBest,
  compileComparison,
  compileRatio,
  compileValue,
  describeOs,
  formatBenchmarkDate,
  geometricMean,
  latestRun,
  machineLanguages,
  median,
  ordinal,
} from "../app/utils/benchmarks";

/**
 * The checks below hold the page to the runner's own report.md for one machine
 * (Ryzen 5 5500, both runs of 2026-10-15), so a bad import or a slip in the
 * arithmetic shows up as a number that no longer matches what the runner
 * printed.
 */
const ryzen = benchmarkMachine("ryzen5-5500")!;
const apps = ryzen.apps!;
const compile = ryzen.compile!;

describe("benchmark data", () => {
  it("joins every machine with its two runs, each with the full matrix", () => {
    expect(benchmarkMachines.map((machine) => machine.id)).toEqual(["i9-11900kf", "ryzen5-5500", "i5-8250u"]);
    for (const machine of benchmarkMachines) {
      expect(machine.apps?.machine).toBe(machine.id);
      expect(machine.compile?.machine).toBe(machine.id);
      for (const run of [machine.apps!, machine.compile!]) {
        expect(run.schemaVersion).toBe(2);
        expect(run.languages).toContain("Rux");
      }
      for (const metric of benchmarkMetrics) {
        const results = machine.apps!.metrics[metric.key];
        expect(results.unit).toBe(metric.unit);
        expect(Object.keys(results.cells)).toEqual(machine.apps!.apps);
      }
      expect(machine.compile!.projects).toEqual(["Baseline", "Large"]);
    }
    expect(apps.kind).toBe("apps");
    expect(compile.kind).toBe("compile");
    expect(apps.hardware.cpu).toBe("AMD Ryzen 5 5500");
    expect(latestRun(ryzen)).toBe(compile);
    expect(machineLanguages(apps).map((language) => language.label)).toEqual([
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
    const mean = (metric: Parameters<typeof benchmarkGeomean>[1], language: string) => {
      const value = benchmarkGeomean(apps, metric, language);
      return value === null ? "—" : formatRatio(value);
    };
    expect(mean("execution", "Rux")).toBe("1.00×");
    expect(mean("execution", "Rust")).toBe("1.11×");
    expect(mean("execution", "Cpp")).toBe("0.97×");
    expect(mean("memory", "JavaJit")).toBe("4.29×");
    expect(mean("memory", "Rust")).toBe("1.11×");
    expect(mean("compile", "Go")).toBe("2.07×");
    expect(mean("compile", "JavaAot")).toBe("113×");
    expect(mean("compileMemory", "JavaAot")).toBe("13×");
    expect(mean("executable", "CSharpAot")).toBe("14×");
    expect(mean("deployable", "CSharpJit")).toBe("165×");
    // JIT program files need their runtime, so the report does not rank them.
    expect(mean("executable", "CSharpJit")).toBe("—");
    expect(mean("executable", "JavaJit")).toBe("—");
  });

  it("finds the best language per app, ties included", () => {
    expect(bestLanguages(apps, "execution", "BinaryTrees")).toEqual(["JavaJit"]);
    expect(bestLanguages(apps, "execution", "Sha512")).toEqual(["Rust"]);
    expect(bestLanguages(apps, "memory", "NBody")).toEqual(["Rux"]);
    expect(bestLanguages(apps, "cpu", "WordCount")).toEqual(["Cpp"]);
    // The 3 KiB jar is smaller than any native build, but it is not ranked.
    expect(bestLanguages(apps, "executable", "Sha512")).toEqual(["Rux"]);
  });

  it("derives the headline figures from the data", () => {
    const highlights = benchmarkHighlights(apps);
    expect(highlights.memoryWins).toBe(10);
    // Rux uses the least memory: every other language's geomean is above 1.
    expect(highlights.memory).toMatchObject({ rank: 1, field: 8 });
    expect(highlights.memory!.spread.map(formatRatio)).toEqual(["1.11×", "4.29×"]);
    // Executable size counts native builds only.
    expect(highlights.executable).toMatchObject({ rivals: ["Rust"], rank: 1, field: 6 });
    expect(formatRatio(highlights.executable!.ratio)).toBe("2.80×");
    expect(highlights.execution).toMatchObject({ rivals: ["Cpp"], rank: 2, field: 8 });
    expect(formatRatio(highlights.execution!.ratio)).toBe("0.97×");
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

describe("compile benchmark data", () => {
  const value = (key: string, language: string) => {
    const row = benchmarkCompileRow(key);
    return formatBenchmarkValue(compileValue(compile, row, language)!, row.digits);
  };

  it("reproduces the report's medians and ratios", () => {
    expect(value("clean", "Rux")).toBe("1.14");
    expect(value("clean", "Go")).toBe("2.93");
    expect(value("baseline", "JavaAot")).toBe("21.25");
    expect(value("speed", "Rux")).toBe("98,200");
    expect(value("speedup", "Cpp")).toBe("6.27");
    expect(value("rebuild", "Rux")).toBe("0.40");
    expect(value("memory", "Go")).toBe("204");
    expect(value("lines", "Cpp")).toBe("108,385");
    expect(value("files", "Rux")).toBe("112");
    expect(formatRatio(compileRatio(compile, benchmarkCompileRow("clean"), "JavaAot")!)).toBe("36×");
    expect(formatRatio(compileRatio(compile, benchmarkCompileRow("speed"), "Go")!)).toBe("0.39×");
  });

  it("ranks each row the way it is better", () => {
    expect(compileBest(compile, benchmarkCompileRow("clean"))).toEqual(["Rux"]);
    expect(compileBest(compile, benchmarkCompileRow("speed"))).toEqual(["Rux"]);
    expect(compileBest(compile, benchmarkCompileRow("speedup"))).toEqual(["Cpp"]);
    expect(compileBest(compile, benchmarkCompileRow("memory"))).toEqual(["Go"]);
    // The C# JIT assembly is smaller, but is not ranked.
    expect(compileBest(compile, benchmarkCompileRow("executable"))).toEqual(["CSharpAot"]);
    expect(compileBest(compile, benchmarkCompileRow("lines"))).toEqual([]);
  });

  it("compares Rux with the others with above 1 meaning Rux is ahead, either way round", () => {
    const clean = compileComparison(compile, benchmarkCompileRow("clean"))!;
    expect(clean).toMatchObject({ rivals: ["Go"], rank: 1, field: 8 });
    expect(formatRatio(clean.ratio)).toBe("2.57×");
    const speed = compileComparison(compile, benchmarkCompileRow("speed"))!;
    expect(speed).toMatchObject({ rivals: ["Go"], rank: 1 });
    expect(formatRatio(speed.ratio)).toBe("2.58×");
    const speedup = compileComparison(compile, benchmarkCompileRow("speedup"))!;
    expect(speedup.rivals).toEqual(["Cpp"]);
    expect(speedup.ratio).toBeLessThan(1);
    expect(speedup.rank).toBe(4);
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
    return mount(BenchmarkDotPlot, { props: { run: apps, metric, compare: "Cpp" } });
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
    expect(live()).toBe("Sha512, Rux: 0.597 s");
    await chart.trigger("keydown", { key: "Home" });
    expect(live()).toBe("Sha512, Rust: 0.578 s, 0.97× Rux");
    await chart.trigger("keydown", { key: "ArrowDown" });
    expect(live()).toBe("Mandelbrot, Rust: 0.882 s, 1.00× Rux");
    await chart.trigger("keydown", { key: "End" });
    expect(live()).toBe("Mandelbrot, C# JIT: 0.944 s, 1.07× Rux");
    expect(wrapper.text()).toContain("min 0.");
    await chart.trigger("keydown", { key: "Escape" });
    expect(live()).toBe("");
  });
});

describe("BenchmarkTable", () => {
  it("prints medians with the best value in each row bold", () => {
    const wrapper = mount(BenchmarkTable, {
      props: { run: apps, metric: "execution", relative: false, compare: "Rust" },
    });
    const first = wrapper.findAll("tbody tr")[0]!;
    expect(first.text()).toContain("Sha512");
    expect(first.text()).toContain("0.597");
    expect(first.get(".font-semibold").text()).toBe("0.578");
    expect(wrapper.find("tfoot").exists()).toBe(false);
  });

  it("adds the geometric mean in the relative view", () => {
    const wrapper = mount(BenchmarkTable, {
      props: { run: apps, metric: "memory", relative: true, compare: "Rust" },
    });
    const footer = wrapper.get("tfoot").text();
    expect(footer).toContain("Geometric mean");
    expect(footer).toContain("4.29×");
  });

  it("shows the JIT executables in italics, unranked", () => {
    const wrapper = mount(BenchmarkTable, {
      props: { run: apps, metric: "executable", relative: false, compare: "Rust" },
    });
    const first = wrapper.findAll("tbody tr")[0]!;
    expect(first.findAll(".italic").map((cell) => cell.text())).toEqual(["7", "3"]);
    expect(first.get(".font-semibold").text()).toBe("87");
    expect(wrapper.text()).toContain("not ranked");
  });

  it("marks a failed case instead of dropping the cell", () => {
    const failed: BenchmarkAppRun = structuredClone(apps);
    failed.metrics.execution.cells.Sort!.Go = null;
    const wrapper = mount(BenchmarkTable, {
      props: { run: failed, metric: "execution", relative: false, compare: "Rust" },
    });
    expect(wrapper.get(".text-error").text()).toBe("FAIL");
  });
});

describe("BenchmarkSummary", () => {
  it("tints cells away from 1.00× and opens a metric on request", async () => {
    const wrapper = mount(BenchmarkSummary, { props: { run: apps } });
    const rows = wrapper.findAll("tbody tr");
    expect(rows).toHaveLength(7);
    const memory = rows[2]!;
    expect(memory.text()).toContain("Peak memory");
    const cells = memory.findAll("td");
    expect(cells[0]!.attributes("data-tone")).toBeUndefined();
    expect(cells[7]!.text()).toBe("4.29×");
    expect(cells[7]!.attributes("data-tone")).toBe("ahead");
    // C++ beats Rux on execution time.
    expect(rows[0]!.findAll("td")[2]!.attributes("data-tone")).toBe("behind");
    expect(rows[4]!.text()).toContain("Compile memory");
    expect(rows[5]!.findAll("td")[5]!.text()).toBe("—");

    await memory.get("button").trigger("click");
    expect(wrapper.emitted("select")).toEqual([["memory"]]);
  });
});

describe("BenchmarkBars", () => {
  function bars(key: string) {
    return mount(BenchmarkBars, { props: { run: compile, row: benchmarkCompileRow(key), compare: "Go" } });
  }

  it("draws a bar per language, best first, whichever way the row is better", () => {
    const clean = bars("clean");
    const labels = (wrapper: ReturnType<typeof bars>) =>
      wrapper.findAll(".h-8 > span:first-child").map((label) => label.text());
    expect(labels(clean)).toEqual(["Rux", "Go", "Java JIT", "C# AOT", "C# JIT", "Rust", "C++", "Java AOT"]);
    expect(clean.findAll(".bg-\\(--bench-rux\\)")).toHaveLength(1);
    expect(clean.findAll(".bg-\\(--bench-compare\\)")).toHaveLength(1);
    expect(clean.get('[role="group"]').attributes("aria-label")).toContain("lower is better");
    expect(clean.get('[role="group"]').attributes("aria-label")).toContain("Rux is 1 of 8");

    const speedup = bars("speedup");
    expect(labels(speedup)[0]).toBe("C++");
    expect(speedup.get('[role="group"]').attributes("aria-label")).toContain("higher is better");
  });

  it("announces each bar from the keyboard with the spread of its builds", async () => {
    const wrapper = bars("clean");
    const chart = wrapper.get('[role="group"]');
    const live = () => wrapper.get('[aria-live="polite"]').text();
    await chart.trigger("keydown", { key: "ArrowDown" });
    expect(live()).toMatch(/^Rux: 1\.14 s; min 1\.13, ±0\.00, 3 builds$/);
    await chart.trigger("keydown", { key: "ArrowDown" });
    expect(live()).toMatch(/^Go: 2\.93 s, 2\.57× Rux; min /);
    await chart.trigger("keydown", { key: "Escape" });
    expect(live()).toBe("");
  });
});

describe("BenchmarkCompileTable", () => {
  it("prints every row of the report with the best value bold, either way round", () => {
    const wrapper = mount(BenchmarkCompileTable, {
      props: { run: compile, relative: false, compare: "Go", selected: "speed" },
    });
    const row = (key: string) => wrapper.get(`[data-row="${key}"]`);
    expect(wrapper.findAll("tbody tr")).toHaveLength(18);
    expect(row("clean").get(".font-semibold").text()).toBe("1.14");
    expect(row("speed").get(".font-semibold").text()).toBe("98,200");
    expect(row("speed").text()).toContain("higher is better");
    expect(row("speed").classes()).toContain("bg-elevated/40");
    expect(row("speedup").get(".font-semibold").text()).toBe("6.27×");
    expect(
      row("executable")
        .findAll(".italic")
        .map((cell) => cell.text()),
    ).toEqual(["1,137", "2,122"]);
    expect(row("lines").find(".font-semibold").exists()).toBe(false);
  });

  it("switches to ratios and leaves out the source size", () => {
    const wrapper = mount(BenchmarkCompileTable, { props: { run: compile, relative: true, compare: "Go" } });
    expect(wrapper.findAll("tbody tr")).toHaveLength(16);
    expect(wrapper.get('[data-row="rebuild"]').text()).toContain("103×");
  });

  it("marks a failed build", () => {
    const failed: BenchmarkCompileRun = structuredClone(compile);
    failed.metrics.clean!.cells.Large!.Go = null;
    const wrapper = mount(BenchmarkCompileTable, { props: { run: failed, relative: false, compare: "Go" } });
    expect(wrapper.get('[data-row="clean"] .text-error').text()).toBe("FAIL");
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

  afterEach(() => {
    vi.unstubAllGlobals();
    delete benchmarkMachines[0]!.compile;
    benchmarkMachines[0]!.compile = firstCompile;
  });

  const firstCompile = benchmarkMachines[0]!.compile;
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
    BenchmarkSummary: { props: ["run"], template: "<div data-summary />" },
    BenchmarkCompare: { props: ["modelValue", "options"], template: "<div data-compare />" },
    BenchmarkDotPlot: { name: "BenchmarkDotPlot", props: ["run", "metric", "compare"], template: "<div />" },
    BenchmarkTable: { name: "BenchmarkTable", props: ["run", "metric", "relative", "compare"], template: "<div />" },
    BenchmarkBars: { name: "BenchmarkBars", props: ["run", "row", "compare"], template: "<div />" },
    BenchmarkCompileTable: {
      name: "BenchmarkCompileTable",
      props: ["run", "relative", "compare", "selected"],
      template: "<div />",
    },
  };

  async function render() {
    const Page = (await import("../app/pages/benchmarks.vue")).default;
    const wrapper = mount(Page, { global: { stubs } });
    await nextTick();
    return wrapper;
  }

  it("renders the first machine with both benchmarks, their headline figures and methodology", async () => {
    const wrapper = await render();
    const text = wrapper.text();
    expect(text).toContain("Benchmarks");
    expect(text).toContain("Benchmark 1 of 2");
    expect(text).toContain("Benchmark 2 of 2");
    expect(wrapper.get("#programs").text()).toContain("Program benchmark");
    expect(wrapper.get("#compile").text()).toContain("Compile benchmark");
    expect(text).toContain("Running ten programs");
    expect(text).toContain("Compiling a 100,000-line project");
    expect(text).toContain("Intel(R) Core(TM) i9-11900KF");
    expect(text).toContain("Windows 11 (build 26300)");
    expect(text).toContain("64 GiB");
    expect(text).toContain("Rux is pre-1.0");
    expect(text).not.toContain("optimiz");
    expect(text).toContain("Fannkuch");
    expect(wrapper.find("#methodology").exists()).toBe(true);

    const plot = wrapper.getComponent({ name: "BenchmarkDotPlot" });
    expect(plot.props("metric")).toBe("execution");
    expect(plot.props("compare")).toBe("Rust");
    const bars = wrapper.getComponent({ name: "BenchmarkBars" });
    expect(bars.props("row").key).toBe("clean");
    expect(bars.props("compare")).toBe("Rust");
  });

  it("says so when a machine has not run one of the benchmarks", async () => {
    delete benchmarkMachines[0]!.compile;
    const wrapper = await render();
    expect(wrapper.get("#compile").element.closest("section")!.textContent).toContain(
      "The compile benchmark has not been run on this machine yet.",
    );
    expect(wrapper.findComponent({ name: "BenchmarkBars" }).exists()).toBe(false);
    expect(wrapper.text()).not.toContain("Compiling a 100,000-line project");
    expect(wrapper.text()).toContain("Not run yet");
  });
});
