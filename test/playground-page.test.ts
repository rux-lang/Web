import { flushPromises, mount } from "@vue/test-utils";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { nextTick, ref } from "vue";
import type { PlaygroundMode } from "../app/types/playground";
import { defaultPlaygroundLimits } from "../app/utils/playground";
import { playgroundExample, playgroundExamples } from "../app/utils/playground-examples";

/**
 * The page's run state machine, which is the one part of the playground that is
 * not a pure function or a presentational component: one request at a time,
 * abort on re-run, and the split between a compiler diagnostic and a transport
 * fault.
 */
const post = vi.fn();
const get = vi.fn();
const focusLine = vi.fn();

function ranPayload(stdout: string) {
  return {
    data: {
      build: { success: true, diagnostics: "", diagnostics_truncated: false, duration_ms: 12 },
      program: {
        stdout,
        stdout_truncated: false,
        stderr: "",
        stderr_truncated: false,
        exit_code: 0,
        signal: null,
        timed_out: false,
        duration_ms: 3,
      },
    },
  };
}

function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

const stubs = {
  UContainer: { template: "<div><slot /></div>" },
  UAlert: {
    props: ["title", "description"],
    template: `<div data-alert><span data-alert-title>{{ title }}</span>{{ description }}</div>`,
  },
  UCollapsible: {
    props: ["open"],
    template: `<div data-collapsible :data-open="String(!!open)"><slot /><slot name="content" /></div>`,
  },
  UButton: { props: ["label"], template: `<button>{{ label }}</button>` },
  UFormField: { template: "<div><slot /></div>" },
  UTextarea: {
    props: ["modelValue"],
    emits: ["update:modelValue"],
    template: `<textarea :value="modelValue" @input="$emit('update:modelValue', $event.target.value)" />`,
  },
  PlaygroundToolbar: {
    name: "PlaygroundToolbar",
    props: ["examples", "pending", "disabled", "profile", "example"],
    emits: ["submit", "update:profile", "update:example"],
    template: `<div data-toolbar />`,
  },
  PlaygroundCodeEditor: {
    name: "PlaygroundCodeEditor",
    props: ["modelValue", "label", "placeholder"],
    emits: ["update:modelValue", "run"],
    methods: { focusLine },
    template: `<div data-editor />`,
  },
  PlaygroundOutput: {
    name: "PlaygroundOutput",
    props: ["result", "failure", "limits", "pending"],
    emits: ["retry", "goToLine"],
    template: `<div data-output />`,
  },
};

async function mountPage() {
  const Page = (await import("../app/pages/playground.vue")).default;
  const wrapper = mount(Page, { global: { stubs } });
  await nextTick();
  return wrapper;
}

type Wrapper = Awaited<ReturnType<typeof mountPage>>;

const toolbarOf = (wrapper: Wrapper) => wrapper.getComponent({ name: "PlaygroundToolbar" });
const editorOf = (wrapper: Wrapper) => wrapper.getComponent({ name: "PlaygroundCodeEditor" });
const outputOf = (wrapper: Wrapper) => wrapper.getComponent({ name: "PlaygroundOutput" });

async function submit(wrapper: Wrapper, mode: PlaygroundMode) {
  toolbarOf(wrapper).vm.$emit("submit", mode);
  await flushPromises();
}

const hello = playgroundExample("hello")!;
const circle = playgroundExample("circle")!;

describe("playground page", () => {
  beforeEach(() => {
    post.mockReset();
    get.mockReset();
    focusLine.mockReset();
    vi.stubGlobal("definePageMeta", vi.fn());
    vi.stubGlobal("useSeoMeta", vi.fn());
    vi.stubGlobal("useHead", vi.fn());
    vi.stubGlobal("useRegistryApi", () => ({ get, post }));
    vi.stubGlobal("useLazyAsyncData", () => ({ data: ref({ data: defaultPlaygroundLimits }) }));
  });

  afterEach(() => vi.unstubAllGlobals());

  it("opens on the first example with the input pane shut", async () => {
    const wrapper = await mountPage();

    expect(toolbarOf(wrapper).props("examples")).toEqual(playgroundExamples);
    expect(toolbarOf(wrapper).props("example")).toBe("hello");
    expect(editorOf(wrapper).props("modelValue")).toBe(hello.source);
    expect(wrapper.get("[data-collapsible]").attributes("data-open")).toBe("false");
    expect(outputOf(wrapper).props("result")).toBeNull();
  });

  it("passes the sandbox's limits through to the output panel", async () => {
    const wrapper = await mountPage();

    expect(outputOf(wrapper).props("limits")).toEqual(defaultPlaygroundLimits);
  });

  it("opens the input pane for an example that reads standard input", async () => {
    const wrapper = await mountPage();
    post.mockResolvedValue(ranPayload("hi\n"));
    await submit(wrapper, "run");
    expect(outputOf(wrapper).props("result")).not.toBeNull();

    toolbarOf(wrapper).vm.$emit("update:example", "circle");
    await nextTick();

    expect(editorOf(wrapper).props("modelValue")).toBe(circle.source);
    expect(wrapper.get("textarea").element.value).toBe(circle.stdin);
    expect(wrapper.get("[data-collapsible]").attributes("data-open")).toBe("true");
    // A new program's result has nothing to do with the last one's.
    expect(outputOf(wrapper).props("result")).toBeNull();
  });

  it("posts the buffer with the chosen mode and profile", async () => {
    const wrapper = await mountPage();
    post.mockResolvedValue(ranPayload("Hello, World!\n"));

    await submit(wrapper, "run");
    expect(post).toHaveBeenCalledWith(
      "/v1/playground/run",
      { mode: "run", profile: "debug", source: hello.source, stdin: "" },
      expect.any(AbortSignal),
    );
    expect(outputOf(wrapper).props("result")?.program?.stdout).toBe("Hello, World!\n");

    toolbarOf(wrapper).vm.$emit("update:profile", "release");
    await nextTick();
    await submit(wrapper, "build");

    expect(post.mock.calls[1]?.[1]).toMatchObject({ mode: "build", profile: "release" });
  });

  it("marks the action in flight and clears it when the run lands", async () => {
    const wrapper = await mountPage();
    const pendingRun = deferred<unknown>();
    post.mockReturnValueOnce(pendingRun.promise);

    toolbarOf(wrapper).vm.$emit("submit", "run");
    await nextTick();
    expect(toolbarOf(wrapper).props("pending")).toBe("run");
    expect(outputOf(wrapper).props("pending")).toBe(true);

    pendingRun.resolve(ranPayload("done\n"));
    await flushPromises();
    expect(toolbarOf(wrapper).props("pending")).toBeNull();
  });

  it("rewrites the buffer with the formatted source", async () => {
    const wrapper = await mountPage();
    post.mockResolvedValue({
      data: {
        build: { success: true, diagnostics: "", diagnostics_truncated: false, duration_ms: 4 },
        formatted: "func Main() -> int {}\n",
      },
    });

    await submit(wrapper, "fmt");

    expect(editorOf(wrapper).props("modelValue")).toBe("func Main() -> int {}\n");
  });

  it("aborts the run in flight rather than racing it", async () => {
    const wrapper = await mountPage();
    const first = deferred<unknown>();
    post.mockReturnValueOnce(first.promise);

    toolbarOf(wrapper).vm.$emit("submit", "run");
    await nextTick();
    const firstSignal = post.mock.calls[0]?.[2] as AbortSignal;

    post.mockResolvedValueOnce(ranPayload("second\n"));
    await submit(wrapper, "run");

    expect(firstSignal.aborted).toBe(true);
    expect(outputOf(wrapper).props("result")?.program?.stdout).toBe("second\n");

    // The abandoned request answering late must not overwrite the run that
    // replaced it.
    first.resolve(ranPayload("first\n"));
    await flushPromises();
    expect(outputOf(wrapper).props("result")?.program?.stdout).toBe("second\n");
  });

  it("surfaces a transport fault and retries the same mode", async () => {
    const wrapper = await mountPage();
    post.mockRejectedValueOnce(new Error("offline"));

    await submit(wrapper, "build");
    expect(outputOf(wrapper).props("failure")).toMatchObject({
      title: "Unable to reach the registry",
      retryable: true,
    });

    post.mockResolvedValueOnce(ranPayload(""));
    outputOf(wrapper).vm.$emit("retry");
    await flushPromises();

    expect(post.mock.calls[1]?.[1]).toMatchObject({ mode: "build" });
    expect(outputOf(wrapper).props("failure")).toBeNull();
  });

  it("reports a body it cannot read as a retryable fault rather than throwing", async () => {
    const wrapper = await mountPage();
    post.mockResolvedValue({ data: { build: "nonsense" } });

    await submit(wrapper, "run");

    expect(outputOf(wrapper).props("failure")).toMatchObject({ title: "Unexpected response", retryable: true });
    expect(outputOf(wrapper).props("result")).toBeNull();
  });

  it("refuses an empty buffer without a round trip", async () => {
    const wrapper = await mountPage();
    editorOf(wrapper).vm.$emit("update:modelValue", "   \n");
    await nextTick();

    expect(toolbarOf(wrapper).props("disabled")).toBe(true);

    await submit(wrapper, "run");
    expect(post).not.toHaveBeenCalled();
    expect(wrapper.get("[data-alert-title]").text()).toBe("The submission was not sent");
  });

  it("moves the editor cursor to a diagnostic's line", async () => {
    const wrapper = await mountPage();
    outputOf(wrapper).vm.$emit("goToLine", 4, 9);
    await nextTick();

    expect(focusLine).toHaveBeenCalledWith(4, 9);
  });

  it("runs from the editor's own keyboard shortcut", async () => {
    const wrapper = await mountPage();
    post.mockResolvedValue(ranPayload("hi\n"));

    editorOf(wrapper).vm.$emit("run");
    await flushPromises();

    expect(post.mock.calls[0]?.[1]).toMatchObject({ mode: "run" });
  });
});
