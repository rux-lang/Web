import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

import { buildSitemapFiles, exactHttpOrigin, sitemapEntriesForBuild, writeSitemapFiles } from "./sitemap.mjs";
import { contentRoutes } from "./routes.mjs";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const outputDirectory = resolve(scriptDirectory, "../.output/public");

try {
  // Validate the origin before the request, not inside it: a missing or
  // malformed RUX_SITEMAP_API_BASE_URL is an operator mistake and must fail the
  // build, while the registry merely being unreachable must not —
  // sitemapEntriesForBuild degrades to content routes for that case.
  const apiBaseUrl = exactHttpOrigin("RUX_SITEMAP_API_BASE_URL", process.env.RUX_SITEMAP_API_BASE_URL);
  const registryEntries = await sitemapEntriesForBuild(apiBaseUrl);
  const entries = contentRoutes()
    .map((path) => ({ path }))
    .concat(registryEntries);
  const files = buildSitemapFiles(process.env.RUX_SITE_ORIGIN, entries);
  await writeSitemapFiles(outputDirectory, files);
  console.log(
    `Generated sitemap index with ${files.parts.length} part(s) and ${registryEntries.length} registry URL(s)`,
  );
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
