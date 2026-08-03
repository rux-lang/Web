<script lang="ts">
import type { Element, Properties, RootContent } from "hast";
import { computed, defineComponent, h, resolveComponent, type Component, type PropType, type VNodeChild } from "vue";
import { safeReadmeLink, sanitizedReadmeTree, textContent } from "~/utils/readme";

const proseComponents: Record<string, string> = {
  a: "ProseA",
  blockquote: "ProseBlockquote",
  code: "ProseCode",
  em: "ProseEm",
  h1: "ProseH3",
  h2: "ProseH4",
  hr: "ProseHr",
  li: "ProseLi",
  ol: "ProseOl",
  p: "ProseP",
  pre: "ProsePre",
  strong: "ProseStrong",
  table: "ProseTable",
  tbody: "ProseTbody",
  td: "ProseTd",
  th: "ProseTh",
  thead: "ProseThead",
  tr: "ProseTr",
  ul: "ProseUl",
};

function propertyString(properties: Properties, key: string): string | undefined {
  const value = properties[key];
  return typeof value === "string" ? value : undefined;
}

function languageFrom(node: Element): string | undefined {
  const code = node.children.find((child): child is Element => child.type === "element" && child.tagName === "code");
  const classNames = code?.properties.className;
  if (!Array.isArray(classNames)) return undefined;
  const languageClass = classNames.find((value) => typeof value === "string" && value.startsWith("language-"));
  return typeof languageClass === "string" ? languageClass.slice("language-".length) : undefined;
}

export default defineComponent({
  name: "SanitizedReadme",
  props: {
    source: {
      type: String as PropType<string>,
      required: true,
    },
  },
  setup(props) {
    const tree = computed(() => sanitizedReadmeTree(props.source));
    const components = Object.fromEntries(
      Object.entries(proseComponents).map(([tag, name]) => [tag, resolveComponent(name)]),
    ) as Record<string, Component | string>;

    function renderChildren(node: Element): VNodeChild[] {
      return node.children.flatMap(renderNode);
    }

    function renderNode(node: RootContent): VNodeChild[] {
      if (node.type === "text") return [node.value];
      if (node.type !== "element") return [];

      if (node.tagName === "a") {
        const href = safeReadmeLink(node.properties.href);
        if (!href) return renderChildren(node);
        const webLink = href.startsWith("http://") || href.startsWith("https://");
        return [
          h(
            components.a ?? "a",
            {
              href,
              ...(webLink
                ? {
                    target: "_blank",
                    rel: "noopener noreferrer nofollow",
                  }
                : {}),
            },
            () => [
              ...renderChildren(node),
              ...(webLink ? [h("span", { class: "sr-only" }, " (opens in a new tab)")] : []),
            ],
          ),
        ];
      }

      if (node.tagName === "pre") {
        const code = textContent(node);
        return [
          h(
            components.pre ?? "pre",
            {
              code,
              language: languageFrom(node),
            },
            () => h("code", code),
          ),
        ];
      }

      if (node.tagName === "h3") {
        return [
          h(
            "h5",
            {
              class: "mt-6 text-base font-semibold text-highlighted",
            },
            renderChildren(node),
          ),
        ];
      }
      if (["h4", "h5", "h6"].includes(node.tagName)) {
        return [
          h(
            "h6",
            {
              class: "mt-5 text-sm font-semibold text-highlighted",
            },
            renderChildren(node),
          ),
        ];
      }

      const component = components[node.tagName] ?? node.tagName;
      const elementProps: Record<string, unknown> = {};
      const title = propertyString(node.properties, "title");
      if (title) elementProps.title = title;
      if (node.tagName === "ol" && typeof node.properties.start === "number") {
        elementProps.start = node.properties.start;
      }
      if ((node.tagName === "td" || node.tagName === "th") && typeof node.properties.align === "string") {
        elementProps.align = node.properties.align;
      }

      return [h(component, elementProps, () => renderChildren(node))];
    }

    return () =>
      h(
        "div",
        {
          class: "readme-content min-w-0",
        },
        tree.value.children.flatMap(renderNode),
      );
  },
});
</script>
