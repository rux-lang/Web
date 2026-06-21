<script setup>
import {
  ref,
  computed,
  shallowRef,
  nextTick,
  onMounted,
  onBeforeUnmount,
  watch,
} from "vue";
import ruxGrammar from "../../grammars/rux.tmLanguage.json";
import helloExample from "../../../src/examples/Hello.rux?raw";
import factorialExample from "../../../src/examples/Factorial.rux?raw";
import funcExample from "../../../src/examples/Func.rux?raw";

// The Rux Playground backend (https://github.com/rux-lang/Playground).
const API_BASE = "https://ruxplayground.dpdns.org";
const MAX_CODE_LENGTH = 4096;

const examples = [
  { label: "Hello World", code: helloExample },
  { label: "Factorial", code: factorialExample },
  { label: "Functions", code: funcExample },
];

const selectedExample = ref(0);
const code = ref(examples[0].code);
const highlightedHtml = ref("");

const busy = ref(false);
// idle | running | success | error
const outputState = ref("idle");
const outputText = ref("Run some Rux code to see output here.");
const statusLabel = ref("Ready");
const durationMs = ref(null);
const asmData = ref(null);
const showFullAsm = ref(false);

const lineCount = computed(() => code.value.split("\n").length);

const editorTextarea = ref(null);
const editorHighlight = ref(null);
const gutterInner = ref(null);
const workspace = ref(null);

const editorPct = ref(58);
const outputPct = computed(() => 100 - editorPct.value);

/* ── highlighting ─────────────────────────────────────────────────── */

const highlighter = shallowRef(null);

function highlight() {
  if (!highlighter.value) {
    return;
  }
  // The trailing newline keeps the highlight layer the same height as the
  // textarea when the caret is on a new last line.
  highlightedHtml.value = highlighter.value.codeToHtml(code.value + "\n", {
    lang: "rux",
    themes: { light: "github-light", dark: "github-dark" },
    defaultColor: "light",
  });
}

watch(code, highlight);

onMounted(async () => {
  try {
    const [core, engine, light, dark] = await Promise.all([
      import("shiki/core"),
      import("shiki/engine/javascript"),
      import("@shikijs/themes/github-light"),
      import("@shikijs/themes/github-dark"),
    ]);
    highlighter.value = await core.createHighlighterCore({
      themes: [light.default, dark.default],
      langs: [{ ...ruxGrammar, name: "rux" }],
      engine: engine.createJavaScriptRegexEngine({ forgiving: true }),
    });
    highlight();
  } catch {
    // Highlighting is optional; the editor falls back to plain text.
  }
});

/* ── editor behavior ──────────────────────────────────────────────── */

function syncScroll() {
  const textarea = editorTextarea.value;
  if (!textarea) {
    return;
  }
  if (editorHighlight.value) {
    editorHighlight.value.scrollTop = textarea.scrollTop;
    editorHighlight.value.scrollLeft = textarea.scrollLeft;
  }
  if (gutterInner.value) {
    gutterInner.value.style.transform = `translateY(${-textarea.scrollTop}px)`;
  }
}

function insertTab(event) {
  const textarea = event.target;
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  code.value = code.value.slice(0, start) + "\t" + code.value.slice(end);
  nextTick(() => textarea.setSelectionRange(start + 1, start + 1));
}

function loadExample() {
  code.value = examples[selectedExample.value].code;
  clearOutput();
}

function downloadSource() {
  const blob = new Blob([code.value], { type: "text/plain" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "Main.rux";
  link.click();
  URL.revokeObjectURL(link.href);
}

/* ── output helpers ───────────────────────────────────────────────── */

function setRunning(label) {
  busy.value = true;
  outputState.value = "running";
  outputText.value = label;
  statusLabel.value = "Running";
  durationMs.value = null;
  asmData.value = null;
}

function setResult(text, state) {
  outputState.value = state;
  outputText.value = text;
  statusLabel.value = state === "success" ? "Success" : "Error";
}

function clearOutput() {
  outputState.value = "idle";
  outputText.value = "Run some Rux code to see output here.";
  statusLabel.value = "Ready";
  durationMs.value = null;
  asmData.value = null;
}

async function copyOutput() {
  try {
    await navigator.clipboard.writeText(outputText.value);
  } catch {
    // Clipboard is unavailable (insecure context or denied permission).
  }
}

function combineStreams(data) {
  let out = "";
  if (data.stderr) {
    out += data.stderr.trim() + "\n";
  }
  if (data.stdout) {
    out += data.stdout;
  }
  return out;
}

/* ── run ──────────────────────────────────────────────────────────── */

async function run() {
  if (busy.value || !code.value.trim()) {
    return;
  }
  setRunning("Running…");
  try {
    const response = await fetch(`${API_BASE}/run`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: code.value }),
    });
    const data = await response.json();
    const out = combineStreams(data);
    if (data.success) {
      setResult(out.trim() || "(no output)", "success");
    } else {
      setResult((data.error || "") + (out ? "\n" + out : ""), "error");
    }
    durationMs.value = data.duration_ms ?? null;
  } catch (e) {
    setResult("Connection failed: " + e.message, "error");
    statusLabel.value = "Connection error";
  } finally {
    busy.value = false;
  }
}

/* ── assembly ─────────────────────────────────────────────────────── */

function asmText(data, full) {
  const note =
    data.total_lines && data.user_lines
      ? full
        ? `\n\n; Full assembly: ${data.total_lines} lines total (user code: ${data.user_lines} lines)`
        : `\n\n; Showing user code (${data.user_lines} lines). Full assembly: ${data.total_lines} lines total.`
      : "";
  return (full ? data.asm_full : data.asm_user).trim() + note;
}

async function dumpAsm() {
  if (busy.value || !code.value.trim()) {
    return;
  }
  setRunning("Generating assembly…");
  try {
    const response = await fetch(`${API_BASE}/asm`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: code.value }),
    });
    const data = await response.json();
    if (data.success) {
      asmData.value = data;
      showFullAsm.value = false;
      setResult(asmText(data, false), "success");
    } else {
      const out = combineStreams(data);
      setResult((data.error || "") + (out ? "\n" + out : ""), "error");
    }
    durationMs.value = data.duration_ms ?? null;
  } catch (e) {
    setResult("Connection failed: " + e.message, "error");
    statusLabel.value = "Connection error";
  } finally {
    busy.value = false;
  }
}

function toggleAsmView() {
  if (!asmData.value) {
    return;
  }
  showFullAsm.value = !showFullAsm.value;
  outputText.value = asmText(asmData.value, showFullAsm.value);
}

/* ── pane resizing ────────────────────────────────────────────────── */

let dragging = false;
let dragStartX = 0;
let dragStartPct = 58;

function startResize(event) {
  dragging = true;
  dragStartX = event.clientX;
  dragStartPct = editorPct.value;
  document.body.style.cursor = "col-resize";
  document.body.style.userSelect = "none";
  event.preventDefault();
}

function onResizeMove(event) {
  if (!dragging || !workspace.value) {
    return;
  }
  const total = workspace.value.getBoundingClientRect().width;
  const next = dragStartPct + ((event.clientX - dragStartX) / total) * 100;
  editorPct.value = Math.max(20, Math.min(80, next));
}

function stopResize() {
  if (!dragging) {
    return;
  }
  dragging = false;
  document.body.style.cursor = "";
  document.body.style.userSelect = "";
}

onMounted(() => {
  document.addEventListener("mousemove", onResizeMove);
  document.addEventListener("mouseup", stopResize);
});

onBeforeUnmount(() => {
  document.removeEventListener("mousemove", onResizeMove);
  document.removeEventListener("mouseup", stopResize);
});
</script>

<template>
  <div class="rux-playground">
    <div ref="workspace" class="pg-workspace">
      <section class="pg-pane" :style="{ flex: `${editorPct} 1 0` }">
        <header class="pg-pane-header">
          <span class="pg-pane-label">Source</span>
          <select
            v-model="selectedExample"
            class="pg-select"
            aria-label="Load example"
            @change="loadExample"
          >
            <option
              v-for="(example, index) in examples"
              :key="example.label"
              :value="index"
            >
              {{ example.label }}
            </option>
          </select>
          <div class="pg-spacer"></div>
          <button
            type="button"
            class="pg-icon-btn"
            title="Download Main.rux"
            @click="downloadSource"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
          </button>
          <button
            type="button"
            class="pg-btn pg-btn-ghost"
            :disabled="busy"
            title="Show generated assembly"
            @click="dumpAsm"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path
                d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
              />
              <polyline points="14 2 14 8 20 8" />
              <line x1="9" y1="13" x2="15" y2="13" />
              <line x1="12" y1="10" x2="12" y2="16" />
            </svg>
            ASM
          </button>
          <button
            type="button"
            class="pg-btn pg-btn-brand"
            :disabled="busy || !code.trim()"
            title="Run (Ctrl+Enter)"
            @click="run"
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
            Run
          </button>
        </header>
        <div class="pg-editor">
          <div class="pg-gutter" aria-hidden="true">
            <div ref="gutterInner" class="pg-gutter-inner">
              <div v-for="line in lineCount" :key="line" class="pg-gutter-line">
                {{ line }}
              </div>
            </div>
          </div>
          <div class="pg-editor-wrap">
            <div
              ref="editorHighlight"
              class="pg-editor-highlight"
              aria-hidden="true"
            >
              <div
                v-if="highlightedHtml"
                class="pg-editor-code"
                v-html="highlightedHtml"
              ></div>
              <div v-else class="pg-editor-code">
                <pre><code>{{ code + "\n" }}</code></pre>
              </div>
            </div>
            <textarea
              ref="editorTextarea"
              v-model="code"
              class="pg-editor-input"
              :maxlength="MAX_CODE_LENGTH"
              spellcheck="false"
              autocomplete="off"
              autocorrect="off"
              autocapitalize="off"
              wrap="off"
              aria-label="Rux source code"
              @scroll="syncScroll"
              @keydown.tab.prevent="insertTab"
              @keydown.ctrl.enter.prevent="run"
              @keydown.meta.enter.prevent="run"
            ></textarea>
          </div>
        </div>
      </section>

      <div
        class="pg-resize"
        role="separator"
        aria-orientation="vertical"
        aria-label="Resize panes"
        @mousedown="startResize"
      ></div>

      <section class="pg-pane" :style="{ flex: `${outputPct} 1 0` }">
        <header class="pg-pane-header">
          <div class="pg-status">
            <span class="pg-status-dot" :class="outputState"></span>
            <span>{{ statusLabel }}</span>
          </div>
          <div class="pg-spacer"></div>
          <button
            v-if="asmData"
            type="button"
            class="pg-btn pg-btn-ghost pg-btn-small"
            @click="toggleAsmView"
          >
            {{ showFullAsm ? "User Code" : "Full Assembly" }}
          </button>
          <span v-if="durationMs !== null" class="pg-duration"
            >{{ durationMs }}ms</span
          >
          <button
            type="button"
            class="pg-icon-btn"
            title="Copy output"
            @click="copyOutput"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.75"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <rect x="9" y="9" width="13" height="13" rx="2" />
              <path
                d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"
              />
            </svg>
          </button>
          <button
            type="button"
            class="pg-icon-btn"
            title="Clear output"
            @click="clearOutput"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.75"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path
                d="M3 6h18M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6M10 11v6M14 11v6M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"
              />
            </svg>
          </button>
        </header>
        <div class="pg-output-scroll">
          <pre class="pg-output" :class="outputState">{{ outputText }}</pre>
        </div>
      </section>
    </div>
  </div>
</template>

<!-- Page-level overrides: active only while the playground is in the DOM. -->
<style>
.Layout:has(.rux-playground) .VPFooter {
  display: none !important;
}

.Layout:has(.rux-playground) .VPPage,
.Layout:has(.rux-playground) .VPContent {
  padding: 0 !important;
}
</style>

<style scoped>
.rux-playground {
  display: flex;
  flex-direction: column;
  height: calc(100dvh - var(--vp-nav-height, 64px));
  min-height: 420px;
  padding-top: var(--vp-nav-height, 64px);
  box-sizing: content-box;
}

.pg-workspace {
  display: flex;
  flex: 1;
  min-height: 0;
  overflow: hidden;
  border-top: 1px solid var(--vp-c-divider);
}

.pg-pane {
  display: flex;
  flex-direction: column;
  min-width: 0;
  min-height: 0;
  overflow: hidden;
}

/* ── pane header ──────────────────────────────────────────────────── */

.pg-pane-header {
  display: flex;
  align-items: center;
  gap: 10px;
  height: 44px;
  padding: 0 16px;
  background-color: var(--vp-c-bg-soft);
  border-bottom: 1px solid var(--vp-c-divider);
  flex-shrink: 0;
}

.pg-pane-label {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--vp-c-text-3);
  user-select: none;
}

.pg-spacer {
  flex: 1;
}

.pg-select {
  height: 28px;
  padding: 0 8px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background-color: var(--vp-c-bg);
  color: var(--vp-c-text-2);
  font-size: 12px;
  font-family: inherit;
  transition: border-color 0.25s;
}

.pg-select:focus {
  outline: none;
  border-color: var(--vp-c-brand-1);
}

.pg-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 28px;
  padding: 0 12px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  font-family: inherit;
  white-space: nowrap;
  line-height: 1;
  transition:
    background-color 0.15s,
    color 0.15s,
    border-color 0.15s,
    opacity 0.15s;
}

.pg-btn svg {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
}

.pg-btn-ghost {
  background-color: transparent;
  border: 1px solid var(--vp-c-divider);
  color: var(--vp-c-text-2);
}

.pg-btn-ghost:hover:not(:disabled) {
  background-color: var(--vp-c-bg);
  border-color: var(--vp-c-text-3);
  color: var(--vp-c-text-1);
}

.pg-btn-brand {
  background-color: var(--vp-c-brand-3);
  border: 1px solid var(--vp-c-brand-1);
  color: var(--vp-c-white);
  font-weight: 600;
}

.pg-btn-brand:hover:not(:disabled) {
  background-color: var(--vp-c-brand-2);
}

.pg-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pg-btn-small {
  height: 24px;
  padding: 0 8px;
  font-size: 11px;
}

.pg-icon-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 6px;
  background-color: transparent;
  border: 1px solid transparent;
  color: var(--vp-c-text-3);
  transition:
    background-color 0.15s,
    color 0.15s,
    border-color 0.15s;
}

.pg-icon-btn:hover {
  background-color: var(--vp-c-bg);
  border-color: var(--vp-c-divider);
  color: var(--vp-c-text-1);
}

.pg-icon-btn svg {
  width: 15px;
  height: 15px;
}

/* ── editor ───────────────────────────────────────────────────────── */

.pg-editor {
  display: flex;
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

.pg-gutter {
  flex-shrink: 0;
  min-width: 44px;
  overflow: hidden;
  background-color: var(--vp-c-bg-soft);
  border-right: 1px solid var(--vp-c-divider);
  user-select: none;
}

.pg-gutter-inner {
  padding: 12px 0;
  will-change: transform;
}

.pg-gutter-line {
  padding: 0 10px 0 6px;
  font-family: var(--vp-font-family-mono);
  font-size: 12px;
  line-height: 22.4px;
  text-align: right;
  color: var(--vp-c-text-3);
}

.pg-editor-wrap {
  position: relative;
  flex: 1;
  min-width: 0;
}

.pg-editor-highlight {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

/* The highlight layer and the textarea must use identical text metrics so
   the transparent input text lines up exactly with the colored text below.
   The gutter line-height (22.4px) must equal font-size 14px x 1.6. */
.pg-editor-code :deep(pre),
.pg-editor-input {
  margin: 0;
  padding: 12px 16px;
  font-family: var(--vp-font-family-mono);
  font-size: 14px;
  line-height: 1.6;
  tab-size: 4;
  white-space: pre;
}

.pg-editor-code :deep(pre) {
  background-color: transparent !important;
}

.pg-editor-code :deep(code) {
  display: block;
  padding: 0;
  background-color: transparent;
  font-family: inherit;
  font-size: inherit;
  line-height: inherit;
  color: var(--vp-c-text-1);
}

.dark .pg-editor-code :deep(.shiki),
.dark .pg-editor-code :deep(.shiki span) {
  color: var(--shiki-dark, inherit) !important;
}

.pg-editor-input {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border: none;
  resize: none;
  overflow: auto;
  background-color: transparent;
  color: transparent;
  caret-color: var(--vp-c-brand-1);
  overflow-wrap: normal;
  word-break: normal;
}

.pg-editor-input:focus {
  outline: none;
}

.pg-editor-input::selection {
  background-color: var(--vp-c-brand-soft);
}

/* ── resize handle ────────────────────────────────────────────────── */

.pg-resize {
  width: 1px;
  background-color: var(--vp-c-divider);
  cursor: col-resize;
  flex-shrink: 0;
  position: relative;
  z-index: 5;
  transition:
    background-color 0.15s,
    width 0.1s;
}

.pg-resize::after {
  content: "";
  position: absolute;
  inset: 0 -3px;
}

.pg-resize:hover {
  background-color: var(--vp-c-brand-1);
  width: 2px;
}

/* ── output ───────────────────────────────────────────────────────── */

.pg-status {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 12px;
  font-weight: 500;
  color: var(--vp-c-text-3);
}

.pg-status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: var(--vp-c-text-3);
  flex-shrink: 0;
}

.pg-status-dot.running {
  background-color: var(--vp-c-brand-1);
  animation: pg-pulse 1s ease-in-out infinite;
}

.pg-status-dot.success {
  background-color: var(--vp-c-green-1);
}

.pg-status-dot.error {
  background-color: var(--vp-c-danger-1);
}

@keyframes pg-pulse {
  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.3;
  }
}

.pg-duration {
  padding: 2px 7px;
  border-radius: 4px;
  background-color: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  font-family: var(--vp-font-family-mono);
  font-size: 11px;
  font-weight: 500;
}

.pg-output-scroll {
  flex: 1;
  min-height: 0;
  overflow: auto;
  padding: 16px 20px;
}

.pg-output {
  margin: 0;
  font-family: var(--vp-font-family-mono);
  font-size: 13px;
  line-height: 1.75;
  white-space: pre-wrap;
  word-break: break-word;
  color: var(--vp-c-text-1);
}

.pg-output.idle {
  color: var(--vp-c-text-3);
  font-style: italic;
}

.pg-output.running {
  color: var(--vp-c-text-2);
}

.pg-output.error {
  color: var(--vp-c-danger-1);
}

/* ── mobile ───────────────────────────────────────────────────────── */

@media (max-width: 768px) {
  .pg-workspace {
    flex-direction: column;
  }

  .pg-pane {
    flex: 1 1 0 !important;
  }

  .pg-resize {
    display: none;
  }

  .pg-pane + .pg-pane {
    border-top: 1px solid var(--vp-c-divider);
  }

  .pg-pane-header {
    padding: 0 12px;
    gap: 8px;
  }
}
</style>
