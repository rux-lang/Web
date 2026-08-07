<script lang="ts">
import NuxtUiProseCodeTree from "@nuxt/ui/components/prose/CodeTree.vue";
import { defineComponent, h, type VNode } from "vue";

type CodeTreeItem = {
  label: string;
  icon?: string;
  component: VNode;
};

function codeTreeItems(nodes: VNode[]): CodeTreeItem[] {
  return nodes.flatMap((node, index): CodeTreeItem[] => {
    if (typeof node.type === "symbol") {
      return Array.isArray(node.children) ? codeTreeItems(node.children as VNode[]) : [];
    }

    const props = node.props ?? {};

    return [
      {
        label: String(props.filename ?? props.label ?? index),
        icon: typeof props.icon === "string" ? props.icon : undefined,
        component: node,
      },
    ];
  });
}

/**
 * Nuxt UI 4.10's ProseCodeTree reads its default slot from a computed watcher,
 * which makes Vue report that the slot was invoked outside the render function.
 * Resolve the Markdown code-block nodes here, during render, and use the
 * component's equivalent `items` API so the slot remains dependency-tracked.
 */
export default defineComponent({
  name: "ProseCodeTree",
  inheritAttrs: false,
  setup(_, { attrs, slots }) {
    return () =>
      h(NuxtUiProseCodeTree, {
        ...attrs,
        items: codeTreeItems(slots.default?.() ?? []),
      });
  },
});
</script>
