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
 * HTML page under /docs, so the files are written out as files. The reading
 * and assembly live in scripts/llms-files.mjs, which `npm run dev` serves the
 * same files from (scripts/llms-dev.mjs).
 *
 * Usage: node scripts/generate-llms.mjs [publicDir]
 */
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";

import { ROOT, assembleSets, readPages, renderPages } from "./llms-files.mjs";
import { approxTokens } from "./llms-markdown.mjs";
import { resolvePublicDirectory } from "./sitemap.mjs";

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

  const pages = await renderPages(readPages());
  for (const page of pages) await write(publicDir, `${page.path}.md`, page.markdown);

  const bytes = {};
  for (const { path, text } of assembleSets(pages)) bytes[path] = await write(publicDir, path, text);

  console.log(
    `Generated LLM Markdown: ${pages.length} pages, llms-small.txt ${approxTokens(bytes["/llms-small.txt"])}, ` +
      `llms-full.txt ${approxTokens(bytes["/llms-full.txt"])}`,
  );
}

try {
  await main();
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
