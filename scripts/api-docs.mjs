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
import { API_ROOT, KIND_GROUPS, PACKAGES } from "./api-packages.mjs";

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

/** `BytesUsed` → `bytes-used`, `UTF8Decode` → `utf8-decode`, `IOError` → `io-error`, `#build` → `build`. */
export function kebab(name) {
  return name
    .replace(/[^A-Za-z0-9_\s-]+/g, "")
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1-$2")
    .replace(/[_\s-]+/g, "-")
    .replace(/^-|-$/g, "")
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

const CALLABLE_ITEMS = new Set(["function", "extern"]);
const CALLABLE_MEMBERS = new Set(["constructor", "associated", "method", "operator", "requirement"]);

/**
 * Whether two claims on one URL form an overload set rather than a collision:
 * both items or both members, with the same name, and either both callable
 * (`Print(String)` and `Print(StringView)`) or never present on the same
 * target (`type c_long = int32` on Windows, `int64` elsewhere).
 */
function overloads(a, b) {
  if (Boolean(a.member) !== Boolean(b.member)) return false;
  const [x, y] = a.member ? [a.member, b.member] : [a.item, b.item];
  if (x.name !== y.name) return false;
  const callable = a.member ? CALLABLE_MEMBERS : CALLABLE_ITEMS;
  if (callable.has(x.kind) && callable.has(y.kind)) return true;
  return Boolean(x.targets && y.targets) && !x.targets.some((target) => y.targets.includes(target));
}

/**
 * Places every public item and member of a package. Every URL is claimed by
 * one declaration or by an overload set — declarations of one name that
 * render as one section. Returns the routing table plus the per-page view the
 * renderer needs:
 *
 * - `routes`: url → { page, anchor, entries: [{ item, member }] }
 * - `pages`: page → { owner: items[] | null, sections: items[][] } (sections: items placed by fragment)
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
    if (!existing) routes.set(url, { page, anchor, entries: [target] });
    else {
      const other = existing.entries.find((entry) => !overloads(entry, target));
      if (other) throw new Error(`${describe(other)} and ${describe(target)} both claim ${url}`);
      existing.entries.push(target);
    }
    places.set(target.member ?? target.item, { page, anchor, url });
    return url;
  };
  const pageOf = (page) => {
    if (!pages.has(page)) pages.set(page, { owner: null, sections: new Map() });
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
    claim(page, null, { item, member: null });
    const entry = pageOf(page);
    entry.owner = [...(entry.owner ?? []), item];
  }
  for (const { item, page, anchor } of placed) {
    if (anchor === null) continue;
    claim(page, anchor, { item, member: null });
    const { sections } = pageOf(page);
    sections.set(anchor, [...(sections.get(anchor) ?? []), item]);
  }

  for (const { item, page, anchor } of placed) {
    const prefix = anchor === null ? "" : `${anchor}-`;
    for (const member of item.members.filter(isPublic)) {
      const label = memberLabel(item, member);
      const route = routingUrl(member.doc.see, slug, label);
      if (route) {
        if (route.anchor === null) throw new Error(`${label} cannot own a page; give its URL a #fragment`);
        if (route.page !== page) {
          throw new Error(`${label} routes to page ${route.page}, but it renders with ${item.name} on page ${page}`);
        }
        claim(page, route.anchor, { item, member });
      } else {
        // Overloads share a name and so a default anchor: they render as one set.
        claim(page, `${prefix}${memberSlug(member)}`, { item, member });
      }
    }
  }

  for (const entry of pages.values()) entry.sections = [...entry.sections.values()];
  return { slug, routes, pages, places };
}

/**
 * The routing table: every public item and member's canonical URL → where it
 * renders. Throws when two things that are not one overload set claim one
 * page+anchor, when a URL names another package, and when a member's URL tries
 * to own a page or leave its type's page.
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

/**
 * A constant's declaration with its initializer. A generated table (Unicode's
 * `uint32[N] = [...]`) would print hundreds of lines, so an initializer that
 * spans lines or would take the declaration past 120 characters shows as `…`.
 */
export function withValue(signature, value) {
  if (value === null || value === undefined || /=/.test(signature.replace(/[=!<>]=|=>|<-/g, ""))) return signature;
  const shown = /\n/.test(value) || `${signature} = ${value};`.length > 120 ? "…" : value;
  return `${signature} = ${shown}`;
}

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
// Targets

/** Every target `rux doc --target` supports, in the order snapshots are merged and availability is listed. */
export const TARGETS = [
  "windows-x86_64",
  "windows-aarch64",
  "linux-x86_64",
  "linux-aarch64",
  "macos-x86_64",
  "macos-aarch64",
  "freebsd-x86_64",
  "freebsd-aarch64",
];

const OS_NAMES = { windows: "Windows", linux: "Linux", macos: "macOS", freebsd: "FreeBSD" };
const ARCH_NAMES = { x86_64: "x86-64", aarch64: "AArch64" };

/** `linux-x86_64` → `linux`. */
export const targetOs = (target) => target.slice(0, target.indexOf("-"));

/**
 * Where a declaration exists, as readers name it: "Linux · FreeBSD", or
 * "Linux (x86-64)" when only some of an OS's targets have it. `null` when it
 * exists on every target the package was documented for.
 */
export function availability(targets, all) {
  if (!targets || !all?.length || all.every((target) => targets.includes(target))) return null;
  const systems = [...new Set(all.map(targetOs))];
  return systems
    .map((os) => {
      const ofOs = all.filter((target) => targetOs(target) === os);
      const have = ofOs.filter((target) => targets.includes(target));
      if (!have.length) return null;
      const name = OS_NAMES[os] ?? os;
      if (have.length === ofOs.length) return name;
      const architectures = have.map((target) => ARCH_NAMES[target.slice(os.length + 1)] ?? target).join(", ");
      // A package documented for one OS only (Linux) needs no OS name: "x86-64".
      return systems.length === 1 ? architectures : `${name} (${architectures})`;
    })
    .filter(Boolean)
    .join(" · ");
}

/**
 * Merges lists of one kind of declaration from several snapshots, in source
 * order: an entry first seen in a later target goes after the last entry of
 * that target the result already holds, and after any entry only earlier
 * targets have. Equal keys are one entry, whose `targets` lists every target
 * that has it.
 */
function mergeLists(lists, key, combine) {
  const result = [];
  const byKey = new Map();
  for (const [target, values] of lists) {
    const seen = new Map();
    const ids = (values ?? []).map((value) => {
      const base = key(value);
      const count = (seen.get(base) ?? 0) + 1;
      seen.set(base, count);
      return `${base}#${count}`;
    });
    const mine = new Set(ids);
    let cursor = -1;
    ids.forEach((id, index) => {
      let record = byKey.get(id);
      if (record) {
        record.values.push(values[index]);
        record.targets.push(target);
        cursor = result.indexOf(record);
        return;
      }
      while (cursor + 1 < result.length && !mine.has(result[cursor + 1].id)) cursor++;
      record = { id, values: [values[index]], targets: [target] };
      result.splice(++cursor, 0, record);
      byKey.set(id, record);
    });
  }
  return result.map(({ values, targets }) => combine(values, targets));
}

const constantValue = (entry) => (entry.kind === "constant" ? `=${entry.value}` : "");

/**
 * One snapshot from the snapshots of one package taken for several targets
 * (data/api/SCHEMA.md, "Targets"). Items match by kind, name, module and
 * signature (and value, for a constant, whose value often differs by OS);
 * members by kind, name and signature; fields by name and type; cases by
 * name, value and payload. Every item, member, field and case gets `targets`.
 */
export function mergeSnapshots(snapshots) {
  if (!snapshots.length) throw new Error("No snapshots to merge");
  const [first] = snapshots;
  for (const snapshot of snapshots) {
    if (snapshot.schema !== first.schema) throw new Error("Snapshots of different schemas cannot be merged");
    if (snapshot.package.name !== first.package.name || snapshot.package.version !== first.package.version) {
      throw new Error(
        `Cannot merge ${snapshot.package.name} ${snapshot.package.version} into ${first.package.name} ${first.package.version}`,
      );
    }
  }
  const per = (pick) => snapshots.map((snapshot) => [snapshot.target, pick(snapshot)]);
  const tagged = (values, targets) => ({ ...values[0], targets });
  const unionBy = (lists, key) => mergeLists(lists, key, (values) => values[0]);
  const items = mergeLists(
    per((snapshot) => snapshot.items),
    (item) => `${item.kind}|${item.name}|${item.module}|${item.signature}${constantValue(item)}`,
    (values, targets) => {
      const at = (pick) => values.map((value, index) => [targets[index], pick(value)]);
      return {
        ...values[0],
        fields: mergeLists(
          at((item) => item.fields),
          (field) => `${field.name}|${field.type}`,
          tagged,
        ),
        cases: mergeLists(
          at((item) => item.cases),
          (entry) => `${entry.name}|${entry.value}|${entry.payload}`,
          tagged,
        ),
        members: mergeLists(
          at((item) => item.members),
          (member) => `${member.kind}|${member.name}|${member.signature}${constantValue(member)}`,
          tagged,
        ),
        implements: [...new Set(values.flatMap((item) => item.implements ?? []))],
        targets,
      };
    },
  );
  return {
    ...first,
    targets: snapshots.map((snapshot) => snapshot.target),
    package: {
      ...first.package,
      dependencies: unionBy(
        per((snapshot) => snapshot.package.dependencies),
        (dependency) => dependency.name,
      ),
    },
    modules: unionBy(
      per((snapshot) => snapshot.modules),
      (module) => module.name,
    ),
    items,
  };
}

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

/** The declaration of a set whose prose speaks for it: the longest, which is the most complete. */
const canonical = (set) =>
  set.reduce((best, entry) => ((entry.doc.markdown ?? "").length > (best.doc.markdown ?? "").length ? entry : best));

/** The targets a set covers between them; `null` when any member of it is everywhere. */
function unionTargets(set) {
  if (set.some((entry) => !entry.targets)) return null;
  return [...new Set(set.flatMap((entry) => entry.targets))];
}

/** Groups declarations by the URL they render at, keeping first-seen order. */
function byUrl(ctx, entries) {
  const groups = new Map();
  for (const entry of entries) {
    const url = ctx.plan.places.get(entry).url;
    groups.set(url, [...(groups.get(url) ?? []), entry]);
  }
  return [...groups.values()];
}

/**
 * The rux fence of a set: every signature, each under a `// Linux · macOS`
 * comment when the declarations differ in where they exist.
 */
function signatureFence(ctx, unordered, signatureOf) {
  // Target variants go in target order (Windows, Linux, macOS, FreeBSD), whatever order the merge found them in.
  const first = (entry) =>
    entry.targets ? Math.min(...entry.targets.map((target) => ctx.targets.indexOf(target))) : -1;
  const set = [...unordered].sort((a, b) => first(a) - first(b));
  const notes = set.map((entry) => availability(entry.targets, ctx.targets));
  const annotate = set.length > 1 && notes.some((note) => note !== notes[0]);
  const blocks = set.map((entry, index) => {
    const signature = signatureOf(entry);
    return annotate ? `// ${notes[index] ?? "Every target"}\n${signature}` : signature;
  });
  const separator = annotate || blocks.some((block) => block.includes("\n")) ? "\n\n" : "\n";
  return fence("rux", blocks.join(separator));
}

function availabilityNote(ctx, set) {
  const note = availability(unionTargets(set), ctx.targets);
  return note ? `**Availability**: ${note}` : "";
}

/** A table of each overload's summary, when the overloads describe themselves differently. */
function overloadSummaries(set, signatureOf, prose) {
  const summaries = set.map((entry) => entry.doc.summary ?? "");
  if (set.length < 2 || summaries.every((summary) => summary === summaries[0])) return "";
  return table(
    ["Overload", "Summary"],
    set.map((entry, index) => [cell(code(signatureOf(entry).replace(/\s+/g, " "))), cell(prose(summaries[index]))]),
  );
}

/**
 * One Parameters table for a set. When every overload names its parameters
 * alike, a row per name lists each distinct type (`float64` / `float32`);
 * otherwise there is a row per distinct name and type.
 */
function parameterTable(set, paramsOf, prose) {
  const lists = set.map((entry) => paramsOf(entry).filter((param) => param.name !== "self"));
  const docs = new Map();
  for (const entry of set) {
    for (const param of entry.doc.params)
      if (param.markdown && !docs.has(param.name)) docs.set(param.name, param.markdown);
  }
  const names = lists[0].map((param) => param.name).join(",");
  const aligned = lists.every((list) => list.map((param) => param.name).join(",") === names);
  const typeCell = (types) => [...new Set(types.filter(Boolean))].map(code).join(" / ");
  const rows = aligned
    ? lists[0].map((param, index) => [param.name, typeCell(lists.map((list) => list[index].type))])
    : [
        ...new Map(
          lists.flat().map((param) => [`${param.name}|${param.type}`, [param.name, typeCell([param.type])]]),
        ).values(),
      ];
  return table(
    ["Name", "Type", "Description"],
    rows.map(([name, type]) => [code(name), type, cell(prose(docs.get(name) ?? ""))]),
  );
}

function typeParameterTable(header, typeParams, doc, prose) {
  const typeDocs = new Map(doc.typeParams.map((entry) => [entry.name, entry.markdown]));
  return table(
    [header, "Description"],
    typeParams.map((param) => [
      code(param.bounds?.length ? `${param.name}: ${param.bounds.join(" + ")}` : param.name),
      cell(prose(typeDocs.get(param.name) ?? "")),
    ]),
  );
}

const returnsLine = (set, prose) => {
  const returns = [canonical(set), ...set].find((entry) => entry.doc.returns)?.doc.returns;
  return returns ? `**Returns**: ${prose(returns)}` : "";
};

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

/** The deprecation callouts and the "See also" line, for the `@see` URLs other than the set's own. */
function renderDocExtras(set, { prose, skipUrl, signatureOf }) {
  const extras = [];
  const deprecated = set.filter((entry) => entry.doc.deprecated);
  for (const entry of deprecated) {
    // Name the overload only when the others are not deprecated with it.
    const which = deprecated.length < set.length ? `${code(signatureOf(entry).replace(/\s+/g, " "))}: ` : "";
    const body = `${which}${prose(entry.doc.deprecated)}`;
    extras.push(
      calloutSafe(body)
        ? `::warning\n**Deprecated.**\\\n${body}\n::`
        : `> **Deprecated.**\\\n> ${body.replace(/\n/g, "\n> ")}`,
    );
  }
  const see = [...new Set(set.flatMap((entry) => entry.doc.see))]
    .filter((url) => url !== skipUrl)
    .map((url) => {
      const label = url.startsWith(`${SITE}/`) ? sitePath(url) : url;
      return `[${label.replace(/^\/docs\/api\//, "")}](${url.startsWith(`${SITE}/`) ? sitePath(url) : url})`;
    });
  if (see.length) extras.push(`**See also**: ${see.join(", ")}`);
  return extras;
}

/** One member, or every overload of it, as an anchored section. */
function renderMember(page, ctx, item, set, level, { heading = true } = {}) {
  const [first] = set;
  const main = canonical(set);
  const place = ctx.plan.places.get(first);
  const prose = (markdown) => transformProse(markdown, ctx.resolve({ item, self: place.url }));
  if (heading) page.anchored(level, place.anchor, memberDisplay(first));
  page.add(signatureFence(ctx, set, memberSignature), availabilityNote(ctx, set));
  if (main.doc.markdown) page.add(prose(main.doc.markdown));
  page.add(overloadSummaries(set, memberSignature, prose));
  page.add(typeParameterTable("Type parameter", main.typeParams, main.doc, prose));
  page.add(
    parameterTable(set, (member) => member.params, prose),
    returnsLine(set, prose),
  );
  page.add(...renderDocExtras(set, { prose, skipUrl: place.url, signatureOf: memberSignature }));
  page.add(`[Source](${sourceUrl(ctx.snapshot, item.source, first.line)})`);
}

const onlyOn = (ctx, entry) => {
  const note = availability(entry.targets, ctx.targets);
  return note ? ` (${note} only)` : "";
};

/**
 * Everything below an item's prose: its tables and members. `set` is the
 * item, or every item of an overload set. `sectionLevel` is the heading level
 * of "Fields", "Methods" and the rest, or `null` to write them as bold labels
 * (an item rendered inside another page's section).
 */
function renderItemSections(page, ctx, set, sectionLevel, memberLevel) {
  const item = canonical(set);
  const place = ctx.plan.places.get(item);
  const members = set.flatMap((entry) => entry.members.filter(isPublic));
  const context = { item: { ...item, members }, self: place.url };
  const prose = (markdown) => transformProse(markdown, ctx.resolve(context));
  const renderGroups = (entries, options) => {
    for (const group of byUrl(ctx, entries)) renderMember(page, ctx, context.item, group, memberLevel, options);
  };

  if (item.typeParams.length) {
    page.section(sectionLevel, "Type parameters");
    page.add(typeParameterTable("Name", item.typeParams, item.doc, prose));
  }

  if (["function", "extern"].includes(item.kind)) {
    const params = parameterTable(set, (entry) => entry.params ?? signatureParams(entry.signature), prose);
    if (params) {
      page.section(sectionLevel, "Parameters");
      page.add(params);
    }
    page.add(returnsLine(set, prose));
  }

  const fields = (item.fields ?? []).filter((field) => field.public);
  if (fields.length) {
    page.section(sectionLevel, "Fields");
    page.add(
      table(
        ["Name", "Type", "Description"],
        fields.map((field) => [
          code(field.name),
          code(field.type),
          cell(`${prose(field.doc ?? "")}${onlyOn(ctx, field)}`.trim()),
        ]),
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
          row.push(cell(`${prose(entry.doc ?? "")}${onlyOn(ctx, entry)}`.trim()));
          return row;
        }),
      ),
    );
  }

  const requirements = members.filter((member) => member.kind === "requirement");
  if (requirements.length) {
    page.section(sectionLevel, "Requirements");
    renderGroups(requirements);
  }

  if (item.kind === "interface") {
    const implementations = byUrl(
      ctx,
      ctx.snapshot.items.filter((other) => other.implements?.includes(item.name)),
    );
    if (implementations.length) {
      page.section(sectionLevel, "Implementations");
      page.add(
        table(
          ["Type", "Summary"],
          implementations.map(([other]) => [
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
    renderGroups(group);
  }

  const conformances = [...new Set(set.flatMap((entry) => entry.implements ?? []))];
  for (const member of members) {
    if (member.conformance && !conformances.includes(member.conformance)) conformances.push(member.conformance);
  }
  for (const name of conformances) {
    page.section(sectionLevel, `Implements ${name}`);
    const target = ctx.snapshot.items.find((other) => other.kind === "interface" && other.name === name);
    const link = target ? `[${code(name)}](${sitePath(ctx.plan.places.get(target).url)})` : code(name);
    page.add(`${code(item.displayName)} conforms to ${link}.`);
    renderGroups(members.filter((entry) => entry.conformance === name));
  }

  const constants = own.filter((member) => member.kind === "constant");
  if (constants.length) {
    page.section(sectionLevel, "Constants");
    renderGroups(constants);
  }

  const destructors = own.filter((member) => member.kind === "destructor");
  if (destructors.length) {
    page.section(sectionLevel, "Destructor");
    // The section heading's own id is `destructor`, the destructor's default
    // anchor, so on an item's own page the destructor needs no heading of its
    // own — a second element with that id would be a duplicate.
    const anchor = ctx.plan.places.get(destructors[0]).anchor;
    renderGroups(destructors, { heading: !(sectionLevel !== null && anchor === headingSlug("Destructor")) });
  }
}

/** An item (or overload set) placed on another item's page or a topic page: heading, signature, prose, members. */
function renderPlacedItem(page, ctx, set, level, sectionLevel, memberLevel) {
  const [first] = set;
  const main = canonical(set);
  const place = ctx.plan.places.get(first);
  const prose = (markdown) => transformProse(markdown, ctx.resolve({ item: main, self: place.url }));
  page.anchored(level, place.anchor, first.displayName);
  page.add(signatureFence(ctx, set, itemSignature), availabilityNote(ctx, set));
  if (main.doc.markdown) page.add(prose(main.doc.markdown));
  page.add(overloadSummaries(set, itemSignature, prose));
  page.add(...renderDocExtras(set, { prose, skipUrl: place.url, signatureOf: itemSignature }));
  page.add(`[Source](${sourceUrl(ctx.snapshot, first.source, first.line)})`);
  renderItemSections(page, ctx, set, sectionLevel, memberLevel);
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
  const [first] = owner;
  const main = canonical(owner);
  const place = plan.places.get(first);
  const prose = (markdown) => transformProse(markdown, ctx.resolve({ item: main, self: place.url }));
  const { summary, rest } = splitSummary(main.doc);
  const description = plainText(summary) || first.displayName;
  const page = new PageWriter();
  page.add(
    frontmatter({
      title: first.displayName,
      description,
      path: `/docs/api/${plan.slug}/${pageSlug}`,
      navigation: first.displayName,
      api: {
        package: snapshot.package.name,
        kind: first.kind,
        version: snapshot.package.version,
        source: first.source,
        line: first.line,
      },
      seoTitle: `${first.displayName} — ${snapshot.package.name} API`,
    }),
  );
  page.add(generatedComment(plan.slug));
  page.add(`# ${escapeHtml(first.displayName)}`);
  if (summary) page.add(prose(summary));
  page.add(signatureFence(ctx, owner, itemSignature), availabilityNote(ctx, owner));
  if (rest) page.add(prose(rest));
  page.add(overloadSummaries(owner, itemSignature, prose));
  page.add(...renderDocExtras(owner, { prose, skipUrl: place.url, signatureOf: itemSignature }));
  renderItemSections(page, ctx, owner, 2, 3);
  if (sections.length) {
    page.section(2, "Related");
    for (const set of sections) renderPlacedItem(page, ctx, set, 3, null, 4);
  }
  return page;
}

/**
 * A page only fragment URLs point at. Its title, and optionally the lead
 * paragraph and description, come from the registry entry's
 * `topics: { <page>: "Title" | { title, description } }`.
 */
function renderTopicPage(ctx, pageSlug, { sections }, entry) {
  const { snapshot, plan } = ctx;
  const topic = entry.topics?.[pageSlug];
  if (!topic) {
    throw new Error(
      `${apiUrl(plan.slug, pageSlug)} is a topic page (only #fragment URLs point at it), but the registry entry for ${snapshot.package.name} has no topics["${pageSlug}"] title`,
    );
  }
  const [first] = sections[0];
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
  page.add(transformProse(lead.replace(/([^.])$/, "$1."), ctx.resolve(null)));
  for (const set of sections) renderPlacedItem(page, ctx, set, 2, null, 3);
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
    `Standard packages are declared by hand: the registry does not serve them, so ${code(`rux add ${pkg.namespace}/${pkg.name}`)} cannot add them.`,
  );

  if (pkg.dependencies.length) {
    page.section(2, "Dependencies");
    page.add(
      pkg.dependencies
        .map((dependency) => {
          const slug = dependency.name.toLowerCase();
          // Every registry package has, or is about to have, a page at /docs/api/<slug>. Linking on that alone keeps
          // one package's pages from changing whenever another package is synced.
          const known = PACKAGES.some((entry) => entry.slug === slug);
          const name = known ? `[${code(dependency.name)}](/docs/api/${slug})` : code(dependency.name);
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
    const sets = byUrl(
      ctx,
      snapshot.items.filter((item) => group.kinds.includes(item.kind)),
    );
    if (!sets.length) continue;
    page.section(3, group.title);
    page.add(
      table(
        ["Name", "Summary"],
        sets.map((set) => {
          const [item] = set;
          const { url } = plan.places.get(item);
          const summary = canonical(set).doc.summary ?? "";
          return [
            `[${code(item.displayName)}](${sitePath(url)})`,
            cell(transformProse(summary, ctx.resolve({ item, self: url }))),
          ];
        }),
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
  const targets = snapshot.targets ?? (snapshot.target ? [snapshot.target] : []);
  const ctx = { snapshot, plan, targets, resolve: makeResolver(snapshot, plan, index) };
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
    const group = groupFor(page.owner ? page.owner[0].kind : "topic");
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
