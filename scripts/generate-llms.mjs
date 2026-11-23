/**
 * Writes the site's Markdown for language models into the generated output.
 *
 *   /llms.txt                        index of every docs page (llmstxt.org)
 *   /llms-small.txt                  the core: cheat sheet, overviews, the whole Rux Reference
 *   /llms-full.txt                   every docs page
 *   /docs/<book>/llms-full.txt       one book
 *   /docs/<…>.md                     one page, at its own URL plus `.md`
 *
 * Runs after `nuxt generate` (package.json `generate`), reading the content
 * database the build just filled — the same page bodies the site renders —
 * and cleaning them with scripts/llms-markdown.mjs. A static host cannot route
 * `/docs/**.md` to a server handler without that handler also catching every
 * HTML page under /docs, so the files are written out as files.
 *
 * Usage: node scripts/generate-llms.mjs [publicDir]
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { DatabaseSync } from "node:sqlite";

import { AREAS, PACKAGES } from "./api-packages.mjs";
import { PARTS } from "./learn-course.mjs";
import {
  SITE,
  apiPackageNodes,
  approxTokens,
  markdownUrl,
  naturalStemCompare,
  renderIndex,
  renderPage,
  roadmapNodes,
} from "./llms-markdown.mjs";
import { resolvePublicDirectory } from "./sitemap.mjs";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const DATABASE = join(ROOT, ".data/content/contents.sqlite");
const { version } = JSON.parse(await readFile(join(ROOT, "package.json"), "utf8"));

export const BOOKS = [
  {
    slug: "learn",
    title: "Learn Rux",
    description: "The course: getting started, then 27 parts from Basics to Projects, one runnable program per lesson.",
  },
  {
    slug: "lang",
    title: "Rux Reference",
    description: `The precise rules of the Rux language as rux ${version} implements them, chapter by chapter.`,
  },
  { slug: "cli", title: "CLI Reference", description: "Every `rux` command, its arguments and options." },
  {
    slug: "packaging",
    title: "Packaging",
    description: "Packages, the Rux.toml manifest, dependencies and the registry.",
  },
  {
    slug: "api",
    title: "API Reference",
    description: "The first-party standard packages, one reference per package.",
  },
];

/** The core file: what an assistant that has never seen Rux needs first. */
const SMALL_LEAD = ["/docs/learn", "/docs/learn/cheatsheet"];
const SMALL_BOOK = "lang";

function readPages() {
  const db = new DatabaseSync(DATABASE, { readOnly: true });
  try {
    const info = db.prepare("SELECT ready FROM _content_info WHERE id = 'checksum_docs'").get();
    if (info?.ready !== 1) throw new Error(`the docs collection in ${DATABASE} is not ready — run nuxt generate first`);
    return db
      .prepare(
        "SELECT path, stem, title, description, seo, body FROM _content_docs " +
          "WHERE extension = 'md' AND (path = '/docs' OR path LIKE '/docs/%')",
      )
      .all()
      .map((row) => ({
        path: row.path,
        stem: row.stem,
        title: row.title,
        description: row.description,
        seo: row.seo ? JSON.parse(row.seo) : {},
        body: JSON.parse(row.body),
      }))
      .sort((a, b) => naturalStemCompare(a.stem, b.stem));
  } finally {
    db.close();
  }
}

const bookOf = (path) => path.match(/^\/docs\/([^/]+)/)?.[1];

/** A document set: a heading, what it holds, then its pages separated by rules. */
function joinSet(title, description, pages) {
  const head = `# ${title}\n\n> ${description}\n\nSource: ${SITE}\n`;
  return [head, ...pages.map((page) => page.markdown)].join("\n---\n\n");
}

async function write(publicDir, path, text) {
  const file = join(publicDir, ...path.split("/").filter(Boolean));
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, text);
  return Buffer.byteLength(text);
}

async function main() {
  const publicDir = process.argv[2]
    ? resolve(process.argv[2])
    : await resolvePublicDirectory([join(ROOT, ".output/public"), join(ROOT, "dist")]);

  const pages = readPages();
  const paths = new Set(pages.map((page) => page.path));
  const components = {
    "learn-roadmap": roadmapNodes(PARTS),
    "api-packages": apiPackageNodes(AREAS, PACKAGES, (path) => paths.has(path)),
  };

  const unknown = new Map();
  for (const page of pages) {
    const seen = new Set();
    page.markdown = await renderPage(page, { components, unknown: seen });
    for (const tag of seen) unknown.set(tag, [...(unknown.get(tag) ?? []), page.path]);
  }
  if (unknown.size) {
    const list = [...unknown].map(([tag, where]) => `  <${tag}> on ${where.slice(0, 3).join(", ")}`).join("\n");
    throw new Error(
      `scripts/llms-markdown.mjs does not know how to write these components as Markdown:\n${list}\n` +
        "Map each one in cleanNode (rewrite, unwrap or a data stand-in) so it does not leak into the LLM files.",
    );
  }

  for (const page of pages) await write(publicDir, `${page.path}.md`, page.markdown);

  const sets = [];
  const small = [
    ...SMALL_LEAD.map((path) => pages.find((page) => page.path === path)),
    ...pages.filter((page) => bookOf(page.path) === SMALL_BOOK),
  ].filter(Boolean);
  const smallDescription =
    `The Learn Rux overview, the cheat sheet and the whole Rux Reference: the language as rux ${version} ` +
    "implements it. Start here when Rux is new to you.";
  const smallBytes = await write(
    publicDir,
    "/llms-small.txt",
    joinSet("Rux — core documentation", smallDescription, small),
  );
  sets.push({
    title: "Core documentation",
    url: `${SITE}/llms-small.txt`,
    description: `${smallDescription} (${approxTokens(smallBytes)})`,
  });

  for (const book of BOOKS) {
    const bookPages = pages.filter((page) => bookOf(page.path) === book.slug);
    if (!bookPages.length) throw new Error(`no pages found for /docs/${book.slug}`);
    const bytes = await write(
      publicDir,
      `/docs/${book.slug}/llms-full.txt`,
      joinSet(`Rux — ${book.title}`, book.description, bookPages),
    );
    sets.push({
      title: book.title,
      url: `${SITE}/docs/${book.slug}/llms-full.txt`,
      description: `${book.description} (${approxTokens(bytes)})`,
    });
  }

  const fullDescription = "Every page of the course, the reference, the CLI, packaging and API books.";
  const fullBytes = await write(
    publicDir,
    "/llms-full.txt",
    joinSet("Rux — full documentation", fullDescription, pages),
  );
  sets.push({
    title: "Full documentation",
    url: `${SITE}/llms-full.txt`,
    description: `${fullDescription} Only for tools that can hold it all (${approxTokens(fullBytes)}).`,
  });

  const hub = pages.find((page) => page.path === "/docs");
  const index = renderIndex({
    title: "Rux Programming Language",
    summary:
      "Rux is a compiled, statically typed systems programming language. This site holds the Learn Rux course, " +
      "the Rux Reference, the CLI and packaging guides, and the standard-package API.",
    notes: [
      "Rux is pre-1.0 and newer than most training data: prefer these pages over what similar languages do.",
      "Every page is available as Markdown at its own URL plus `.md`, e.g. https://rux-lang.dev/docs/learn/hello.md.",
      "Complete example programs for every lesson live at https://github.com/rux-lang/Examples.",
    ],
    sets,
    sections: [
      ...(hub
        ? [
            {
              title: "Documentation",
              links: [{ title: hub.title, url: markdownUrl(hub.path), description: hub.description }],
            },
          ]
        : []),
      ...BOOKS.map((book) => ({
        title: book.title,
        description: book.description,
        links: pages
          .filter((page) => bookOf(page.path) === book.slug)
          .map((page) => ({
            title: page.title || page.seo?.title || page.path,
            url: markdownUrl(page.path),
            description: page.seo?.description || page.description,
          })),
      })),
    ],
  });
  await write(publicDir, "/llms.txt", index);

  console.log(
    `Generated LLM Markdown: ${pages.length} pages, llms-small.txt ${approxTokens(smallBytes)}, ` +
      `llms-full.txt ${approxTokens(fullBytes)}`,
  );
}

try {
  await main();
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
