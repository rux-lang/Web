import { mount } from "@vue/test-utils";
import { describe, expect, it, vi } from "vitest";
import { nextTick, ref } from "vue";
import CodeEditor from "../app/components/playground/CodeEditor.vue";

const colorMode = ref("light");
vi.stubGlobal("useColorMode", () => colorMode);

function mountEditor(props: Record<string, unknown> = {}) {
  return mount(CodeEditor, {
    props: { modelValue: "func Main() -> int {}\n", ...props },
    attachTo: document.body,
    global: {
      stubs: {
        // The real ClientOnly renders nothing on the server; in a test the
        // editor is the whole point, so render the default slot.
        ClientOnly: { template: "<div><slot /></div>" },
        USkeleton: true,
      },
    },
  });
}

describe("playground code editor", () => {
  it("mounts a labelled, editable CodeMirror buffer", () => {
    const wrapper = mountEditor();
    const content = wrapper.get(".cm-content");

    expect(content.attributes("aria-label")).toBe("Rux source code");
    expect(content.attributes("contenteditable")).toBe("true");
    expect(wrapper.get(".cm-gutters").exists()).toBe(true);
    expect(wrapper.text()).toContain("func Main()");

    wrapper.unmount();
  });

  it("stops being editable when readonly", () => {
    const wrapper = mountEditor({ readonly: true });

    expect(wrapper.get(".cm-content").attributes("contenteditable")).toBe("false");

    wrapper.unmount();
  });

  it("replaces the document when the bound value changes elsewhere", async () => {
    const wrapper = mountEditor();
    await wrapper.setProps({ modelValue: "// formatted\n" });

    expect(wrapper.get(".cm-content").text()).toContain("// formatted");
    // An external replacement must not echo back as an update, which would
    // fight the parent over the value on every keystroke.
    expect(wrapper.emitted("update:modelValue")).toBeUndefined();

    wrapper.unmount();
  });

  it("swaps the theme in place when the colour mode flips", async () => {
    const wrapper = mountEditor();
    const editor = wrapper.get(".cm-editor").element;
    const before = editor.className;

    colorMode.value = "dark";
    await nextTick();

    expect(editor.className).not.toBe(before);
    // Same element: reconfiguring a compartment keeps the selection, the scroll
    // position and the undo history that rebuilding the view would discard.
    expect(wrapper.get(".cm-editor").element).toBe(editor);

    colorMode.value = "light";
    await nextTick();
    expect(editor.className).toBe(before);

    wrapper.unmount();
  });

  it("emits run on Ctrl-Enter without inserting a newline", async () => {
    const wrapper = mountEditor();
    const content = wrapper.get(".cm-content");

    await content.trigger("keydown", { key: "Enter", ctrlKey: true });

    expect(wrapper.emitted("run")).toHaveLength(1);
    expect(wrapper.emitted("update:modelValue")).toBeUndefined();

    wrapper.unmount();
  });
});
