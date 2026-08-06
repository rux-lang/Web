import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import PlaygroundOutput from "../app/components/playground/PlaygroundOutput.vue";
import PlaygroundToolbar from "../app/components/playground/PlaygroundToolbar.vue";
import type { ApiFailure } from "../app/types/api";
import type { PlaygroundExample, PlaygroundLimits, PlaygroundResult } from "../app/types/playground";
import { defaultPlaygroundLimits } from "../app/utils/playground";

/**
 * Minimal inline stubs for the Nuxt UI components, following the repo's
 * existing component tests: the assertions are about behaviour and the
 * accessible surface, not about Nuxt UI's markup.
 */
const stubs = {
  UButton: {
    props: ["label", "loading", "disabled"],
    emits: ["click"],
    template: `<button :disabled="disabled" :data-loading="String(!!loading)" @click="$emit('click')">{{ label }}<slot /></button>`,
  },
  UBadge: { props: ["label"], template: `<span data-badge>{{ label }}</span>` },
  UIcon: { props: ["name"], template: `<i :data-icon="name"></i>` },
  UAlert: {
    props: ["title", "description", "color", "icon"],
    template: `<div data-alert :data-color="color" :data-icon="icon">
      <span data-alert-title>{{ title }}</span><span data-alert-description>{{ description }}</span><slot name="actions" />
    </div>`,
  },
  UEmpty: {
    props: ["title", "description"],
    template: `<div data-empty><span data-empty-title>{{ title }}</span><span>{{ description }}</span></div>`,
  },
  UTooltip: { template: `<div><slot /></div>` },
  USelect: {
    props: ["modelValue", "items"],
    emits: ["update:modelValue"],
    template: `<select :value="modelValue" @change="$emit('update:modelValue', $event.target.value)">
      <option v-for="item in items" :key="item.value" :value="item.value">{{ item.label }}</option>
    </select>`,
  },
  USwitch: {
    props: ["modelValue", "label", "disabled"],
    emits: ["update:modelValue"],
    template: `<button data-switch :disabled="disabled" :aria-pressed="String(!!modelValue)" @click="$emit('update:modelValue', !modelValue)">{{ label }}</button>`,
  },
  // Renders every panel at once so a single mount can assert across tabs, while
  // still reporting which tab the component thinks is active.
  UTabs: {
    props: ["items", "modelValue"],
    emits: ["update:modelValue"],
    template: `<div :data-active-tab="modelValue">
      <div v-for="item in items" :key="item.value" :data-panel="item.value">
        <span v-if="item.badge" data-tab-badge>{{ item.badge.label }}</span>
        <slot :name="item.slot" />
      </div>
    </div>`,
  },
  AppLoadingState: { props: ["label"], template: `<div data-loading-state>{{ label }}</div>` },
  ApiProblemAlert: {
    props: ["failure"],
    emits: ["retry"],
    template: `<div data-problem>{{ failure.title }}<button data-retry @click="$emit('retry')"></button></div>`,
  },
};

const examples: PlaygroundExample[] = [
  { value: "hello", label: "Hello", icon: "i-lucide-message-circle", description: "Prints", source: "a", stdin: "" },
  { value: "circle", label: "Circle", icon: "i-lucide-circle", description: "Reads input", source: "b", stdin: "2\n" },
];

function mountToolbar(props: Record<string, unknown> = {}) {
  return mount(PlaygroundToolbar, {
    props: { examples, profile: "debug", example: "hello", ...props },
    global: { stubs },
  });
}

const succeededBuild = { success: true, diagnostics: "", diagnostics_truncated: false, duration_ms: 120 };

const ranProgram = {
  stdout: "Hello World\n",
  stdout_truncated: false,
  stderr: "",
  stderr_truncated: false,
  exit_code: 0,
  signal: null,
  timed_out: false,
  duration_ms: 7,
};

const succeeded: PlaygroundResult = { build: succeededBuild, program: ranProgram, formatted: null };

function mountOutput(props: Record<string, unknown> = {}) {
  return mount(PlaygroundOutput, {
    props: { limits: defaultPlaygroundLimits, ...props },
    global: { stubs },
  });
}

function panel(wrapper: ReturnType<typeof mountOutput>, name: string) {
  return wrapper.get(`[data-panel="${name}"]`);
}

describe("playground toolbar", () => {
  it("labels itself as a group of actions rather than claiming to be a toolbar", () => {
    const wrapper = mountToolbar();
    const group = wrapper.get('[role="group"]');

    expect(group.attributes("aria-label")).toBe("Playground actions");
  });

  it("carries the mode of the button that was pressed", async () => {
    const wrapper = mountToolbar();
    const buttons = wrapper.findAll("button").filter((button) => button.attributes("data-switch") === undefined);

    for (const button of buttons) await button.trigger("click");

    expect(wrapper.emitted("submit")).toEqual([["fmt"], ["build"], ["run"]]);
  });

  it("spins only the action in flight and locks the rest", () => {
    const wrapper = mountToolbar({ pending: "run" });
    const actions = wrapper.findAll("button").filter((button) => button.attributes("data-switch") === undefined);

    expect(actions.map((button) => button.attributes("data-loading"))).toEqual(["false", "false", "true"]);
    expect(actions.every((button) => button.attributes("disabled") !== undefined)).toBe(true);
  });

  it("submits nothing while an empty buffer disables it", async () => {
    const wrapper = mountToolbar({ disabled: true });

    for (const button of wrapper.findAll("button")) await button.trigger("click");

    expect(wrapper.emitted("submit")).toBeUndefined();
  });

  it("flips between the debug and release profiles", async () => {
    const wrapper = mountToolbar();
    await wrapper.get("[data-switch]").trigger("click");

    expect(wrapper.emitted("update:profile")).toEqual([["release"]]);

    const release = mountToolbar({ profile: "release" });
    expect(release.get("[data-switch]").attributes("aria-pressed")).toBe("true");
    await release.get("[data-switch]").trigger("click");
    expect(release.emitted("update:profile")).toEqual([["debug"]]);
  });

  it("offers the gallery it was given", async () => {
    const wrapper = mountToolbar();

    expect(wrapper.findAll("option").map((option) => option.text())).toEqual(["Hello", "Circle"]);

    await wrapper.get("select").setValue("circle");
    expect(wrapper.emitted("update:example")).toEqual([["circle"]]);
  });
});

describe("playground output", () => {
  it("says nothing has run yet before the first run", () => {
    const wrapper = mountOutput();

    expect(panel(wrapper, "output").get("[data-empty-title]").text()).toBe("Nothing has run yet");
    expect(wrapper.find("[data-loading-state]").exists()).toBe(false);
  });

  it("shows a loading state only when there is no result to keep on screen", async () => {
    const wrapper = mountOutput({ pending: true });
    expect(panel(wrapper, "output").get("[data-loading-state]").text()).toBe("Running your program");

    await wrapper.setProps({ result: succeeded, pending: true });
    expect(wrapper.find("[data-loading-state]").exists()).toBe(false);
    expect(panel(wrapper, "output").text()).toContain("Hello World");
    expect(wrapper.get("section").attributes("aria-busy")).toBe("true");
  });

  it("separates the two streams by heading, not by colour alone", async () => {
    const wrapper = mountOutput({
      result: { ...succeeded, program: { ...ranProgram, stderr: "warning: slow\n" } },
    });
    const output = panel(wrapper, "output");

    expect(output.text()).toContain("Standard output");
    expect(output.text()).toContain("Standard error");
    expect(output.findAll("pre").map((block) => block.text())).toEqual(["Hello World", "warning: slow"]);

    await wrapper.setProps({ result: { ...succeeded, program: { ...ranProgram, stdout: "" } } });
    expect(panel(wrapper, "output").text()).toContain("The program produced no output.");
  });

  it("tells a timeout apart from a crash and from a clean exit", async () => {
    const wrapper = mountOutput({ result: succeeded });
    expect(panel(wrapper, "output").get("[data-alert-title]").text()).toBe("Exited cleanly");

    await wrapper.setProps({ result: { ...succeeded, program: { ...ranProgram, timed_out: true, exit_code: null } } });
    const timedOut = panel(wrapper, "output").get("[data-alert]");
    expect(timedOut.get("[data-alert-title]").text()).toBe("Timed out");
    expect(timedOut.attributes("data-color")).toBe("warning");

    await wrapper.setProps({ result: { ...succeeded, program: { ...ranProgram, exit_code: null, signal: 9 } } });
    expect(panel(wrapper, "output").get("[data-alert-title]").text()).toBe("Killed by signal 9");

    await wrapper.setProps({ result: { ...succeeded, program: { ...ranProgram, exit_code: 2 } } });
    expect(panel(wrapper, "output").get("[data-alert-title]").text()).toBe("Exited with code 2");
  });

  it("reports truncation against the server's cap", async () => {
    const limits: PlaygroundLimits = { ...defaultPlaygroundLimits, max_output_bytes: 8192 };
    const wrapper = mountOutput({
      limits,
      result: { ...succeeded, program: { ...ranProgram, stdout_truncated: true } },
    });

    expect(panel(wrapper, "output").text()).toContain("Standard output stops at the 8 KiB per-stream output limit.");
  });

  it("keeps a failed compile out of the problem alert and moves to the Build tab", async () => {
    const wrapper = mountOutput();
    expect(wrapper.get("[data-active-tab]").attributes("data-active-tab")).toBe("output");

    await wrapper.setProps({
      result: {
        build: {
          success: false,
          diagnostics: "/job/main.rux:4:9: error: unknown identifier 'Foo'\n/job/main.rux:2:5: note: declared here\n",
          diagnostics_truncated: false,
          duration_ms: 41,
        },
        program: null,
        formatted: null,
      },
    });

    expect(wrapper.find("[data-problem]").exists()).toBe(false);
    expect(wrapper.get("[data-active-tab]").attributes("data-active-tab")).toBe("build");
    expect(wrapper.get("[data-tab-badge]").text()).toBe("1");

    const build = panel(wrapper, "build");
    expect(build.text()).toContain("1 error, 0 warnings");
    expect(build.text()).toContain("unknown identifier 'Foo'");
    expect(build.text()).toContain("declared here");
    expect(panel(wrapper, "output").text()).toContain("The build failed, so nothing ran");
  });

  it("emits the line a diagnostic points at", async () => {
    const wrapper = mountOutput({
      result: {
        build: {
          success: false,
          diagnostics: "/job/main.rux:4:9: error: type mismatch\n/job/main.rux:2:5: note: declared here\n",
          diagnostics_truncated: false,
          duration_ms: 41,
        },
        program: null,
        formatted: null,
      },
    });

    const locations = panel(wrapper, "build").findAll("button");
    expect(locations.map((button) => button.text())).toEqual(["Line 4:9", "Line 2:5"]);

    await locations[0]?.trigger("click");
    await locations[1]?.trigger("click");
    expect(wrapper.emitted("goToLine")).toEqual([
      [4, 9],
      [2, 5],
    ]);
  });

  it("falls back to raw text when nothing parses", () => {
    const wrapper = mountOutput({
      result: {
        build: { success: false, diagnostics: "linker exploded", diagnostics_truncated: false, duration_ms: 3 },
        program: null,
        formatted: null,
      },
    });

    expect(panel(wrapper, "build").get("pre").text()).toBe("linker exploded");
  });

  it("confirms a build-only run and a format without pretending a program ran", async () => {
    const wrapper = mountOutput({ result: { build: succeededBuild, program: null, formatted: null } });
    expect(panel(wrapper, "output").get("[data-alert-title]").text()).toBe("Compiled without running");

    await wrapper.setProps({ result: { build: succeededBuild, program: null, formatted: "func Main() {}\n" } });
    expect(panel(wrapper, "output").get("[data-alert-title]").text()).toBe("Formatting applied");
  });

  it("routes a transport fault through the problem alert and offers a retry", async () => {
    const failure: ApiFailure = {
      title: "Unable to reach the registry",
      detail: "Check your connection and try again.",
      errors: [],
      retryable: true,
    };
    const wrapper = mountOutput({ failure });

    expect(wrapper.get("[data-problem]").text()).toContain("Unable to reach the registry");
    await wrapper.get("[data-retry]").trigger("click");
    expect(wrapper.emitted("retry")).toHaveLength(1);
  });

  it("reports the sandbox's own limits rather than restating them", async () => {
    const wrapper = mountOutput({
      limits: { ...defaultPlaygroundLimits, compile_timeout_seconds: 9, cpu_millis: 1500 },
      result: succeeded,
    });
    const details = panel(wrapper, "details");

    expect(details.text()).toContain("9 s");
    expect(details.text()).toContain("1.5 cores");
    expect(details.text()).toContain("128 MiB");
    expect(details.text()).toContain("7 ms");

    await wrapper.setProps({ limits: null });
    expect(panel(wrapper, "details").text()).toContain("The sandbox has not reported its limits.");
  });
});
