<script setup lang="ts">
/**
 * The playground's CodeMirror 6 buffer.
 *
 * A thin wrapper on purpose: the mode and both colour schemes live in
 * `~/utils/rux-language`, and everything this component adds is the editor's
 * lifecycle — mount, keep `v-model` and the document in step, swap the theme
 * with the site's colour mode, and tear down.
 *
 * CodeMirror measures and mutates `document`, so the whole thing sits inside
 * `<ClientOnly>`. Prerendering would otherwise fail on a static build, and the
 * fallback below is what holds the two-pane layout's left column open until the
 * client takes over.
 */
import { defaultKeymap, history, historyKeymap, indentWithTab } from "@codemirror/commands";
import { bracketMatching, indentUnit } from "@codemirror/language";
import { Compartment, EditorState } from "@codemirror/state";
import {
  EditorView,
  drawSelection,
  highlightActiveLine,
  highlightActiveLineGutter,
  keymap,
  lineNumbers,
  placeholder as placeholderExtension,
} from "@codemirror/view";
import { onBeforeUnmount, ref, shallowRef, watch } from "vue";
import { ruxEditorTheme, ruxLanguage } from "~/utils/rux-language";

const props = withDefaults(
  defineProps<{
    readonly?: boolean;
    placeholder?: string;
    label?: string;
  }>(),
  {
    readonly: false,
    placeholder: "",
    label: "Rux source code",
  },
);

const emit = defineEmits<{ run: [] }>();

const source = defineModel<string>({ required: true });

const host = ref<HTMLElement | null>(null);
const view = shallowRef<EditorView | null>(null);
const colorMode = useColorMode();

const theme = new Compartment();
const editable = new Compartment();

function mount(parent: HTMLElement) {
  return new EditorView({
    parent,
    state: EditorState.create({
      doc: source.value,
      extensions: [
        lineNumbers(),
        highlightActiveLine(),
        highlightActiveLineGutter(),
        drawSelection(),
        bracketMatching(),
        history(),
        indentUnit.of("    "),
        EditorState.tabSize.of(4),
        EditorView.lineWrapping,
        // Run before the default bindings so Mod-Enter is not swallowed by
        // insertNewlineAndIndent.
        keymap.of([
          {
            key: "Mod-Enter",
            preventDefault: true,
            run: () => {
              emit("run");
              return true;
            },
          },
        ]),
        keymap.of([...defaultKeymap, ...historyKeymap, indentWithTab]),
        placeholderExtension(props.placeholder),
        ruxLanguage,
        // The editor fills whatever box the page gives it; only the scroller scrolls.
        EditorView.theme({ "&": { height: "100%" }, ".cm-scroller": { overflow: "auto" } }),
        EditorView.contentAttributes.of({ "aria-label": props.label }),
        theme.of(ruxEditorTheme(colorMode.value === "dark")),
        editable.of([EditorView.editable.of(!props.readonly), EditorState.readOnly.of(props.readonly)]),
        EditorView.updateListener.of((update) => {
          if (update.docChanged) source.value = update.state.doc.toString();
        }),
      ],
    }),
  });
}

// Watched rather than mounted in `onMounted`: <ClientOnly> renders its fallback
// on the first client pass and swaps in the default slot from its own
// `onMounted`, which runs after this component's. Building the view there finds
// `host` still null and leaves an empty box with no error to explain it.
watch(host, (element) => {
  if (element && !view.value) view.value = mount(element);
});

onBeforeUnmount(() => {
  view.value?.destroy();
  view.value = null;
});

// An external change — an example, a Format result — replaces the document.
// Guarded against the round trip from the update listener, which would
// otherwise reset the cursor on every keystroke.
watch(source, (value) => {
  const editor = view.value;
  if (!editor || value === editor.state.doc.toString()) return;
  editor.dispatch({ changes: { from: 0, to: editor.state.doc.length, insert: value } });
});

// Reconfigure rather than rebuild: a new view would lose the selection, the
// scroll position and the undo history on every theme toggle.
watch(
  () => colorMode.value === "dark",
  (dark) => view.value?.dispatch({ effects: theme.reconfigure(ruxEditorTheme(dark)) }),
);

watch(
  () => props.readonly,
  (value) =>
    view.value?.dispatch({
      effects: editable.reconfigure([EditorView.editable.of(!value), EditorState.readOnly.of(value)]),
    }),
);

/** Puts the cursor on a diagnostic's line, which is what makes it clickable. */
function focusLine(line: number, column = 1) {
  const editor = view.value;
  if (!editor || line < 1 || line > editor.state.doc.lines) return;

  const target = editor.state.doc.line(line);
  const position = Math.min(target.from + Math.max(column - 1, 0), target.to);
  editor.dispatch({ selection: { anchor: position }, scrollIntoView: true });
  editor.focus();
}

defineExpose({ focusLine });
</script>

<template>
  <ClientOnly>
    <div ref="host" class="border-muted bg-muted h-full overflow-hidden rounded-md border text-sm" />

    <template #fallback>
      <!-- Sized to match the mounted editor so the pane does not resize when
           CodeMirror arrives. aria-hidden: the real editor announces itself. -->
      <div class="border-muted bg-muted h-full overflow-hidden rounded-md border p-3" aria-hidden="true">
        <USkeleton class="size-full" />
      </div>
    </template>
  </ClientOnly>
</template>
