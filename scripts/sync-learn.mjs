/**
 * Learn Rux ⇄ rux-lang/Examples.
 *
 *   npm run sync:learn -- <path-to-Examples> [--create] [--part 3] [--check]
 *
 * Every lesson page mirrors one package of the Examples repository. The prose
 * of a page is written by hand; the parts that must match the package exactly
 * are generated, between marker comments:
 *
 *   <!-- sync:program:start -->  …  <!-- sync:program:end -->   the package's files
 *   <!-- sync:output:start -->   …  <!-- sync:output:end -->    the README's expected output
 *   <!-- sync:needs:start -->    …  <!-- sync:needs:end -->     the README's "You'll need"
 *   <!-- sync:lessons:start -->  …  <!-- sync:lessons:end -->   a part overview's lesson table
 *
 * A run rewrites only those regions, so a lesson edited in Examples reaches its
 * page without touching the explanation around it.
 *
 *   --create  also write pages (and part folders) that do not exist yet, from
 *             a minimal template, and each part's .navigation.yml
 *   --part N  limit the run to part N (repeatable)
 *   --check   change nothing; exit 1 if any page is out of date or missing.
 *             verify-learn.mjs runs the checks that need no Examples checkout.
 */
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { format, resolveConfig } from "prettier";
import { LEARN_ROOT, PARTS, lessonTitle } from "./learn-course.mjs";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const SITE = "https://rux-lang.dev";
const REPO = "https://github.com/rux-lang/Examples";

const args = process.argv.slice(2);
const examples = args.find((a) => !a.startsWith("--") && !/^\d+$/.test(a));
const create = args.includes("--create");
const check = args.includes("--check");
const onlyParts = args.flatMap((a, i) => (args[i - 1] === "--part" ? [Number(a)] : []));

if (!examples || !existsSync(path.join(examples, "README.md"))) {
  console.error("usage: npm run sync:learn -- <path-to-Examples> [--create] [--part N] [--check]");
  process.exit(2);
}

const read = (file) => readFileSync(file, "utf8").replace(/\r\n/g, "\n");

/** Parts and lessons, in course order, from the Examples README. */
function readCourse() {
  const lines = read(path.join(examples, "README.md")).split("\n");
  const parts = [];
  let part;
  let inCourse = false;
  for (const line of lines) {
    if (line.startsWith("## The Course")) inCourse = true;
    else if (inCourse && line.startsWith("## ")) break;
    if (!inCourse) continue;

    const heading = line.match(/^### (\d+)\. (.+)$/);
    if (heading) {
      const meta = PARTS.find((p) => p.number === Number(heading[1]));
      if (!meta) throw new Error(`Part ${heading[1]} is not in scripts/learn-course.mjs`);
      part = { ...meta, readmeTitle: heading[2], summary: "", lessons: [] };
      parts.push(part);
      continue;
    }
    const item = line.match(/^- (\d+\.\d+) \*\*\[(.+?)\]\((.+?)\/?\)\*\* — (.*)$/);
    if (item && part) {
      part.lessons.push(readLesson(part, item[1], item[2], item[3].replace(/\/$/, ""), item[4]));
      continue;
    }
    if (part && !part.summary && line.trim() && !line.startsWith("-")) part.summary = line.trim();
  }
  return parts;
}

function readLesson(part, number, name, source, blurb) {
  const dir = path.join(examples, source);
  const readme = read(path.join(dir, "README.md"));
  const slug = readme.match(/Read the (?:lesson|project): https:\/\/rux-lang\.dev\/docs\/learn\/([a-z0-9-]+)/)?.[1];
  if (!slug) throw new Error(`${source}/README.md has no "Read the lesson" link`);

  // Paragraphs wrap at 100 columns in the READMEs, so a paragraph is its lines
  // joined back together. The first one is the lesson goal, in full; the course
  // index line is shorter, and was once cut off at a `|` inside inline code.
  const paragraphs = readme
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter((p) => p && !p.startsWith("#") && !p.startsWith("```"))
    .map((p) => p.replace(/\s*\n\s*/g, " "));
  const goal = paragraphs[0] ?? blurb;
  const needs = paragraphs
    .find((p) => p.startsWith("**You'll need:**"))
    ?.replace(/^\*\*You'll need:\*\*\s*/, "")
    .replaceAll(`${SITE}/`, "/");
  const output = readme.match(/```text\n([\s\S]*?)```/)?.[1] ?? "";
  const extra = readme.match(/```text\n[\s\S]*?```\n([\s\S]*?)\nRead the (?:lesson|project):/)?.[1]?.trim();
  const unbalanced = (blurb.match(/`/g) ?? []).length % 2 === 1;

  return {
    part,
    number,
    name,
    source,
    slug,
    title: lessonTitle(name),
    blurb: unbalanced ? goal.replace(/\.$/, "") : blurb.replace(/ _\(after .+\)_$/, ""),
    checkpoint: blurb.match(/_\(after (.+)\)_$/)?.[1],
    goal,
    needs,
    output,
    extra,
    files: packageFiles(dir),
  };
}

/** Every source file and manifest of a package, Rux.toml files first. */
function packageFiles(dir) {
  const files = [];
  const walk = (d) => {
    for (const entry of readdirSync(d).sort()) {
      if (["Bin", "Temp", ".git"].includes(entry)) continue;
      const full = path.join(d, entry);
      if (statSync(full).isDirectory()) walk(full);
      else if (/\.(rux|toml)$/.test(entry)) files.push(path.relative(dir, full).split(path.sep).join("/"));
    }
  };
  walk(dir);
  const depth = (f) => f.split("/").length;
  return files
    .sort(
      (a, b) =>
        depth(a) - depth(b) || (a.endsWith(".toml") ? -1 : 1) - (b.endsWith(".toml") ? -1 : 1) || a.localeCompare(b),
    )
    .map((file) => ({ file, text: read(path.join(dir, file)).replace(/\n+$/, "") }));
}

const yamlString = (s) => JSON.stringify(s);
const plain = (s) => s.replace(/`/g, "");
const tableCell = (s) => s.replace(/\|/g, "\\|");

const fence = ({ file, text }) => "```" + `${file.endsWith(".rux") ? "rux" : "toml"} [${file}]\n${text}\n` + "```";

/**
 * Almost every lesson is the same three files — README.md, Rux.toml and
 * Src/Main.rux — so a file tree would only add clicks: the page shows the
 * program, and names any standard package beyond Io it has to depend on.
 * The few lessons whose subject *is* the layout (modules, workspaces,
 * libraries, tests) keep the tree.
 */
function programRegion(lesson) {
  const sources = lesson.files.filter((f) => f.file.endsWith(".rux"));
  if (sources.length === 1 && sources[0].file === "Src/Main.rux" && lesson.files.length === 2) {
    const manifest = lesson.files.find((f) => f.file === "Rux.toml").text;
    const all = [...manifest.matchAll(/^(\w+) = \{/gm)].map((m) => m[1]);
    const dependencies = all.filter((d) => d !== "Io");
    const list = dependencies
      .map((d) => `\`${d}\``)
      .join(", ")
      .replace(/, ([^,]*)$/, " and $1");
    const lead = all.includes("Io") ? "Besides `Io`, its" : "Its";
    const note = dependencies.length ? `\n\n${lead} \`Rux.toml\` lists ${list} under \`[Dependencies]\`.` : "";
    return fence(sources[0]) + note;
  }
  const main = lesson.files.find((f) => f.file === "Src/Main.rux") ? "Src/Main.rux" : lesson.files.at(-1).file;
  return [`::code-tree{defaultValue="${main}"}`, "", lesson.files.map(fence).join("\n\n"), "", "::"].join("\n");
}

function outputRegion(lesson) {
  const parts = ["```\n" + lesson.output.replace(/\n+$/, "") + "\n```"];
  if (lesson.extra) parts.push(lesson.extra.replaceAll(`${SITE}/`, "/"));
  return parts.join("\n\n");
}

function needsRegion(lesson) {
  if (!lesson.needs) return "This is the first lesson: it needs nothing but an installed `rux`.";
  // The README names lessons by package ("ElseIf"); the site uses titles.
  const needs = lesson.needs.replace(/\[[^\]]+\]\(\/docs\/learn\/([a-z0-9-]+)\)/g, (link, slug) =>
    titles.has(slug) ? `[${titles.get(slug)}](/docs/learn/${slug})` : link,
  );
  // The colon stays outside the bold on purpose. Inside a callout, Nuxt UI
  // unwraps the paragraph and drops whitespace-only text between two elements,
  // so `**You'll need:** [Variable]` renders as "You'll need:Variable"; with
  // the colon outside, the text between them is ": " and survives.
  return `**You'll need**: ${needs}`;
}

function lessonsRegion(part) {
  const rows = part.lessons.map((l) => `| ${l.number} | [${l.title}](/docs/learn/${l.slug}) | ${tableCell(l.blurb)} |`);
  return ["| | Lesson | What you will learn |", "| --- | --- | --- |", ...rows].join("\n");
}

function lessonTemplate(lesson) {
  return `---
title: ${yamlString(lesson.title)}
description: ${yamlString(plain(lesson.goal))}
path: /docs/learn/${lesson.slug}
navigation:
  title: ${yamlString(`${lesson.number} ${lesson.title}`)}
lesson:
  number: ${yamlString(lesson.number)}
  source: ${lesson.source}
---

# ${lesson.title}

::note
<!-- sync:needs:start -->
${needsRegion(lesson)}
<!-- sync:needs:end -->
::

## The program

The whole lesson is one package in the [Examples repository](${REPO}/tree/main/${lesson.source}). Its comments explain every step.

<!-- sync:program:start -->
${programRegion(lesson)}
<!-- sync:program:end -->

## Run it

\`\`\`sh
cd Examples/${lesson.source}
rux run
\`\`\`

<!-- sync:output:start -->
${outputRegion(lesson)}
<!-- sync:output:end -->
`;
}

function partTemplate(part) {
  return `---
title: ${yamlString(part.title)}
description: ${yamlString(plain(part.summary))}
path: /docs/learn/${part.slug}
navigation:
  title: Overview
---

# Part ${part.number}: ${part.title}

${part.summary}

## Lessons

<!-- sync:lessons:start -->
${lessonsRegion(part)}
<!-- sync:lessons:end -->
`;
}

/** Replace the body of every `sync:<name>` region present in `text`. */
function syncRegions(text, regions) {
  let out = text;
  for (const [name, body] of Object.entries(regions)) {
    const re = new RegExp(`(<!-- sync:${name}:start -->\\n)[\\s\\S]*?(\\n<!-- sync:${name}:end -->)`);
    out = out.replace(re, (_, start, end) => `${start}${body}${end}`);
  }
  return out;
}

/** The `lesson.requires` frontmatter list, from the README's lesson links. */
function syncRequires(text, lesson) {
  const requires = [...(lesson.needs ?? "").matchAll(/\/docs\/learn\/([a-z0-9-]+)/g)].map((m) => m[1]);
  const block = requires.length ? `  requires: [${requires.join(", ")}]\n` : "";
  return text
    .replace(/(\n {2}source: .*\n)(?: {2}requires: .*\n)?/, `$1${block}`)
    .replace(/^description: .*$/m, `description: ${yamlString(plain(lesson.goal))}`);
}

const changed = [];
const missing = [];

// Pages are written the way `npm run format` would leave them, so formatting
// the repository never makes --check report a page as stale.
const prettierOptions = { ...(await resolveConfig(path.join(ROOT, LEARN_ROOT, "00.index.md"))), parser: "markdown" };

async function write(file, generated) {
  const full = path.join(ROOT, file);
  const next = file.endsWith(".md") ? await format(generated, prettierOptions) : generated;
  const current = existsSync(full) ? read(full) : undefined;
  if (current === next) return;
  if (current === undefined && !create) {
    missing.push(file);
    return;
  }
  changed.push(file);
  if (check) return;
  mkdirSync(path.dirname(full), { recursive: true });
  writeFileSync(full, next);
}

/** The existing page for a slug, wherever it is filed in the part. */
function findPage(folder, slug) {
  const dir = path.join(ROOT, LEARN_ROOT, folder);
  if (!existsSync(dir)) return undefined;
  const name = readdirSync(dir).find((f) => f.replace(/^\d+\./, "") === `${slug}.md`);
  return name && `${LEARN_ROOT}/${folder}/${name}`;
}

const course = readCourse();
const titles = new Map(course.flatMap((p) => p.lessons.map((l) => [l.slug, l.title])));
for (const part of course) {
  if (onlyParts.length && !onlyParts.includes(part.number)) continue;

  await write(`${LEARN_ROOT}/${part.folder}/.navigation.yml`, `title: ${part.title}\nicon: ${part.icon}\n`);

  const overview = `${LEARN_ROOT}/${part.folder}/00.index.md`;
  const overviewFull = path.join(ROOT, overview);
  await write(
    overview,
    existsSync(overviewFull) ? syncRegions(read(overviewFull), { lessons: lessonsRegion(part) }) : partTemplate(part),
  );

  for (const [index, lesson] of part.lessons.entries()) {
    const file =
      findPage(part.folder, lesson.slug) ??
      `${LEARN_ROOT}/${part.folder}/${String(index + 1).padStart(2, "0")}.${lesson.slug}.md`;
    const full = path.join(ROOT, file);
    const current = existsSync(full) ? read(full) : lessonTemplate(lesson);
    const regions = { needs: needsRegion(lesson), program: programRegion(lesson), output: outputRegion(lesson) };
    await write(file, syncRequires(syncRegions(current, regions), lesson));
  }
}

const lessons = course.reduce((n, p) => n + p.lessons.length, 0);
console.log(`${course.length} parts, ${lessons} lessons in ${examples}`);
for (const file of changed) console.log(`  ${check ? "STALE  " : "UPDATED"} ${file}`);
for (const file of missing) console.log(`  MISSING ${file}`);
if (check && (changed.length || missing.length)) process.exit(1);
