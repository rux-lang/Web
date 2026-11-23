/**
 * Clean Markdown for language models: the pure half of scripts/generate-llms.mjs.
 *
 * Nuxt Content stores every page body as minimark — `[tag, props, ...children]`
 * with strings for text — and MDC's serializer turns any tag it does not know
 * back into MDC syntax: `::mistake`, `:u-page-card{…}`, `{rel="nofollow"}` on
 * every external link, even `:br` for a hard line break. An assistant reads all
 * of that as noise, so the tree is cut down to plain Markdown elements first.
 *
 * The cleaner is a whitelist. Standard elements keep only the props Markdown
 * can express (a link's href, a code block's language and file name), the
 * site's own components are rewritten into what they mean (callouts become
 * blockquotes, cards become link lists, the course road map becomes a list of
 * parts), layout wrappers are unwrapped, and any other tag is unwrapped and
 * reported, so a new component fails the build instead of leaking.
 */
import { toHast } from "minimark/hast";
import { stringifyMarkdown } from "@nuxtjs/mdc/runtime";

export const SITE = "https://rux-lang.dev";

/** Elements kept as they are, with the only props each may carry. */
const KEEP = {
  p: [],
  h1: [],
  h2: [],
  h3: [],
  h4: [],
  h5: [],
  h6: [],
  ul: [],
  ol: ["start"],
  li: [],
  a: ["href"],
  strong: [],
  em: [],
  del: [],
  code: [],
  blockquote: [],
  table: [],
  thead: [],
  tbody: [],
  tr: [],
  th: ["align"],
  td: ["align"],
  hr: [],
  img: ["src", "alt"],
  input: ["type", "checked", "disabled"],
};

/** Callout components and the label a callout without a bold title gets. */
const CALLOUTS = {
  note: "Note",
  tip: "Tip",
  warning: "Warning",
  caution: "Caution",
  important: "Important",
  mistake: "Mistake",
};

/** Layout components whose children are the content. */
const UNWRAP = new Set(["code-tree", "code-group", "tabs", "steps", "u-page-grid", "div", "span", "template"]);

/** Card components: each becomes one item of a link list. */
const isCard = (tag) => tag === "u-page-card" || tag === "link-card" || /^design-kit-[a-z]+-card$/.test(tag);

/** A root-relative or fragment link made absolute, so it works outside the site. */
export function absoluteUrl(href, page, site = SITE) {
  if (typeof href !== "string" || href === "") return href;
  if (href.startsWith("#")) return `${site}${page}${href}`;
  if (href.startsWith("/")) return `${site}${href}`;
  return href;
}

/** Plain text of a minimark node, for a code block whose `code` prop is missing. */
function textOf(node) {
  if (typeof node === "string") return node;
  if (!Array.isArray(node)) return "";
  return node.slice(2).map(textOf).join("");
}

function pick(props, names) {
  const out = {};
  for (const name of names) {
    if (props?.[name] !== undefined && props[name] !== null && props[name] !== "") out[name] = props[name];
  }
  return out;
}

const INLINE = new Set(["a", "strong", "em", "del", "code", "img", "input", "br", "span"]);
const isInline = (node) => typeof node === "string" || (Array.isArray(node) && INLINE.has(node[0]));

/** Runs of loose inline content wrapped in paragraphs, so a blockquote holds blocks. */
function asBlocks(children) {
  const out = [];
  let run = [];
  const flush = () => {
    if (run.some((node) => typeof node !== "string" || node.trim() !== "")) out.push(["p", {}, ...run]);
    run = [];
  };
  for (const node of children) {
    if (isInline(node)) run.push(node);
    else {
      flush();
      out.push(node);
    }
  }
  flush();
  return out;
}

/**
 * A callout as a blockquote whose first paragraph is its bold title.
 *
 * The site writes a titled callout as `**Title.**\` plus the body, a bold run
 * and a hard break in one paragraph; the title is split into a paragraph of
 * its own. A callout whose first paragraph opens with bold text keeps it, and
 * any other gets the callout's kind ("Note", "Mistake") as its title.
 */
function callout(raw, label, ctx) {
  const blocks = asBlocks(raw);
  const [first, ...rest] = blocks;
  if (Array.isArray(first) && first[0] === "p") {
    const kids = first.slice(2);
    const lead = kids.findIndex((node) => typeof node !== "string" || node.trim() !== "");
    if (Array.isArray(kids[lead]) && kids[lead][0] === "strong") {
      const after = kids.slice(lead + 1);
      if (Array.isArray(after[0]) && after[0][0] === "br") {
        const body = after.slice(1);
        if (typeof body[0] === "string") body[0] = body[0].replace(/^\s+/, "");
        const title = ["p", {}, ...cleanChildren([kids[lead]], ctx)];
        const tail = body.length ? [["p", {}, ...body]] : [];
        return ["blockquote", {}, title, ...cleanChildren([...tail, ...rest], ctx)];
      }
      return ["blockquote", {}, ...cleanChildren(blocks, ctx)];
    }
  }
  return ["blockquote", {}, ["p", {}, ["strong", {}, label]], ...cleanChildren(blocks, ctx)];
}

/** One card as a list item: the title linked to its target, then its description. */
function card(props, ctx) {
  const title = props.title ?? props.name ?? props.label ?? "";
  const to = absoluteUrl(props.to, ctx.page, ctx.site);
  const description = typeof props.description === "string" ? props.description.trim() : "";
  const head = to ? ["a", { href: to }, title] : ["strong", {}, title];
  return ["li", { card: true }, head, ...(description ? [`: ${description}`] : [])];
}

/** Consecutive card items gathered into one bullet list. */
function groupCards(nodes) {
  const out = [];
  let list = null;
  for (const node of nodes) {
    if (Array.isArray(node) && node[0] === "li" && node[1]?.card) {
      list ??= ["ul", {}];
      list.push(["li", {}, ...node.slice(2)]);
      continue;
    }
    if (list && typeof node === "string" && node.trim() === "") continue;
    if (list) {
      out.push(list);
      list = null;
    }
    out.push(node);
  }
  if (list) out.push(list);
  return out;
}

function cleanChildren(children, ctx) {
  return groupCards(children.flatMap((child) => cleanNode(child, ctx)));
}

/** One minimark node cleaned into zero or more plain Markdown nodes. */
function cleanNode(node, ctx) {
  if (typeof node === "string") return [node];
  if (!Array.isArray(node) || typeof node[0] !== "string") return [];
  const [rawTag, props = {}, ...children] = node;
  const tag = rawTag.toLowerCase();

  if (tag === "br") return ["\n"];
  // Shiki appends its highlighting CSS to the body; nothing to say in Markdown.
  if (tag === "style" || tag === "script") return [];
  // Exponents (2<sup>8</sup>) have no Markdown form; caret notation reads the same.
  if (tag === "sup") return ["^", ...cleanChildren(children, ctx)];
  if (tag === "sub") return ["_", ...cleanChildren(children, ctx)];
  if (tag === "pre") {
    const code = typeof props.code === "string" ? props.code : textOf(node);
    return [["pre", { ...pick(props, ["language", "filename"]), code }, ["code", {}, code]]];
  }
  if (tag in CALLOUTS) return [callout(children, CALLOUTS[tag], ctx)];
  if (tag === "tabs-item") {
    const label = props.label ? [["p", {}, ["strong", {}, String(props.label)]]] : [];
    return [...label, ...cleanChildren(children, ctx)];
  }
  if (UNWRAP.has(tag)) return cleanChildren(children, ctx);
  if (isCard(tag)) return [card(props, ctx)];
  if (ctx.components?.[tag]) return ctx.components[tag];
  if (tag in KEEP) {
    const kept = pick(props, KEEP[tag]);
    if (tag === "a") kept.href = absoluteUrl(kept.href, ctx.page, ctx.site);
    if (tag === "img") kept.src = absoluteUrl(kept.src, ctx.page, ctx.site);
    return [[tag, kept, ...cleanChildren(children, ctx)]];
  }

  ctx.unknown?.add(tag);
  return cleanChildren(children, ctx);
}

/**
 * A page body cut down to plain Markdown nodes.
 *
 * `ctx.page` is the page's path (for `#fragment` links), `ctx.components` maps
 * a content component that renders data rather than its slot (`learn-roadmap`,
 * `api-packages`) to the nodes that stand in for it, and `ctx.unknown`, when
 * given, collects every tag the cleaner did not recognise.
 */
export function cleanBody(nodes, ctx) {
  return cleanChildren(nodes, { site: SITE, ...ctx });
}

/**
 * Escapes `|` inside code spans on table rows.
 *
 * GFM needs `\|` there even inside backticks, and MDC's serializer writes the
 * bare character, so a row such as | Sum | `A | B` | splits into one cell too
 * many. Fenced code blocks are left alone; rows inside a blockquote are fixed.
 */
export function fixTablePipes(markdown) {
  let fence = null;
  return markdown
    .split("\n")
    .map((line) => {
      const fenceMatch = line.match(/^(?:>\s?)*\s*(`{3,}|~{3,})/);
      if (fenceMatch) {
        const marker = fenceMatch[1];
        if (fence === null) fence = marker;
        else if (marker[0] === fence[0] && marker.length >= fence.length) fence = null;
        return line;
      }
      if (fence !== null || !/^(?:>\s?)*\s*\|/.test(line)) return line;
      let out = "";
      let open = 0;
      for (let i = 0; i < line.length;) {
        if (line[i] === "`") {
          let run = 0;
          while (line[i + run] === "`") run++;
          if (open === 0) open = run;
          else if (run === open) open = 0;
          out += "`".repeat(run);
          i += run;
          continue;
        }
        if (line[i] === "\\") {
          out += line.slice(i, i + 2);
          i += 2;
          continue;
        }
        out += open && line[i] === "|" ? "\\|" : line[i];
        i++;
      }
      return out;
    })
    .join("\n");
}

/** A description on one line, as an llms.txt entry or a page's summary needs it. */
export const oneLine = (text) => (typeof text === "string" ? text.replace(/\s+/g, " ").trim() : "");

/** The URL of a page's Markdown: `/docs/learn/hello` → `https://rux-lang.dev/docs/learn/hello.md`. */
export const markdownUrl = (path, site = SITE) => `${site}${path}.md`;

/**
 * Orders content stems as the sidebar does: segment by segment, numeric
 * prefixes compared as numbers (`2.x` before `10.x`), an `index` page first.
 */
export function naturalStemCompare(a, b) {
  const left = a.split("/");
  const right = b.split("/");
  for (let i = 0; i < Math.min(left.length, right.length); i++) {
    if (left[i] === right[i]) continue;
    const index = (segment) => /^(\d+\.)?index$/.test(segment);
    if (index(left[i]) !== index(right[i])) return index(left[i]) ? -1 : 1;
    return left[i].localeCompare(right[i], "en", { numeric: true });
  }
  return left.length - right.length;
}

/**
 * One page as Markdown: its title, its canonical URL, its summary, then the
 * cleaned body. The body's own leading `# Title` is dropped, since the header
 * already states it.
 */
export async function renderPage(doc, ctx = {}) {
  const site = ctx.site ?? SITE;
  const title = oneLine(doc.title || doc.seo?.title || "");
  const summary = oneLine(doc.seo?.description || doc.description || "");
  let nodes = doc.body?.value ?? [];
  const lead = nodes.findIndex((node) => typeof node !== "string" || node.trim() !== "");
  if (Array.isArray(nodes[lead]) && nodes[lead][0] === "h1") nodes = nodes.slice(lead + 1);

  const cleaned = cleanBody(nodes, { ...ctx, site, page: doc.path });
  const body = (await stringifyMarkdown(toHast({ type: "minimark", value: cleaned }), {})) ?? "";

  const header = [`# ${title}`, "", `Source: ${site}${doc.path}`];
  if (summary && !body.trimStart().startsWith(summary)) header.push("", `> ${summary}`);
  return `${fixTablePipes(`${header.join("\n")}\n\n${body.trim()}`).trimEnd()}\n`;
}

/** Plain-list stand-in for `:learn-roadmap`: every part, grouped by stage, linked to its overview. */
export function roadmapNodes(parts, site = SITE) {
  const stages = [
    ["The language — parts 1–13, in order", 1, 13],
    ["In depth — parts 14–17, in order", 14, 17],
    ["Standard packages — parts 18–26, in any order", 18, 26],
    ["Projects — part 27, checkpoints", 27, 27],
  ];
  return stages.flatMap(([title, from, to]) => [
    ["p", {}, ["strong", {}, title]],
    [
      "ul",
      {},
      ...parts
        .filter((part) => part.number >= from && part.number <= to)
        .map((part) => [
          "li",
          {},
          ["a", { href: `${site}/docs/learn/${part.slug}` }, `${part.number}. ${part.title}`],
          `: ${part.summary}`,
        ]),
    ],
  ]);
}

/** Plain-list stand-in for `:api-packages`: every package with a page, grouped by hub area. */
export function apiPackageNodes(areas, packages, hasPage, site = SITE) {
  return areas.flatMap((area) => {
    const entries = packages.filter((entry) => entry.area === area.slug && hasPage(entry.path));
    if (!entries.length) return [];
    return [
      ["p", {}, ["strong", {}, area.title]],
      [
        "ul",
        {},
        ...entries.map((entry) => [
          "li",
          {},
          ["a", { href: `${site}${entry.path}` }, entry.name],
          ...(entry.description ? [`: ${entry.description}`] : []),
        ]),
      ],
    ];
  });
}

/** An approximate token count for a document set, as llms.txt advertises it. */
export function approxTokens(bytes) {
  const tokens = bytes / 4;
  if (tokens >= 1e6) return `≈${(tokens / 1e6).toFixed(1)}M tokens`;
  return `≈${Math.max(1, Math.round(tokens / 1e3))}k tokens`;
}

/**
 * /llms.txt in the llmstxt.org shape: a title, a one-paragraph summary, notes,
 * the document sets, then one section per book linking every page's Markdown.
 */
export function renderIndex({ title, summary, notes = [], sets = [], sections = [] }) {
  const lines = [`# ${title}`, "", `> ${oneLine(summary)}`, ""];
  for (const note of notes) lines.push(`- ${note}`);
  if (notes.length) lines.push("");
  if (sets.length) {
    lines.push("## Documentation sets", "");
    for (const set of sets) lines.push(`- [${set.title}](${set.url}): ${oneLine(set.description)}`);
    lines.push("");
  }
  for (const section of sections) {
    lines.push(`## ${section.title}`, "");
    if (section.description) lines.push(oneLine(section.description), "");
    for (const link of section.links) {
      const description = oneLine(link.description);
      lines.push(`- [${oneLine(link.title)}](${link.url})${description ? `: ${description}` : ""}`);
    }
    lines.push("");
  }
  return `${lines.join("\n").trimEnd()}\n`;
}
