<script setup lang="ts">
/**
 * Renders a ```mermaid fence as a diagram. ProsePre.vue hands every fence
 * tagged `mermaid` here; nothing else needs to know the component exists.
 *
 * Mermaid is ~1 MB and only the Learn Rux pages draw diagrams, so it is bundled
 * (the CSP allows `script-src 'self'` only — no CDN) but imported on first use,
 * in the browser. The prerendered HTML carries the diagram source instead,
 * which is what crawlers, readers without JavaScript and the brief moment
 * before hydration see.
 *
 * Mermaid derives its whole palette from a handful of theme variables and
 * cannot read CSS custom properties, so the two palettes below restate the
 * site's tokens (main.css: --color-rux-*, --color-mist-*, Nuxt UI slate) as
 * literals. Nodes sit on a neutral surface, like code blocks; the brand violet
 * is only their border. The diagram is drawn again whenever the colour mode
 * flips.
 *
 * Code inside a label is written in backticks, as in Markdown prose:
 * run["`rux run`"]. prepare() turns each span into <code>, which Mermaid keeps
 * under securityLevel "strict" (it only strips scripts from HTML labels) and
 * themeCSS sets in the mono face. Sequence diagrams draw their text as SVG
 * <text>, which cannot hold <code>, so there the backticks are simply dropped.
 *
 * Almost every diagram is a `flowchart LR`, which on a phone would be scaled
 * down until its text is unreadable. When the column is too narrow to show the
 * horizontal layout at MIN_SCALE, the diagram is drawn again top-down; anything
 * still too wide stops shrinking at MIN_SCALE and scrolls sideways instead.
 * A diagram that should read upwards when it turns, like a number line with
 * the largest value on top, says so with a Mermaid comment: `%% vertical: BT`.
 */
const props = defineProps<{ code: string }>();

const colorMode = useColorMode();
const figure = ref<HTMLElement>();
const svg = ref("");
const failed = ref(false);
// The rendered diagram's own width in px, from its viewBox. The wrapper never
// gets narrower than MIN_SCALE of it; past that the figure scrolls sideways.
const naturalWidth = ref(0);
const minWidth = computed(() => `${Math.round(naturalWidth.value * MIN_SCALE)}px`);
// Mermaid uses the id for an element and as a CSS selector prefix, so it has
// to be a plain identifier — useId() can contain characters that are not.
const id = `mermaid-${useId().replace(/[^\w-]/g, "")}`;

const font = '"Noto Sans", "Inter", ui-sans-serif, system-ui, sans-serif';
const mono = '"JetBrains Mono", "Fira Code", ui-monospace, monospace';

// 14px text drawn at 0.75 is 10.5px — the smallest a diagram is allowed to get.
const MIN_SCALE = 0.75;

const palettes = {
  light: {
    background: "#ffffff",
    primaryColor: "#f8fafc",
    primaryBorderColor: "#a78bfa",
    primaryTextColor: "#0f172a",
    secondaryColor: "#f1f5f9",
    secondaryBorderColor: "#94a3b8",
    tertiaryColor: "#f8fafc",
    tertiaryBorderColor: "#cbd5e1",
    lineColor: "#64748b",
    textColor: "#0f172a",
    noteBkgColor: "#f5f3ff",
    noteBorderColor: "#a78bfa",
    noteTextColor: "#0f172a",
    clusterBkg: "#f8fafc",
    clusterBorder: "#cbd5e1",
    edgeLabelBackground: "#ffffff",
    actorBkg: "#f8fafc",
    actorBorder: "#a78bfa",
    signalColor: "#334155",
  },
  dark: {
    background: "#161b1d",
    primaryColor: "#242b2e",
    primaryBorderColor: "#8b7bd8",
    primaryTextColor: "#e6ecec",
    secondaryColor: "#242b2e",
    secondaryBorderColor: "#65787d",
    tertiaryColor: "#1b2124",
    tertiaryBorderColor: "#3a4448",
    lineColor: "#aab9bd",
    textColor: "#e6ecec",
    // --color-rux-400 at 12% over mist-900, so notes still stand apart from nodes.
    noteBkgColor: "#272838",
    noteBorderColor: "#a78bfa",
    noteTextColor: "#e6ecec",
    clusterBkg: "#1b2124",
    clusterBorder: "#3a4448",
    edgeLabelBackground: "#161b1d",
    actorBkg: "#242b2e",
    actorBorder: "#8b7bd8",
    signalColor: "#e6ecec",
  },
};

const flowchart = /^\s*(?:flowchart|graph)\b/m;
const horizontal = /^(\s*(?:flowchart|graph))\s+(?:LR|RL)\b/m;
// The direction a horizontal diagram takes when it turns: top-down, unless a
// `%% vertical: BT` comment (which Mermaid ignores) asks for bottom-up.
const verticalHint = /^\s*%%\s*vertical:\s*(TD|TB|BT)\s*$/m;

/** Backtick spans → <code>; their < and > escaped so `Labeled<T>` is not read as a tag. */
function prepare(source: string) {
  if (!flowchart.test(source)) return source.replaceAll("`", "");
  return source.replace(
    /`([^`\n]+)`/g,
    (_, text: string) => `<code>${text.replaceAll("<", "&lt;").replaceAll(">", "&gt;")}</code>`,
  );
}

const source = computed(() => prepare(props.code.trim()));
const isHorizontal = computed(() => horizontal.test(source.value));

// Whether a horizontal diagram is currently drawn top-down, and how wide its
// horizontal layout is — measured once, so a resize can decide without
// drawing it again.
const vertical = ref(false);
let horizontalWidth = 0;

// Mermaid measures every label while it lays the diagram out. If the web fonts
// have not arrived yet it measures a fallback face and the boxes come out the
// wrong size, so the first draw waits for both.
let fonts: Promise<unknown> | undefined;
function loadFonts() {
  fonts ??= Promise.all([document.fonts.load(`14px ${font}`), document.fonts.load(`14px ${mono}`)]).catch(() => {});
  return fonts;
}

function columnWidth() {
  const el = figure.value;
  if (!el) return 0;
  const style = getComputedStyle(el);
  return el.clientWidth - Number.parseFloat(style.paddingLeft) - Number.parseFloat(style.paddingRight);
}

function tooNarrow() {
  return horizontalWidth > 0 && columnWidth() < horizontalWidth * MIN_SCALE;
}

let renders = 0;

async function draw() {
  const ticket = ++renders;
  const [{ default: mermaid }] = await Promise.all([import("mermaid"), loadFonts()]);
  const dark = colorMode.value === "dark";

  mermaid.initialize({
    startOnLoad: false,
    securityLevel: "strict",
    theme: "base",
    // Mermaid 12 made ELK the default layout and `neo` the default look for
    // flowcharts. Every diagram on the site was drawn and checked under dagre
    // and the classic look, so both are pinned rather than left to the default.
    layout: "dagre",
    look: "classic",
    fontFamily: font,
    themeVariables: { ...palettes[dark ? "dark" : "light"], fontFamily: font, fontSize: "14px", darkMode: dark },
    themeCSS: `code { font-family: ${mono}; font-size: 0.93em; }`,
    // Drawn top-down only for a narrow column, so it packs tighter than
    // Mermaid's 50px defaults to fit beside the edges that loop back.
    flowchart: { curve: "basis", padding: 12, ...(vertical.value && { nodeSpacing: 24, rankSpacing: 36 }) },
  });

  const turned = verticalHint.exec(source.value)?.[1] ?? "TD";
  const code = vertical.value ? source.value.replace(horizontal, `$1 ${turned}`) : source.value;

  try {
    // A fresh id per render: Mermaid leaves a scratch element behind under the
    // id it was given, and reusing one makes the next render measure that.
    const result = await mermaid.render(`${id}-${ticket}`, code);
    // A newer draw (colour mode, resize) started meanwhile and owns the result.
    if (ticket !== renders) return;
    const width = Number(/viewBox="[-\d.]+ [-\d.]+ ([\d.]+)/.exec(result.svg)?.[1] ?? 0);
    if (isHorizontal.value && !vertical.value) {
      horizontalWidth = width;
      if (tooNarrow()) {
        vertical.value = true;
        return draw();
      }
    }
    svg.value = result.svg;
    naturalWidth.value = width;
    failed.value = false;
  } catch (error) {
    if (ticket !== renders) return;
    failed.value = true;
    console.error("[MermaidDiagram]", error);
  }
}

let resizeTimer: ReturnType<typeof setTimeout> | undefined;
let observer: ResizeObserver | undefined;

onMounted(() => {
  draw();
  watch(() => colorMode.value, draw);

  // A phone turned sideways, or a window resized across the point where the
  // horizontal layout stops fitting: pick the direction again.
  if (isHorizontal.value && figure.value) {
    observer = new ResizeObserver(() => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (!horizontalWidth || tooNarrow() === vertical.value) return;
        vertical.value = !vertical.value;
        draw();
      }, 150);
    });
    observer.observe(figure.value);
  }
});

onBeforeUnmount(() => {
  observer?.disconnect();
  clearTimeout(resizeTimer);
});
</script>

<template>
  <figure
    ref="figure"
    class="mermaid-diagram my-5 overflow-x-auto rounded-md border border-muted bg-default p-2 sm:p-4"
  >
    <!-- eslint-disable vue/no-v-html -- SVG produced by Mermaid with securityLevel "strict" from our own Markdown -->
    <div
      v-if="svg && !failed"
      class="flex justify-center [&>svg]:h-auto [&>svg]:max-w-full"
      :style="{ minWidth }"
      v-html="svg"
    />
    <!-- eslint-enable vue/no-v-html -->
    <pre v-else class="m-0 font-mono text-sm whitespace-pre text-muted">{{ code.trim() }}</pre>
  </figure>
</template>
