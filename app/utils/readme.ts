import type { Element, Root, RootContent } from "hast";
import type { Image, ImageReference, Root as MarkdownRoot } from "mdast";
import type { Parent } from "unist";
import rehypeSanitize, { type Options as SanitizeSchema } from "rehype-sanitize";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";

const readmeSchema: SanitizeSchema = {
  tagNames: [
    "a",
    "blockquote",
    "br",
    "code",
    "del",
    "em",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "hr",
    "li",
    "ol",
    "p",
    "pre",
    "strong",
    "table",
    "tbody",
    "td",
    "th",
    "thead",
    "tr",
    "ul",
  ],
  attributes: {
    a: ["href", "title"],
    code: [["className", /^language-[a-z0-9_+-]+$/i]],
    ol: ["start"],
    td: ["align"],
    th: ["align"],
  },
  protocols: {
    href: ["http", "https", "mailto"],
  },
};

function blockedImageText(node: Image | ImageReference): string {
  return node.alt?.trim() ? `[Image: ${node.alt.trim()}]` : "[Image]";
}

function replaceImages(parent: Parent): void {
  parent.children = parent.children.map((node) => {
    if (node.type === "image" || node.type === "imageReference") {
      return {
        type: "text",
        value: blockedImageText(node as Image | ImageReference),
      };
    }

    if ("children" in node && Array.isArray(node.children)) {
      replaceImages(node as Parent);
    }
    return node;
  });
}

function remarkBlockImages() {
  return (tree: MarkdownRoot) => replaceImages(tree);
}

const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkBlockImages)
  .use(remarkRehype, {
    allowDangerousHtml: false,
    clobberPrefix: "rux-readme-",
  })
  .use(rehypeSanitize, readmeSchema);

export function sanitizedReadmeTree(source: string): Root {
  const markdown = processor.parse(source);
  return processor.runSync(markdown) as Root;
}

export function safeReadmeLink(value: unknown): string | null {
  if (typeof value !== "string") return null;

  try {
    const url = new URL(value);
    return ["http:", "https:", "mailto:"].includes(url.protocol) ? url.toString() : null;
  } catch {
    return null;
  }
}

export function readmeElements(tree: Root): Element[] {
  return tree.children.filter((node): node is Element => node.type === "element");
}

export function textContent(node: RootContent): string {
  if (node.type === "text") return node.value;
  if ("children" in node) return node.children.map((child) => textContent(child)).join("");
  return "";
}
