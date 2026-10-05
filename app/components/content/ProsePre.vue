<script lang="ts">
import NuxtUiProsePre from "@nuxt/ui/components/prose/Pre.vue";
import { defineComponent, h } from "vue";
import MermaidDiagram from "./MermaidDiagram.vue";

/**
 * Every Markdown fence renders through ProsePre. This override routes the ones
 * tagged ```mermaid to MermaidDiagram and hands everything else, untouched, to
 * Nuxt UI's own component — so a diagram is written in Markdown exactly like a
 * code block, with no MDC wrapper to remember.
 *
 * Registered global in nuxt.config.ts for the same reason as ProseCodeTree.vue:
 * mdc resolves prose components through the global registry, and
 * components/content/ is not global by default.
 */
export default defineComponent({
  name: "ProsePre",
  inheritAttrs: false,
  setup(_, { attrs, slots }) {
    return () =>
      attrs.language === "mermaid" && typeof attrs.code === "string"
        ? h(MermaidDiagram, { code: attrs.code })
        : h(NuxtUiProsePre, attrs, slots);
  },
});
</script>
