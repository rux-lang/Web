<script lang="ts">
import type { Element, Properties, RootContent } from "hast";
import {
  defineComponent,
  h,
  resolveComponent,
  shallowRef,
  type Component,
  type PropType,
  type VNodeChild,
  watch,
} from "vue";
import { highlightReadmeCode } from "~/utils/readme-highlighter";
import { textContent } from "~/utils/readme";

function vueProperties(properties: Properties): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(properties).map(([key, value]) => [key === "className" ? "class" : key, value]),
  );
}

function renderHighlightedNode(node: RootContent): VNodeChild {
  if (node.type === "text") return node.value;
  if (node.type !== "element" || node.tagName !== "span") return textContent(node);
  return h("span", vueProperties(node.properties), node.children.map(renderHighlightedNode));
}

function codeElement(pre: Element): Element | undefined {
  return pre.children.find((node): node is Element => node.type === "element" && node.tagName === "code");
}

function renderHighlightedCode(code: Element): VNodeChild[] {
  return code.children.flatMap((node) => {
    // Shiki separates its block-level `.line` spans with newline text nodes.
    // Rendering both doubles the visible line spacing in a whitespace-aware pre.
    if (node.type === "text" && /^\r?\n$/.test(node.value)) return [];
    if (node.type === "element" && node.tagName === "span" && node.properties.class === "line") {
      // Keep the separator inside the line instead. This matches Nuxt Content's
      // highlighted DOM, gives empty lines one line box, and preserves selection.
      return [h("span", vueProperties(node.properties), [...node.children.map(renderHighlightedNode), "\n"])];
    }
    return [renderHighlightedNode(node)];
  });
}

export default defineComponent({
  name: "ReadmeCodeBlock",
  props: {
    code: {
      type: String as PropType<string>,
      required: true,
    },
    language: {
      type: String as PropType<string | undefined>,
      default: undefined,
    },
  },
  setup(props) {
    const highlighted = shallowRef<Element | null>(null);
    const prosePre = resolveComponent("ProsePre") as Component;

    watch(
      () => [props.code, props.language] as const,
      async ([code, language], _previous, onCleanup) => {
        let stale = false;
        onCleanup(() => {
          stale = true;
        });
        highlighted.value = null;

        const result = await highlightReadmeCode(code, language).catch(() => null);
        if (!stale) highlighted.value = result;
      },
      { immediate: true },
    );

    return () => {
      const pre = highlighted.value;
      const code = pre ? codeElement(pre) : undefined;
      const baseProps = {
        code: props.code,
        language: props.language,
      };

      if (!pre || !code) {
        return h(prosePre, baseProps, () => h("code", props.code));
      }

      const preProperties = vueProperties(pre.properties);
      const shikiClass = preProperties.class;
      delete preProperties.class;
      delete preProperties.style;
      return h(
        prosePre,
        {
          ...baseProps,
          ...preProperties,
          class: [shikiClass, props.language ? `language-${props.language}` : undefined],
        },
        () => h("code", vueProperties(code.properties), renderHighlightedCode(code)),
      );
    };
  },
});
</script>
