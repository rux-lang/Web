import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

import { buildSitemapFiles, sitemapEntriesForBuild, writeSitemapFiles } from "./sitemap.mjs";
import { contentRoutes } from "./routes.mjs";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const outputDirectory = resolve(scriptDirectory, "../.output/public");

try {
  const registryEntries = await sitemapEntriesForBuild(process.env.RUX_SITEMAP_API_BASE_URL);
  const entries = contentRoutes()
    .map((path) => ({ path }))
    .concat(registryEntries);
  const files = buildSitemapFiles(process.env.RUX_SITE_ORIGIN, entries);
  await writeSitemapFiles(outputDirectory, files);
  console.log(`Generated sitemap index with ${files.parts.length} part(s)`);
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
