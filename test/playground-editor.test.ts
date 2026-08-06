import { mount } from "@vue/test-utils";
import { describe, expect, it, vi } from "vitest";
import { nextTick, ref } from "vue";
import CodeEditor from "../app/components/playground/CodeEditor.vue";

const colorMode = ref("light");
vi.stubGlobal("useColorMode", () => colorMode);

async function mountEditor(props: Record<string, unknown> = {}) {
  const wrapper = mount(CodeEditor, {
    props: { modelValue: "func Main() -> int {}\n", ...props },
    attachTo: document.body,
    global: {
      stubs: {
        // Reproduces the real ClientOnly: the default slot appears only after
        // its own onMounted, which runs *after* this component's. A stub that
        // rendered the slot straight away would hide the fact that the editor's
        // host element does not exist yet at that point.
        ClientOnly: {
          data: () => ({ ready: false }),
          mounted() {
            (this as unknown as { ready: boolean }).ready = true;
          },
          template: `<div><slot v-if="ready" /><slot v-else name="fallback" /></div>`,
        },
        USkeleton: true,
      },
    },
  });

  await nextTick();
  return wrapper;
}

describe("playground code editor", () => {
  it("mounts a labelled, editable CodeMirror buffer", async () => {
    const wrapper = await mountEditor();
    const content = wrapper.get(".cm-content");

    expect(content.attributes("aria-label")).toBe("Rux source code");
    expect(content.attributes("contenteditable")).toBe("true");
    expect(wrapper.get(".cm-gutters").exists()).toBe(true);
    expect(wrapper.text()).toContain("func Main()");

    wrapper.unmount();
  });

  it("stops being editable when readonly", async () => {
    const wrapper = await mountEditor({ readonly: true });

    expect(wrapper.get(".cm-content").attributes("contenteditable")).toBe("false");

    wrapper.unmount();
  });

  it("replaces the document when the bound value changes elsewhere", async () => {
    const wrapper = await mountEditor();
    await wrapper.setProps({ modelValue: "// formatted\n" });

    expect(wrapper.get(".cm-content").text()).toContain("// formatted");
    // An external replacement must not echo back as an update, which would
    // fight the parent over the value on every keystroke.
    expect(wrapper.emitted("update:modelValue")).toBeUndefined();

    wrapper.unmount();
  });

  it("swaps the theme in place when the colour mode flips", async () => {
    const wrapper = await mountEditor();
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
    const wrapper = await mountEditor();
    const content = wrapper.get(".cm-content");

    await content.trigger("keydown", { key: "Enter", ctrlKey: true });

    expect(wrapper.emitted("run")).toHaveLength(1);
    expect(wrapper.emitted("update:modelValue")).toBeUndefined();

    wrapper.unmount();
  });
});
