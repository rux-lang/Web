/**
 * Serves the LLM files from `npm run dev`, which never runs
 * scripts/generate-llms.mjs: `/docs.md`, `/docs/<…>.md`, `/llms.txt`,
 * `/llms-small.txt`, `/llms-full.txt` and `/docs/<book>/llms-full.txt`.
 * Without it the page actions (Copy page, View as Markdown) answer 404 in dev.
 *
 * Registered through `devServerHandlers` in nuxt.config.ts, which only the dev
 * server reads — `nuxt generate` and its prerender never see it. It runs in
 * the Nuxt process rather than the bundled Nitro server, so it renders with
 * the very modules the generator uses (scripts/llms-files.mjs), reading the
 * content database the dev server keeps current, and the bytes match a build.
 *
 * It is middleware, not a route: a Nitro pattern such as `/docs/**:slug.md`
 * is a plain catch-all in radix3 and would swallow every /docs page, so the
 * suffix is matched here and anything else falls through untouched.
 *
 * Changes to the llms scripts need a dev-server restart: they are loaded once.
 */
import { createError, defineEventHandler, setResponseHeader } from "h3";

export const llmsDevHandler = defineEventHandler(async (event) => {
  if (event.method !== "GET" && event.method !== "HEAD") return;
  const { assembleSets, llmsFileFor, readPages, renderPages } = await import("./llms-files.mjs");

  let pathname;
  try {
    pathname = decodeURI(event.path.split("?")[0]);
  } catch {
    return;
  }
  const file = llmsFileFor(pathname);
  if (!file) return;

  let text;
  try {
    const pages = readPages();
    if (file.page) {
      const page = pages.find((candidate) => candidate.path === file.page);
      if (!page) return;
      text = (await renderPages([page], pages))[0].markdown;
    } else {
      text = assembleSets(await renderPages(pages)).find((set) => set.path === file.path)?.text;
      if (text === undefined) return;
    }
  } catch (error) {
    throw createError({ statusCode: 500, message: error instanceof Error ? error.message : String(error) });
  }

  setResponseHeader(event, "content-type", file.contentType);
  return text;
});
