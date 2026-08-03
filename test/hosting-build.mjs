import { spawn } from "node:child_process";
import { readFile } from "node:fs/promises";
import { createServer } from "node:http";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const webDirectory = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outputDirectory = resolve(webDirectory, ".output/public");

const pages = new Map([
  [
    null,
    {
      data: [
        {
          kind: "keyword",
          keyword: "Data_Formats",
          normalized_keyword: "data-formats",
          last_modified: "2026-08-01T12:00:00Z",
        },
      ],
      meta: { next_cursor: "second-page" },
    },
  ],
  [
    "second-page",
    {
      data: [
        {
          kind: "namespace",
          namespace: "Rux",
          normalized_namespace: "rux",
          last_modified: "2026-08-02T12:00:00Z",
        },
        {
          kind: "package",
          namespace: "Rux",
          normalized_namespace: "rux",
          package: "Json",
          normalized_package: "json",
          last_modified: "2026-08-03T12:00:00Z",
        },
      ],
      meta: { next_cursor: null },
    },
  ],
]);

const server = createServer((request, response) => {
  const url = new URL(request.url ?? "/", "http://127.0.0.1");
  const cursor = url.searchParams.get("cursor");
  const page = pages.get(cursor);

  if (url.pathname !== "/v1/sitemap" || url.searchParams.get("limit") !== "1000" || !page) {
    response.writeHead(404).end();
    return;
  }

  response.writeHead(200, { "content-type": "application/json" });
  response.end(JSON.stringify(page));
});

await new Promise((resolvePromise, reject) => {
  server.once("error", reject);
  server.listen(0, "127.0.0.1", resolvePromise);
});

try {
  const address = server.address();
  if (!address || typeof address === "string") throw new Error("mock sitemap server did not bind a TCP port");

  const environment = {
    ...process.env,
    NUXT_PUBLIC_API_BASE_URL: "https://api.rux-lang.dev",
    RUX_SITE_ORIGIN: "https://rux-lang.dev",
    RUX_SITEMAP_API_BASE_URL: `http://127.0.0.1:${address.port}`,
  };
  const commands = [
    [resolve(webDirectory, "node_modules/nuxt/bin/nuxt.mjs"), "generate"],
    [resolve(webDirectory, "scripts/generate-sitemap.mjs")],
  ];

  for (const command of commands) {
    const status = await new Promise((resolvePromise, reject) => {
      const child = spawn(process.execPath, command, {
        cwd: webDirectory,
        env: environment,
        stdio: "inherit",
      });
      child.once("error", reject);
      child.once("exit", resolvePromise);
    });
    if (status !== 0) throw new Error(`hosting build exited with status ${status}`);
  }

  const [index, fallback, notFound, robots, sitemapIndex, sitemapPart] = await Promise.all([
    readFile(resolve(outputDirectory, "index.html"), "utf8"),
    readFile(resolve(outputDirectory, "200.html"), "utf8"),
    readFile(resolve(outputDirectory, "404.html"), "utf8"),
    readFile(resolve(outputDirectory, "robots.txt"), "utf8"),
    readFile(resolve(outputDirectory, "sitemap.xml"), "utf8"),
    readFile(resolve(outputDirectory, "sitemap-1.xml"), "utf8"),
  ]);

  for (const shell of [index, fallback, notFound]) {
    if (!shell.includes("<html")) throw new Error("generated Nuxt shell is not HTML");
  }
  if (!robots.includes("Sitemap: https://rux-lang.dev/sitemap.xml")) {
    throw new Error("robots.txt does not advertise the sitemap index");
  }
  if (!robots.includes("Disallow: /packages/-/auth/")) {
    throw new Error("robots.txt does not exclude transient authentication routes");
  }
  if (!sitemapIndex.includes("https://rux-lang.dev/sitemap-1.xml")) {
    throw new Error("sitemap index does not reference its generated part");
  }
  for (const path of ["/packages/-/keywords/data-formats", "/packages/-/namespaces/rux", "/packages/rux/json"]) {
    if (!sitemapPart.includes(`https://rux-lang.dev${path}`)) {
      throw new Error(`generated sitemap is missing ${path}`);
    }
  }

  console.log("Verified generated static-hosting artifact");
} finally {
  await new Promise((resolvePromise) => server.close(resolvePromise));
}
