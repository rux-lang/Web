/**
 * Renders one package's API Reference from its `rux doc --format json`
 * snapshot (data/api/SCHEMA.md). Pure functions only: the snapshot, the
 * package README and the registry entry go in, a Map of repo-relative path →
 * file contents comes out. scripts/sync-api-reference.mjs writes the result and
 * scripts/verify-api.mjs compares it with what is on disk.
 *
 * Headings that carry an anchor are written as raw HTML, `<h3 id="reset">`.
 * MDC does not honour the `### Reset {#reset}` attribute syntax on a heading —
 * the braces stay in the text and the id becomes the slug of all of it
 * (`reset-reset`). Its compiler does keep an `id` the hast node already has
 * (`properties.id || slugs.slug(…)` in @nuxtjs/mdc's parser/compiler.js), and
 * raw HTML in Markdown reaches it as an ordinary element, so an HTML heading
 * keeps exactly the anchor its `@see` URL names, still renders through
 * ProseH3 and still lands in the page's table of contents. The plain `##`
 * section headings keep their github-slug ids, which is why `assertUniqueIds`
 * checks the explicit anchors against those slugs.
 */
import { format } from "prettier";
import { API_ROOT, GENERATED, KIND_GROUPS } from "./api-packages.mjs";

const SITE = "https://rux-lang.dev";
const API_URL = /^https:\/\/rux-lang\.dev\/docs\/api\/([^/?#]*)(?:\/([^?#]*))?(?:#(.*))?$/;
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** The anchors operators get: an operator's own spelling slugs to nothing. */
export const OPERATOR_SLUGS = {
  "==": "equals",
  "!=": "not-equals",
  "<": "less",
  "<=": "less-or-equal",
  ">": "greater",
  ">=": "greater-or-equal",
  "<=>": "compare",
  "+": "add",
  "-": "subtract",
  "*": "multiply",
  "/": "divide",
  "%": "remainder",
  "&": "bit-and",
  "|": "bit-or",
  "^": "bit-xor",
  "~": "bit-not",
  "<<": "shift-left",
  ">>": "shift-right",
  "!": "not",
  "+=": "add-assign",
  "-=": "subtract-assign",
  "*=": "multiply-assign",
  "/=": "divide-assign",
  "%=": "remainder-assign",
  "&=": "bit-and-assign",
  "|=": "bit-or-assign",
  "^=": "bit-xor-assign",
  "<<=": "shift-left-assign",
  ">>=": "shift-right-assign",
  "[]": "index",
  "[]=": "index-assign",
  "()": "call",
  "=": "copy",
  "<-": "move",
};

/** Unary spellings that share a token with a binary operator. */
const UNARY_OPERATOR_SLUGS = { "-": "negate", "+": "plus", "*": "dereference", "&": "address-of" };

/** `BytesUsed` → `bytes-used`, `UTF8Decode` → `utf8-decode`, `IOError` → `io-error`. */
export function kebab(name) {
  return name
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1-$2")
    .replace(/[_\s]+/g, "-")
    .toLowerCase();
}

/** The default anchor of a member: its kebab-cased name, with the special cases. */
export function memberSlug(member) {
  if (member.kind === "constructor") return "new";
  if (member.kind === "destructor") return "destructor";
  if (member.kind === "operator") {
    const slug = (member.params.length === 0 && UNARY_OPERATOR_SLUGS[member.name]) || OPERATOR_SLUGS[member.name];
    if (!slug) throw new Error(`No anchor is defined for operator \`${member.name}\`; add it to OPERATOR_SLUGS`);
    return slug;
  }
  return kebab(member.name);
}

/**
 * What a github-slugger id looks like after @nuxtjs/mdc's clean-up, for the
 * ASCII headings this renderer writes. Used only to detect a collision between
 * a section heading's id and an explicit anchor.
 */
export function headingSlug(text) {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s_-]/gu, "")
    .replace(/\s/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Every id a rendered page's headings get: the explicit ones, and the slug of
 * each plain Markdown heading (numbered on repeats, as github-slugger does).
 */
export function pageAnchors(markdown) {
  const ids = new Set();
  const seen = new Map();
  for (const { fenced, text } of splitFences(markdown.replace(/^---\n[\s\S]*?\n---\n/, ""))) {
    if (fenced) continue;
    for (const match of text.matchAll(/<h[1-6] id="([^"]+)"/g)) ids.add(match[1]);
    for (const match of text.matchAll(/^#{1,6}\s+(.+?)\s*$/gm)) {
      const heading = plainText(match[1]).replaceAll("&lt;", "<").replaceAll("&gt;", ">").replaceAll("&amp;", "&");
      const slug = headingSlug(heading);
      const count = seen.get(slug) ?? 0;
      seen.set(slug, count + 1);
      ids.add(count ? `${slug}-${count}` : slug);
    }
  }
  return ids;
}

/** `{ slug, page, anchor }` for a rux-lang.dev API URL, `null` for any other URL. */
export function parseApiUrl(url) {
  const match = API_URL.exec(url);
  if (!match) return null;
  return { slug: match[1], page: match[2] ?? "", anchor: match[3] ?? null };
}

export const apiUrl = (slug, page, anchor = null) => `${SITE}/docs/api/${slug}/${page}${anchor ? `#${anchor}` : ""}`;

/** The site-relative form a page links with. */
const sitePath = (url) => url.slice(SITE.length);

const packageSlug = (snapshot) => snapshot.package.name.toLowerCase();
const isPublic = (member) => member.public !== false;
const memberLabel = (item, member) => `${item.name}::${member.name}`;

function routingUrl(see, slug, owner) {
  const url = see.find((subject) => subject.startsWith(`${SITE}/docs/api/`));
  if (!url) return null;
  const parsed = parseApiUrl(url);
  if (parsed.slug !== slug) {
    throw new Error(`${owner} routes to ${url}, which names another package than ${slug}`);
  }
  if (!SLUG.test(parsed.page)) {
    throw new Error(`${owner} routes to ${url}: the page must be one kebab-case segment after /docs/api/${slug}/`);
  }
  if (parsed.anchor !== null && !SLUG.test(parsed.anchor)) {
    throw new Error(`${owner} routes to ${url}: the anchor must be kebab-case`);
  }
  return parsed;
}

/**
 * Places every public item and member of a package. Returns the routing table
 * plus the per-page view the renderer needs:
 *
 * - `routes`: url → { page, anchor, item, member }
 * - `pages`: page → { owner, sections } (sections: items placed by fragment)
 * - `places`: item or member → { page, anchor, url }
 */
export function planPackage(snapshot) {
  const slug = packageSlug(snapshot);
  const routes = new Map();
  const pages = new Map();
  const places = new Map();

  const describe = ({ item, member }) => (member ? memberLabel(item, member) : item.name);
  const claim = (page, anchor, target) => {
    const url = apiUrl(slug, page, anchor);
    const existing = routes.get(url);
    if (existing) throw new Error(`${describe(existing)} and ${describe(target)} both claim ${url}`);
    routes.set(url, { page, anchor, ...target });
    places.set(target.member ?? target.item, { page, anchor, url });
    return url;
  };
  const pageOf = (page) => {
    if (!pages.has(page)) pages.set(page, { owner: null, sections: [] });
    return pages.get(page);
  };

  // Items first, owners before sections, so a member never claims an anchor
  // before the item that owns its page is known.
  const placed = snapshot.items.map((item) => {
    const route = routingUrl(item.doc.see, slug, item.name) ?? { page: kebab(item.name), anchor: null };
    return { item, ...route };
  });
  for (const { item, page, anchor } of placed) {
    if (anchor !== null) continue;
    const entry = pageOf(page);
    if (entry.owner) throw new Error(`${entry.owner.name} and ${item.name} both claim ${apiUrl(slug, page)}`);
    entry.owner = item;
    claim(page, null, { item, member: null });
  }
  for (const { item, page, anchor } of placed) {
    if (anchor === null) continue;
    pageOf(page).sections.push(item);
    claim(page, anchor, { item, member: null });
  }

  for (const { item, page, anchor } of placed) {
    const prefix = anchor === null ? "" : `${anchor}-`;
    const defaults = new Map();
    for (const member of item.members.filter(isPublic)) {
      const label = memberLabel(item, member);
      const route = routingUrl(member.doc.see, slug, label);
      if (route) {
        if (route.anchor === null) throw new Error(`${label} cannot own a page; give its URL a #fragment`);
        if (route.page !== page) {
          throw new Error(`${label} routes to page ${route.page}, but it renders with ${item.name} on page ${page}`);
        }
        claim(page, route.anchor, { item, member });
        continue;
      }
      // Overloads share a name, so the second and later default to -2, -3, ….
      const base = `${prefix}${memberSlug(member)}`;
      const seen = (defaults.get(base) ?? 0) + 1;
      defaults.set(base, seen);
      claim(page, seen === 1 ? base : `${base}-${seen}`, { item, member });
    }
  }

  return { slug, routes, pages, places };
}

/**
 * The routing table: every public item and member's canonical URL → where it
 * renders. Throws when two things claim one page+anchor, when a URL names
 * another package, and when a member's URL tries to own a page or leave its
 * type's page.
 */
export function planRoutes(snapshot) {
  return new Map([...planPackage(snapshot).routes].map(([url, { page, anchor }]) => [url, { page, anchor }]));
}

// ---------------------------------------------------------------------------
// Markdown helpers

const escapeHtml = (text) => text.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");

/** A code span that survives backticks in its content. */
export function code(text) {
  const runs = text.match(/`+/g) ?? [];
  const fence = "`".repeat(Math.max(0, ...runs.map((run) => run.length)) + 1);
  const pad = text.startsWith("`") || text.endsWith("`") ? " " : "";
  return `${fence}${pad}${text}${pad}${fence}`;
}

const cell = (markdown) => (markdown ?? "").replace(/\s*\n\s*/g, " ").replaceAll("|", "\\|");

function table(headers, rows) {
  if (!rows.length) return "";
  return [
    `| ${headers.join(" | ")} |`,
    `| ${headers.map(() => "---").join(" | ")} |`,
    ...rows.map((row) => `| ${row.join(" | ")} |`),
  ].join("\n");
}

const fence = (language, body) => `\`\`\`${language}\n${body}\n\`\`\``;

/** An anchored heading; see the comment at the top of this file. */
const anchoredHeading = (level, id, text) => `<h${level} id="${id}"><code>${escapeHtml(text)}</code></h${level}>`;

/** Markdown → one line of plain text, for frontmatter descriptions. */
export function plainText(markdown) {
  return (markdown ?? "")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/`+([^`]*?)`+/g, "$1")
    .replace(/(\*\*|__)(.*?)\1/g, "$2")
    .replace(/(?<![\w*])[*_]([^*_]+)[*_](?![\w*])/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

/** Splits Markdown into fenced blocks and the prose between them. */
function splitFences(markdown) {
  const parts = [];
  let prose = [];
  let block = null;
  for (const line of markdown.split("\n")) {
    if (block) {
      block.lines.push(line);
      if (line.trimStart().startsWith(block.marker) && line.trim().replaceAll(block.marker[0], "") === "") {
        parts.push({ fenced: true, text: block.lines.join("\n") });
        block = null;
      }
      continue;
    }
    const open = /^\s{0,3}(`{3,}|~{3,})/.exec(line);
    if (open) {
      if (prose.length) parts.push({ fenced: false, text: prose.join("\n") });
      prose = [];
      block = { marker: open[1], lines: [line] };
      continue;
    }
    prose.push(line);
  }
  if (block) parts.push({ fenced: true, text: block.lines.join("\n") });
  if (prose.length) parts.push({ fenced: false, text: prose.join("\n") });
  return parts;
}

/**
 * Makes compiler prose safe for MDC and links its identifiers. Outside code,
 * `<` is escaped — MDC parses `Box<T>` in text as an HTML element named `t`,
 * which swallows the rest of the line (and, in a table, the rest of the row).
 * Autolinks such as `<https://…>` are kept. A code span becomes a link when
 * `resolve` returns a target for it, except inside a heading, inside link text
 * or inside a fence.
 */
export function transformProse(markdown, resolve = () => null) {
  return splitFences(markdown)
    .map(({ fenced, text }) => (fenced ? text : transformInline(text, resolve)))
    .join("\n");
}

function transformInline(text, resolve) {
  let out = "";
  let index = 0;
  while (index < text.length) {
    const tick = text.indexOf("`", index);
    const plain = tick === -1 ? text.slice(index) : text.slice(index, tick);
    out += plain.replace(/<(?!https?:\/\/[^\s>]+>)/g, "&lt;");
    if (tick === -1) break;
    const run = /^`+/.exec(text.slice(tick))[0];
    const close = text.indexOf(run, tick + run.length);
    // An unmatched run is literal text, per CommonMark.
    if (close === -1 || text[close + run.length] === "`") {
      out += run;
      index = tick + run.length;
      continue;
    }
    const span = text.slice(tick, close + run.length);
    const content = text.slice(tick + run.length, close).trim();
    const line = out.slice(out.lastIndexOf("\n") + 1);
    const inHeading = /^\s{0,3}#/.test(line);
    const inLinkText = line.lastIndexOf("[") > line.lastIndexOf("]");
    const target = inHeading || inLinkText ? null : resolve(content);
    out += target ? `[${span}](${target})` : span;
    index = close + run.length;
  }
  return out;
}

/**
 * Whether a callout body is safe from Nuxt UI's unwrapping, which drops a
 * whitespace-only text node between two inline elements (see verify-learn's
 * callout rule).
 */
export function calloutSafe(markdown) {
  const shape = markdown
    .replace(/`[^`]+`/g, "C")
    .replace(/\[[^\]]*\]\([^)]*\)/g, "L")
    .replace(/\*\*[^*]+\*\*/g, "B")
    .replace(/(?<![*\w])_[^_]+_(?!\w)/g, "E");
  return !/[CLBE] +[CLBE]/.test(shape);
}

/** A YAML scalar that reads back as the same string: plain when that is safe, quoted otherwise (`1.0`, `Box<T>`). */
function yamlString(value) {
  const plain =
    /^[A-Za-z0-9/][\w ./()-]*$/.test(value) &&
    !/^(true|false|null|yes|no|on|off)$/i.test(value) &&
    Number.isNaN(Number(value));
  return plain ? value : JSON.stringify(value);
}

function frontmatter({ title, description, path, navigation, api, seoTitle }) {
  const lines = [
    "---",
    `title: ${yamlString(title)}`,
    `description: ${yamlString(description)}`,
    `path: ${path}`,
    "navigation:",
    `  title: ${yamlString(navigation)}`,
    "api:",
    ...Object.entries(api)
      .filter(([, value]) => value !== undefined && value !== null)
      .map(([key, value]) => `  ${key}: ${typeof value === "number" ? value : yamlString(value)}`),
    "seo:",
    `  title: ${yamlString(seoTitle)}`,
    `  description: ${yamlString(description)}`,
    "---",
  ];
  return lines.join("\n");
}

// ---------------------------------------------------------------------------
// Signatures

/** `name: type` pairs from a one-line function signature, for items the snapshot gives no `params` list. */
export function signatureParams(signature) {
  let depth = 0;
  let start = -1;
  for (let index = 0; index < signature.length; index++) {
    const char = signature[index];
    if (char === "<") depth++;
    else if (char === ">" && signature[index - 1] !== "-") depth--;
    else if (char === "(" && depth === 0) {
      start = index;
      break;
    }
  }
  if (start === -1) return [];
  const params = [];
  let nesting = 0;
  let current = "";
  for (let index = start + 1; index < signature.length; index++) {
    const char = signature[index];
    if ("([{<".includes(char)) nesting++;
    if (")]}".includes(char) || (char === ">" && signature[index - 1] !== "-")) {
      if (nesting === 0) {
        params.push(current);
        break;
      }
      nesting--;
    }
    if (char === "," && nesting === 0) {
      params.push(current);
      current = "";
      continue;
    }
    current += char;
  }
  return params
    .map((param) => param.trim())
    .filter(Boolean)
    .map((param) => {
      const colon = param.indexOf(":");
      return colon === -1
        ? { name: param, type: "" }
        : {
            name: param.slice(0, colon).trim(),
            type: param
              .slice(colon + 1)
              .replace(/=.*$/, "")
              .trim(),
          };
    })
    .filter((param) => param.name !== "self");
}

const withValue = (signature, value) =>
  value === null || value === undefined || /=/.test(signature.replace(/[=!<>]=|=>|<-/g, ""))
    ? signature
    : `${signature} = ${value}`;

function itemSignature(item) {
  const indent = "    ";
  if (item.kind === "struct" || item.kind === "union") {
    const shown = item.fields.filter((field) => field.public);
    const hidden = shown.length < item.fields.length;
    if (!shown.length && !hidden) return `${item.signature} {}`;
    const body = shown.map((field) => `${indent}pub ${field.name}: ${field.type};`);
    if (hidden) body.push(`${indent}// private fields`);
    return [`${item.signature} {`, ...body, "}"].join("\n");
  }
  if (item.kind === "enum" || item.kind === "variant") {
    // The compiler's declaration signature stops at the name; an enum's base type comes separately.
    const head =
      item.baseType && !item.signature.includes(":") ? `${item.signature}: ${item.baseType}` : item.signature;
    if (!item.cases.length) return `${head} {}`;
    const body = item.cases.map((entry, index) => {
      const payload = entry.payload ? (entry.payload.startsWith("{") ? ` ${entry.payload}` : entry.payload) : "";
      const value = entry.value !== null && entry.value !== undefined ? ` = ${entry.value}` : "";
      return `${indent}${entry.name}${payload}${value}${index < item.cases.length - 1 ? "," : ""}`;
    });
    return [`${head} {`, ...body, "}"].join("\n");
  }
  if (item.kind === "interface") {
    const requirements = item.members.filter((member) => member.kind === "requirement" && isPublic(member));
    if (!requirements.length) return `${item.signature} {}`;
    const body = requirements.map((member) => `${indent}${member.signature.replace(/;?$/, ";")}`);
    return [`${item.signature} {`, ...body, "}"].join("\n");
  }
  if (item.kind === "constant") return `${withValue(item.signature, item.value)};`.replace(/;;$/, ";");
  return item.signature;
}

function memberSignature(member) {
  if (member.kind === "constant") return `${withValue(member.signature, member.value)};`.replace(/;;$/, ";");
  return member.signature;
}

const memberDisplay = (member) =>
  member.kind === "destructor" && !member.name.startsWith("~") ? `~${member.name}` : member.name;

// ---------------------------------------------------------------------------
// Rendering

const MEMBER_SECTIONS = [
  { kind: "constructor", title: "Constructors" },
  { kind: "associated", title: "Associated functions" },
  { kind: "method", title: "Methods" },
  { kind: "operator", title: "Operators" },
];

function sourceUrl(snapshot, source, line) {
  const repository = (snapshot.package.repository ?? "https://github.com/rux-lang/Rux").replace(/\/$/, "");
  return `${repository}/blob/main/Packages/${snapshot.package.name}/${source}#L${line}`;
}

/** Splits an item's prose into the summary and what follows it. */
function splitSummary(doc) {
  const summary = (doc.summary ?? "").trim();
  const markdown = (doc.markdown ?? "").trim();
  if (summary && markdown.startsWith(summary)) return { summary, rest: markdown.slice(summary.length).trim() };
  return { summary: summary || markdown.split(/\n\s*\n/)[0], rest: summary ? markdown : "" };
}

/**
 * Builds the identifier index auto-linking resolves against: every public
 * item by name and display name, and every public member by bare name and as
 * `Type::Member`. A name two targets share is ambiguous and never linked,
 * except that a member of the item being described wins over every other.
 */
function linkIndex(snapshot, plan) {
  const names = new Map();
  const add = (name, url) => {
    if (!names.has(name)) names.set(name, new Set());
    names.get(name).add(url);
  };
  for (const item of snapshot.items) {
    const url = plan.places.get(item).url;
    add(item.name, url);
    add(item.displayName, url);
    for (const member of item.members.filter(isPublic)) {
      const memberUrl = plan.places.get(member).url;
      add(`${item.name}::${member.name}`, memberUrl);
      if (member.kind === "destructor") add(memberDisplay(member), memberUrl);
      else if (!["constructor", "operator"].includes(member.kind)) add(member.name, memberUrl);
    }
  }
  return names;
}

function makeResolver(snapshot, plan, index) {
  return (context) => (text) => {
    const candidates = [text, text.replace(/\(\)$/, "").replace(/<[^<>]*>/g, "")];
    for (const candidate of candidates) {
      let url = null;
      const own = context?.item?.members.find((member) => isPublic(member) && member.name === candidate);
      if (own && !["constructor", "destructor", "operator"].includes(own.kind)) url = plan.places.get(own).url;
      else if (index.get(candidate)?.size === 1) url = [...index.get(candidate)][0];
      if (url) return url === context?.self ? null : sitePath(url);
    }
    return null;
  };
}

class PageWriter {
  constructor() {
    this.blocks = [];
    this.explicit = [];
    this.headings = [];
  }
  add(...blocks) {
    for (const block of blocks) if (block) this.blocks.push(block);
  }
  section(level, title) {
    if (level === null) {
      this.add(`**${title}**`);
      return;
    }
    this.headings.push(title);
    this.add(`${"#".repeat(level)} ${title}`);
  }
  anchored(level, id, text) {
    this.explicit.push(id);
    this.add(anchoredHeading(level, id, text));
  }
  /** Throws when an explicit anchor equals the id MDC gives a plain heading. */
  assertUniqueIds(file) {
    const seen = new Map();
    const slugs = this.headings.map((title) => {
      const slug = headingSlug(title);
      const count = seen.get(slug) ?? 0;
      seen.set(slug, count + 1);
      return count ? `${slug}-${count}` : slug;
    });
    for (const id of this.explicit) {
      if (slugs.includes(id)) throw new Error(`${file}: the anchor #${id} collides with a section heading`);
    }
  }
  toString() {
    return `${this.blocks.join("\n\n")}\n`;
  }
}

/** The deprecation callout and the "See also" line, for the `@see` URLs other than the item's own. */
function renderDocExtras(doc, { prose, skipUrl }) {
  const extras = [];
  if (doc.deprecated) {
    const body = prose(doc.deprecated);
    extras.push(
      calloutSafe(body)
        ? `::warning\n**Deprecated.**\\\n${body}\n::`
        : `> **Deprecated.**\\\n> ${body.replace(/\n/g, "\n> ")}`,
    );
  }
  const see = doc.see
    .filter((url) => url !== skipUrl)
    .map((url) => {
      const label = url.startsWith(`${SITE}/`) ? sitePath(url) : url;
      return `[${label.replace(/^\/docs\/api\//, "")}](${url.startsWith(`${SITE}/`) ? sitePath(url) : url})`;
    });
  if (see.length) extras.push(`**See also**: ${see.join(", ")}`);
  return extras;
}

function renderMember(page, ctx, item, member, level, { heading = true } = {}) {
  const place = ctx.plan.places.get(member);
  const prose = (markdown) => transformProse(markdown, ctx.resolve({ item, self: place.url }));
  if (heading) page.anchored(level, place.anchor, memberDisplay(member));
  page.add(fence("rux", memberSignature(member)));
  if (member.doc.markdown) page.add(prose(member.doc.markdown));
  const typeDocs = new Map(member.doc.typeParams.map((entry) => [entry.name, entry.markdown]));
  page.add(
    table(
      ["Type parameter", "Description"],
      member.typeParams.map((param) => [
        code(param.bounds?.length ? `${param.name}: ${param.bounds.join(" + ")}` : param.name),
        cell(prose(typeDocs.get(param.name) ?? "")),
      ]),
    ),
  );
  const paramDocs = new Map(member.doc.params.map((entry) => [entry.name, entry.markdown]));
  page.add(
    table(
      ["Name", "Type", "Description"],
      member.params
        .filter((param) => param.name !== "self")
        .map((param) => [code(param.name), code(param.type), cell(prose(paramDocs.get(param.name) ?? ""))]),
    ),
  );
  if (member.doc.returns) page.add(`**Returns**: ${prose(member.doc.returns)}`);
  page.add(...renderDocExtras(member.doc, { prose, skipUrl: place.url }));
  page.add(`[Source](${sourceUrl(ctx.snapshot, item.source, member.line)})`);
}

/**
 * Everything below an item's prose: its tables and members. `sectionLevel` is
 * the heading level of "Fields", "Methods" and the rest, or `null` to write
 * them as bold labels (an item rendered inside another page's section).
 */
function renderItemSections(page, ctx, item, sectionLevel, memberLevel) {
  const place = ctx.plan.places.get(item);
  const prose = (markdown) => transformProse(markdown, ctx.resolve({ item, self: place.url }));

  const typeDocs = new Map(item.doc.typeParams.map((entry) => [entry.name, entry.markdown]));
  if (item.typeParams.length) {
    page.section(sectionLevel, "Type parameters");
    page.add(
      table(
        ["Name", "Description"],
        item.typeParams.map((param) => [
          code(param.bounds?.length ? `${param.name}: ${param.bounds.join(" + ")}` : param.name),
          cell(prose(typeDocs.get(param.name) ?? "")),
        ]),
      ),
    );
  }

  if (["function", "extern"].includes(item.kind)) {
    const params = item.params ?? signatureParams(item.signature);
    const paramDocs = new Map(item.doc.params.map((entry) => [entry.name, entry.markdown]));
    if (params.length) {
      page.section(sectionLevel, "Parameters");
      page.add(
        table(
          ["Name", "Type", "Description"],
          params.map((param) => [
            code(param.name),
            param.type ? code(param.type) : "",
            cell(prose(paramDocs.get(param.name) ?? "")),
          ]),
        ),
      );
    }
    if (item.doc.returns) page.add(`**Returns**: ${prose(item.doc.returns)}`);
  }

  const fields = (item.fields ?? []).filter((field) => field.public);
  if (fields.length) {
    page.section(sectionLevel, "Fields");
    page.add(
      table(
        ["Name", "Type", "Description"],
        fields.map((field) => [code(field.name), code(field.type), cell(prose(field.doc ?? ""))]),
      ),
    );
  }

  const cases = item.cases ?? [];
  if (cases.length) {
    const valued = cases.some((entry) => entry.value !== null && entry.value !== undefined);
    page.section(sectionLevel, "Cases");
    page.add(
      table(
        valued ? ["Name", "Value", "Description"] : ["Name", "Description"],
        cases.map((entry) => {
          const payload = entry.payload ? (entry.payload.startsWith("{") ? ` ${entry.payload}` : entry.payload) : "";
          const row = [code(`${entry.name}${payload}`)];
          if (valued) row.push(entry.value !== null && entry.value !== undefined ? code(String(entry.value)) : "");
          row.push(cell(prose(entry.doc ?? "")));
          return row;
        }),
      ),
    );
  }

  const members = item.members.filter(isPublic);
  const requirements = members.filter((member) => member.kind === "requirement");
  if (requirements.length) {
    page.section(sectionLevel, "Requirements");
    for (const member of requirements) renderMember(page, ctx, item, member, memberLevel);
  }

  if (item.kind === "interface") {
    const implementations = ctx.snapshot.items.filter((other) => other.implements?.includes(item.name));
    if (implementations.length) {
      page.section(sectionLevel, "Implementations");
      page.add(
        table(
          ["Type", "Summary"],
          implementations.map((other) => [
            `[${code(other.displayName)}](${sitePath(ctx.plan.places.get(other).url)})`,
            cell(transformProse(other.doc.summary ?? "", ctx.resolve({ item: other, self: null }))),
          ]),
        ),
      );
    }
  }

  const own = members.filter((member) => !member.conformance && member.kind !== "requirement");
  for (const { kind, title } of MEMBER_SECTIONS) {
    const group = own.filter((member) => member.kind === kind);
    if (!group.length) continue;
    page.section(sectionLevel, title);
    for (const member of group) renderMember(page, ctx, item, member, memberLevel);
  }

  const conformances = [...(item.implements ?? [])];
  for (const member of members) {
    if (member.conformance && !conformances.includes(member.conformance)) conformances.push(member.conformance);
  }
  for (const name of conformances) {
    page.section(sectionLevel, `Implements ${name}`);
    const target = ctx.snapshot.items.find((other) => other.kind === "interface" && other.name === name);
    const link = target ? `[${code(name)}](${sitePath(ctx.plan.places.get(target).url)})` : code(name);
    page.add(`${code(item.displayName)} conforms to ${link}.`);
    for (const member of members.filter((entry) => entry.conformance === name)) {
      renderMember(page, ctx, item, member, memberLevel);
    }
  }

  const constants = own.filter((member) => member.kind === "constant");
  if (constants.length) {
    page.section(sectionLevel, "Constants");
    for (const member of constants) renderMember(page, ctx, item, member, memberLevel);
  }

  const destructor = own.find((member) => member.kind === "destructor");
  if (destructor) {
    page.section(sectionLevel, "Destructor");
    // The section heading's own id is `destructor`, the destructor's default
    // anchor, so on an item's own page the destructor needs no heading of its
    // own — a second element with that id would be a duplicate.
    const anchor = ctx.plan.places.get(destructor).anchor;
    renderMember(page, ctx, item, destructor, memberLevel, {
      heading: !(sectionLevel !== null && anchor === headingSlug("Destructor")),
    });
  }
}

/** An item placed on another item's page or a topic page: heading, signature, prose, members. */
function renderPlacedItem(page, ctx, item, level, sectionLevel, memberLevel) {
  const place = ctx.plan.places.get(item);
  const prose = (markdown) => transformProse(markdown, ctx.resolve({ item, self: place.url }));
  page.anchored(level, place.anchor, item.displayName);
  page.add(fence("rux", itemSignature(item)));
  if (item.doc.markdown) page.add(prose(item.doc.markdown));
  page.add(...renderDocExtras(item.doc, { prose, skipUrl: place.url }));
  page.add(`[Source](${sourceUrl(ctx.snapshot, item.source, item.line)})`);
  renderItemSections(page, ctx, item, sectionLevel, memberLevel);
}

function generatedComment(slug) {
  return `<!-- Generated by scripts/sync-api-reference.mjs from data/api/${slug}.json. Do not edit. -->`;
}

function groupFor(kind) {
  const group = KIND_GROUPS.find((entry) => entry.kinds.includes(kind));
  if (!group) throw new Error(`No KIND_GROUPS entry covers the kind "${kind}"`);
  return group;
}

function renderItemPage(ctx, pageSlug, { owner, sections }) {
  const { snapshot, plan } = ctx;
  const place = plan.places.get(owner);
  const prose = (markdown) => transformProse(markdown, ctx.resolve({ item: owner, self: place.url }));
  const { summary, rest } = splitSummary(owner.doc);
  const description = plainText(summary) || owner.displayName;
  const page = new PageWriter();
  page.add(
    frontmatter({
      title: owner.displayName,
      description,
      path: `/docs/api/${plan.slug}/${pageSlug}`,
      navigation: owner.displayName,
      api: {
        package: snapshot.package.name,
        kind: owner.kind,
        version: snapshot.package.version,
        source: owner.source,
        line: owner.line,
      },
      seoTitle: `${owner.displayName} — ${snapshot.package.name} API`,
    }),
  );
  page.add(generatedComment(plan.slug));
  page.add(`# ${escapeHtml(owner.displayName)}`);
  if (summary) page.add(prose(summary));
  page.add(fence("rux", itemSignature(owner)));
  if (rest) page.add(prose(rest));
  page.add(...renderDocExtras(owner.doc, { prose, skipUrl: place.url }));
  renderItemSections(page, ctx, owner, 2, 3);
  if (sections.length) {
    page.section(2, "Related");
    for (const item of sections) renderPlacedItem(page, ctx, item, 3, null, 4);
  }
  return page;
}

function renderTopicPage(ctx, pageSlug, { sections }, entry) {
  const { snapshot, plan } = ctx;
  const topic = entry.topics?.[pageSlug];
  if (!topic) {
    throw new Error(
      `${apiUrl(plan.slug, pageSlug)} is a topic page (only #fragment URLs point at it), but the registry entry for ${snapshot.package.name} has no topics["${pageSlug}"] title`,
    );
  }
  const first = sections[0];
  const title = typeof topic === "string" ? topic : topic.title;
  const lead = (typeof topic === "string" ? null : topic.description) ?? first.doc.summary ?? title;
  const description = plainText(lead);
  const page = new PageWriter();
  page.add(
    frontmatter({
      title,
      description,
      path: `/docs/api/${plan.slug}/${pageSlug}`,
      navigation: title,
      api: {
        package: snapshot.package.name,
        kind: "topic",
        version: snapshot.package.version,
        source: first.source,
        line: first.line,
      },
      seoTitle: `${title} — ${snapshot.package.name} API`,
    }),
  );
  page.add(generatedComment(plan.slug));
  page.add(`# ${escapeHtml(title)}`);
  page.add(transformProse(lead, ctx.resolve(null)));
  for (const item of sections) renderPlacedItem(page, ctx, item, 2, null, 3);
  return page;
}

/**
 * The README as the overview's guide: no H1, no Installation, Documentation
 * or License section, headings one level down, the opening paragraph dropped
 * when it only repeats the manifest description, and relative links pointed
 * at the file in the repository.
 */
export function readmeGuide(readme, snapshot) {
  if (!readme) return "";
  const dropped = /^(installation|documentation|licen[cs]e)$/i;
  const parts = splitFences(readme.replace(/\r\n/g, "\n"));
  const out = [];
  let skipping = false;
  let beforeFirstSection = true;
  let intro = [];
  for (const { fenced, text } of parts) {
    if (fenced) {
      if (!skipping) (beforeFirstSection ? intro : out).push(text);
      continue;
    }
    for (const line of text.split("\n")) {
      const heading = /^(#{1,6})\s+(.*?)\s*#*\s*$/.exec(line);
      if (heading && heading[1].length === 1) continue;
      if (heading && heading[1].length === 2) {
        beforeFirstSection = false;
        skipping = dropped.test(heading[2]);
      }
      if (skipping) continue;
      if (heading) {
        out.push(`${"#".repeat(Math.min(6, heading[1].length + 1))} ${heading[2]}`);
        continue;
      }
      (beforeFirstSection ? intro : out).push(line);
    }
  }
  const normalize = (text) => plainText(text).replace(/\.$/, "").toLowerCase();
  const introText = intro.join("\n").trim();
  const keepIntro = introText && normalize(introText) !== normalize(snapshot.package.description ?? "");
  const base = `https://github.com/rux-lang/Rux/blob/main/Packages/${snapshot.package.name}/`;
  return [keepIntro ? introText : "", out.join("\n").trim()]
    .filter(Boolean)
    .join("\n\n")
    .replace(/\]\((?![a-z][a-z0-9+.-]*:|#|\/)([^)\s]+)\)/gi, (_, target) => `](${base}${target})`);
}

function renderOverview(ctx, readme, entry) {
  const { snapshot, plan } = ctx;
  const pkg = snapshot.package;
  const description = pkg.description ?? entry.description;
  const page = new PageWriter();
  page.add(
    frontmatter({
      title: pkg.name,
      description,
      path: `/docs/api/${plan.slug}`,
      navigation: "Overview",
      api: { package: pkg.name, kind: "package", version: pkg.version },
      seoTitle: `${pkg.name} API`,
    }),
  );
  page.add(generatedComment(plan.slug));
  page.add(`# ${pkg.name}`);
  page.add(transformProse(description.replace(/([^.])$/, "$1."), ctx.resolve(null)));

  page.section(2, "Installation");
  page.add(
    `Add ${code(pkg.name)} to the \`[Dependencies]\` table of your package's \`Rux.toml\`:`,
    fence("toml", `[Dependencies]\n${pkg.name} = { Namespace = "${pkg.namespace}", Version = "${pkg.version}" }`),
    "Standard packages are declared by hand: they ship with the compiler rather than through the registry, so `rux add` cannot add them.",
  );

  if (pkg.dependencies.length) {
    page.section(2, "Dependencies");
    page.add(
      pkg.dependencies
        .map((dependency) => {
          const slug = dependency.name.toLowerCase();
          const name = GENERATED.has(slug) ? `[${code(dependency.name)}](/docs/api/${slug})` : code(dependency.name);
          const only = dependency.targetOS?.length ? ` (${dependency.targetOS.join(", ")} only)` : "";
          return `- ${name} ${dependency.version}${only}`;
        })
        .join("\n"),
    );
  }

  const guide = readmeGuide(readme, snapshot);
  if (guide) {
    page.section(2, "Guide");
    page.add(transformProse(guide, ctx.resolve(null)));
  }

  page.section(2, "Index");
  for (const group of KIND_GROUPS) {
    const items = snapshot.items.filter((item) => group.kinds.includes(item.kind));
    if (!items.length) continue;
    page.section(3, group.title);
    page.add(
      table(
        ["Name", "Summary"],
        items.map((item) => [
          `[${code(item.displayName)}](${sitePath(plan.places.get(item).url)})`,
          cell(transformProse(item.doc.summary ?? "", ctx.resolve({ item, self: plan.places.get(item).url }))),
        ]),
      ),
    );
  }
  return page;
}

/**
 * Renders one package: `content/docs/5.api/<folder>/…` → file contents, every
 * Markdown page already run through Prettier. `readme` is the package README
 * (or null); `entry` is the package's line in scripts/api-packages.mjs.
 */
export async function renderApiPackage(snapshot, readme, entry) {
  if (snapshot.schema !== 1) throw new Error(`Unsupported API snapshot schema ${snapshot.schema}; expected 1`);
  if (snapshot.package.name !== entry.name) {
    throw new Error(`The snapshot is for ${snapshot.package.name}, not ${entry.name}`);
  }
  const plan = planPackage(snapshot);
  const index = linkIndex(snapshot, plan);
  const ctx = { snapshot, plan, resolve: makeResolver(snapshot, plan, index) };
  const base = `${API_ROOT}/${entry.folder}`;
  const files = new Map();
  const write = (relative, page) => {
    page.assertUniqueIds(`${base}/${relative}`);
    files.set(`${base}/${relative}`, page.toString());
  };

  files.set(`${base}/.navigation.yml`, `title: ${yamlString(entry.name)}\nicon: ${entry.icon}\n`);
  write("0.index.md", renderOverview(ctx, readme, entry));

  const groups = new Set();
  for (const [pageSlug, page] of [...plan.pages].sort(([a], [b]) => a.localeCompare(b))) {
    const group = groupFor(page.owner ? page.owner.kind : "topic");
    groups.add(group);
    const rendered = page.owner ? renderItemPage(ctx, pageSlug, page) : renderTopicPage(ctx, pageSlug, page, entry);
    write(`${group.folder}/${pageSlug}.md`, rendered);
  }
  for (const group of groups) files.set(`${base}/${group.folder}/.navigation.yml`, `title: ${group.title}\n`);

  return new Map(
    await Promise.all(
      [...files]
        .sort(([a], [b]) => a.localeCompare(b))
        .map(async ([path, text]) => [
          path,
          await format(text, { parser: path.endsWith(".md") ? "markdown" : "yaml", printWidth: 120 }),
        ]),
    ),
  );
}
