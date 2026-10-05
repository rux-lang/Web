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
 * literals. The diagram is drawn again whenever the colour mode flips.
 */
const props = defineProps<{ code: string }>();

const colorMode = useColorMode();
const svg = ref("");
const failed = ref(false);
// Mermaid uses the id for an element and as a CSS selector prefix, so it has
// to be a plain identifier — useId() can contain characters that are not.
const id = `mermaid-${useId().replace(/[^\w-]/g, "")}`;

const font = '"Noto Sans", "Inter", ui-sans-serif, system-ui, sans-serif';

const palettes = {
  light: {
    background: "#ffffff",
    primaryColor: "#f5f3ff",
    primaryBorderColor: "#8b5cf6",
    primaryTextColor: "#0f172a",
    secondaryColor: "#f1f5f9",
    secondaryBorderColor: "#94a3b8",
    tertiaryColor: "#f8fafc",
    tertiaryBorderColor: "#cbd5e1",
    lineColor: "#64748b",
    textColor: "#0f172a",
    noteBkgColor: "#ede9fe",
    noteBorderColor: "#a78bfa",
    noteTextColor: "#0f172a",
    clusterBkg: "#f8fafc",
    clusterBorder: "#cbd5e1",
    edgeLabelBackground: "#ffffff",
    actorBkg: "#f5f3ff",
    actorBorder: "#8b5cf6",
    signalColor: "#334155",
  },
  dark: {
    background: "#161b1d",
    primaryColor: "#2e1065",
    primaryBorderColor: "#a78bfa",
    primaryTextColor: "#f1f5f9",
    secondaryColor: "#242b2e",
    secondaryBorderColor: "#65787d",
    tertiaryColor: "#1b2124",
    tertiaryBorderColor: "#3a4448",
    lineColor: "#aab9bd",
    textColor: "#e6ecec",
    noteBkgColor: "#3b2a6b",
    noteBorderColor: "#a78bfa",
    noteTextColor: "#f1f5f9",
    clusterBkg: "#1b2124",
    clusterBorder: "#3a4448",
    edgeLabelBackground: "#161b1d",
    actorBkg: "#2e1065",
    actorBorder: "#a78bfa",
    signalColor: "#e6ecec",
  },
};

let renders = 0;

async function draw() {
  const { default: mermaid } = await import("mermaid");
  const dark = colorMode.value === "dark";

  mermaid.initialize({
    startOnLoad: false,
    securityLevel: "strict",
    theme: "base",
    fontFamily: font,
    themeVariables: { ...palettes[dark ? "dark" : "light"], fontFamily: font, fontSize: "14px", darkMode: dark },
    flowchart: { curve: "basis", padding: 12 },
  });

  try {
    // A fresh id per render: Mermaid leaves a scratch element behind under the
    // id it was given, and reusing one makes the next render measure that.
    const result = await mermaid.render(`${id}-${++renders}`, props.code.trim());
    svg.value = result.svg;
    failed.value = false;
  } catch (error) {
    failed.value = true;
    console.error("[MermaidDiagram]", error);
  }
}

onMounted(() => {
  draw();
  watch(() => colorMode.value, draw);
});
</script>

<template>
  <figure class="mermaid-diagram my-5 overflow-x-auto rounded-md border border-muted bg-default p-4">
    <!-- eslint-disable-next-line vue/no-v-html -- SVG produced by Mermaid with securityLevel "strict" from our own Markdown -->
    <div v-if="svg && !failed" class="flex justify-center [&>svg]:h-auto [&>svg]:max-w-full" v-html="svg" />
    <pre v-else class="m-0 font-mono text-sm whitespace-pre text-muted">{{ code.trim() }}</pre>
  </figure>
</template>
