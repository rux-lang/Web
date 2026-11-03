import { createReadStream, existsSync, statSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { createSecureServer } from "node:http2";
import { extname, relative, resolve, sep } from "node:path";
import { brotliCompressSync, gzipSync } from "node:zlib";
import { generate } from "selfsigned";

const webDirectory = resolve(import.meta.dirname, "..");
const outputDirectory = resolve(webDirectory, ".output/public");
const hostname = process.env.RUX_QUALITY_HOST ?? "127.0.0.1";
const port = Number.parseInt(process.env.RUX_QUALITY_PORT ?? "4173", 10);

const catalogPackages = [
  {
    namespace: "Rux",
    package: "Json",
    version: "1.1.0",
    package_type: "source_library",
    description: "Fast JSON parsing with streaming support.",
    published_at: "2026-03-10T12:00:00Z",
    yanked: false,
    downloads_total: 98450,
    downloads_30d: 12540,
    package_url: "/v1/packages/rux/json",
    version_url: "/v1/packages/rux/json/1.1.0",
  },
  {
    namespace: "CommunityTools",
    package: "HttpClient",
    version: "1.0.0",
    package_type: "static_library",
    description: "HTTP client with streaming bodies and JSON helpers.",
    published_at: "2026-04-01T08:00:00Z",
    yanked: false,
    downloads_total: 41200,
    downloads_30d: 8290,
    package_url: "/v1/packages/communitytools/httpclient",
    version_url: "/v1/packages/communitytools/httpclient/1.0.0",
  },
  {
    namespace: "Acme",
    package: "RegistryCli",
    version: "2.0.0+portable",
    package_type: "executable",
    description: "Portable command-line tools for exploring a Rux registry.",
    published_at: "2026-05-01T15:05:00Z",
    yanked: false,
    downloads_total: 1730,
    downloads_30d: 410,
    package_url: "/v1/packages/acme/registrycli",
    version_url: "/v1/packages/acme/registrycli/2.0.0%2Bportable",
  },
];

const summary = {
  namespace: "Rux",
  package: "Json",
  created_at: "2026-01-01T02:00:00Z",
  canonical_url: "https://rux-lang.dev/packages/rux/json",
};

const release = {
  namespace: "Rux",
  package: "Json",
  version: "1.1.0",
  manifest_schema_version: 1,
  min_rux: "0.4.0",
  package_type: "source_library",
  description: "Fast JSON parsing with streaming support.",
  authors: ["Rux Contributors"],
  keywords: ["Json", "Serialization", "Streaming"],
  repository_url: "https://github.com/rux-lang/json",
  homepage_url: "https://rux-lang.dev/packages/json",
  dependencies: [
    {
      alias: "Io",
      target_namespace: "Rux",
      target_package: "Io",
      version_range: "^1.1",
    },
  ],
  normalized_manifest: {
    manifest: { version: 1, min_rux: "0.4.0" },
    package: {
      namespace: "Rux",
      name: "Json",
      version: "1.1.0",
      type: "library",
    },
  },
  readme_file: {
    path: "README.md",
    source:
      "# Rux Json\n\nStreaming JSON parsing and serialization.\n\n## Features\n\n- Bounded parsing\n- Helpful errors\n\n```rux\nuse Json\n```",
  },
  license: "MIT",
  license_file: {
    path: "LICENSE.md",
    source:
      "# MIT License\n\nCopyright (c) 2026 The Rux Authors\n\nPermission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction.",
  },
  checksum: {
    algorithm: "sha256",
    digest: "2222222222222222222222222222222222222222222222222222222222222222",
  },
  artifact_size: 5632,
  artifact_file_count: 5,
  artifact_expanded_bytes: 11264,
  source_file_count: 3,
  source_line_count: 390,
  published_at: "2026-03-10T12:00:00Z",
  yanked: false,
  package_url: "/v1/packages/rux/json",
  canonical_url: "https://rux-lang.dev/packages/rux/json?version=1.1.0",
  download_url: "/v1/packages/rux/json/1.1.0/download",
};

const downloadStatistics = {
  window_days: 30,
  start_date: "2026-07-08",
  end_date: "2026-08-06",
  total_downloads: 13125,
  total_all_time: 98450,
  daily: Array.from({ length: 30 }, (_, index) => ({
    date: new Date(Date.UTC(2026, 6, 8 + index)).toISOString().slice(0, 10),
    downloads: 260 + ((index * 97) % 330) + (index === 21 ? 420 : 0),
  })),
};

const versions = [
  {
    version: "1.1.0",
    min_rux: "0.4.0",
    package_type: "source_library",
    published_at: "2026-03-10T12:00:00Z",
    yanked: false,
    canonical_url: "https://rux-lang.dev/packages/rux/json?version=1.1.0",
    download_url: "/v1/packages/rux/json/1.1.0/download",
  },
  {
    version: "1.1.0-beta.1",
    min_rux: "0.4.0",
    package_type: "source_library",
    published_at: "2026-02-20T12:00:00Z",
    yanked: false,
    canonical_url: "https://rux-lang.dev/packages/rux/json?version=1.1.0-beta.1",
    download_url: "/v1/packages/rux/json/1.1.0-beta.1/download",
  },
  {
    version: "1.0.0",
    min_rux: "0.4.0",
    package_type: "source_library",
    published_at: "2026-01-15T12:00:00Z",
    yanked: true,
    canonical_url: "https://rux-lang.dev/packages/rux/json?version=1.0.0",
    download_url: "/v1/packages/rux/json/1.0.0/download",
  },
];

const dependent = { ...catalogPackages[1], requirements: [{ alias: "Json", version_range: "^1.1" }] };
delete dependent.downloads_total;
delete dependent.downloads_30d;
const dependents = [dependent];

const dashboard = {
  counts: { namespaces: 2, packages: 3, invitations: 1 },
  namespaces: [
    { namespace: "Rux", role: "owner", package_count: 2 },
    {
      namespace: "CommunityTools",
      role: "maintainer",
      package_count: 1,
    },
  ],
  packages: catalogPackages.map((item, index) => ({
    namespace: item.namespace,
    package: item.package,
    version: item.version,
    published_at: item.published_at,
    yanked: index === 2,
    version_count: index + 1,
    package_url: item.package_url,
    version_url: item.version_url,
  })),
  invitations: [
    {
      namespace: "Rux_Labs",
      invited_by: {
        github_login: "rux-owner",
        display_name: "Rux Owner",
        avatar_url: null,
      },
      role: "maintainer",
      created_at: "2026-08-01T09:00:00Z",
      expires_at: "2026-08-08T09:00:00Z",
    },
  ],
  activity: [
    {
      kind: "package_version_published",
      actor: {
        github_login: "octocat",
        display_name: "The Octocat",
        avatar_url: null,
      },
      namespace: "Rux",
      package: "Json",
      version: "1.1.0",
      target_user: null,
      previous_role: null,
      role: null,
      occurred_at: "2026-08-02T12:00:00Z",
      package_url: "/v1/packages/rux/json",
      version_url: "/v1/packages/rux/json/1.1.0",
    },
  ],
  downloads: {
    window_days: 30,
    total_30d: 20830,
    total_all_time: 98450,
    top_packages: catalogPackages.slice(0, 2).map((item, index) => ({
      namespace: item.namespace,
      package: item.package,
      downloads_30d: index === 0 ? 12540 : 8290,
      package_url: item.package_url,
    })),
  },
};

const mimeTypes = new Map([
  [".css", "text/css; charset=utf-8"],
  [".html", "text/html; charset=utf-8"],
  [".ico", "image/x-icon"],
  [".js", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".map", "application/json; charset=utf-8"],
  [".svg", "image/svg+xml"],
  [".txt", "text/plain; charset=utf-8"],
  [".wasm", "application/wasm"],
  [".webmanifest", "application/manifest+json"],
  [".woff", "font/woff"],
  [".woff2", "font/woff2"],
  [".xml", "application/xml; charset=utf-8"],
]);

function json(response, value) {
  const body = Buffer.from(JSON.stringify(value));
  response.writeHead(200, {
    "cache-control": "no-store",
    "content-length": body.length,
    "content-type": "application/json; charset=utf-8",
  });
  response.end(body);
}

function authenticationRequired(response) {
  const body = Buffer.from(
    JSON.stringify({
      type: "https://api.rux-lang.dev/problems/authentication_required",
      title: "Authentication is required",
      status: 401,
      code: "authentication_required",
    }),
  );
  response.writeHead(401, {
    "cache-control": "no-store",
    "content-length": body.length,
    "content-type": "application/problem+json; charset=utf-8",
  });
  response.end(body);
}

function apiResponse(url) {
  if (url.pathname === "/v1/dashboard") return { data: dashboard };
  if (url.pathname === "/v1/highlights") {
    const highlight = (value, downloads) => {
      const item = { ...value, downloads_30d: downloads };
      delete item.yanked;
      delete item.downloads_total;
      return item;
    };
    return {
      data: {
        window_days: 30,
        recent: catalogPackages.map((item) => highlight(item, null)),
        popular: catalogPackages.slice(0, 2).map((item, index) => highlight(item, index === 0 ? 12540 : 8290)),
      },
    };
  }
  if (url.pathname === "/v1/search") {
    const namespace = url.searchParams.get("namespace")?.toLowerCase();
    const query = url.searchParams.get("q")?.toLowerCase();
    const packageType = url.searchParams.get("package_type");
    const sort = url.searchParams.get("sort") ?? (query ? "relevance" : "name");
    const order = url.searchParams.get("order") ?? (sort === "name" ? "asc" : "desc");
    const page = Math.max(1, Number.parseInt(url.searchParams.get("page") ?? "1", 10) || 1);
    const perPage = Math.max(1, Number.parseInt(url.searchParams.get("per_page") ?? "15", 10) || 15);
    const items = catalogPackages.filter(
      (item) =>
        (!namespace || item.namespace.toLowerCase().replaceAll("_", "-") === namespace) &&
        (!packageType || item.package_type === packageType) &&
        (!query || `${item.namespace} ${item.package} ${item.description}`.toLowerCase().includes(query)),
    );
    // Relevance keeps fixture order; the other orderings sort on the field the
    // catalog's Sort by menu names.
    const sortKeys = {
      name: (item) => `${item.namespace}/${item.package}`.toLowerCase(),
      downloads: (item) => item.downloads_total,
      recent_downloads: (item) => item.downloads_30d,
      updated: (item) => item.published_at,
      created: (item) => item.published_at,
    };
    const key = sortKeys[sort];
    if (key) {
      items.sort((left, right) => (key(left) < key(right) ? -1 : key(left) > key(right) ? 1 : 0));
      if (order === "desc") items.reverse();
    }
    return {
      data: items.slice((page - 1) * perPage, page * perPage),
      meta: { total: items.length, page, per_page: perPage },
    };
  }
  if (url.pathname === "/v1/packages/rux/json") return { data: summary };
  if (url.pathname === "/v1/packages/rux/json/downloads") return { data: downloadStatistics };
  if (url.pathname === "/v1/packages/rux/json/1.1.0") return { data: release };
  if (url.pathname === "/v1/packages/rux/json/versions") {
    return { data: versions, meta: { next_cursor: null } };
  }
  if (url.pathname === "/v1/packages/rux/json/dependents") {
    return { data: dependents, meta: { next_cursor: null } };
  }
  return null;
}

function safeStaticPath(pathname) {
  let decoded;
  try {
    decoded = decodeURIComponent(pathname);
  } catch {
    return null;
  }

  const requested = resolve(outputDirectory, `.${decoded}`);
  const relativePath = relative(outputDirectory, requested);
  if (relativePath.startsWith(`..${sep}`) || relativePath === "..") return null;

  // Mirrors `/packages/*  /200  200` in public/_redirects, which production
  // follows even where a prerendered file exists. Serving those files instead
  // would hydrate state baked at generate time, such as a failed session probe.
  if (decoded.startsWith("/packages/")) return resolve(outputDirectory, "200.html");

  if (existsSync(requested)) {
    const details = statSync(requested);
    if (details.isFile()) return requested;
    if (details.isDirectory()) {
      const index = resolve(requested, "index.html");
      if (existsSync(index) && statSync(index).isFile()) return index;
    }
  }

  if (!extname(decoded)) return resolve(outputDirectory, "200.html");
  return null;
}

async function staticResponse(request, response, path) {
  const type = mimeTypes.get(extname(path).toLowerCase()) ?? "application/octet-stream";
  const cacheControl = path.includes(`${sep}_nuxt${sep}`)
    ? "public, max-age=31536000, immutable"
    : type.startsWith("text/html")
      ? "no-cache"
      : "public, max-age=3600";
  const accepts = request.headers["accept-encoding"] ?? "";
  const compressible = /^(application\/json|application\/manifest|application\/xml|image\/svg|text\/)/.test(type);

  if (request.method === "HEAD" || !compressible) {
    const size = statSync(path).size;
    response.writeHead(200, {
      "cache-control": cacheControl,
      "content-length": size,
      "content-type": type,
    });
    if (request.method === "HEAD") response.end();
    else createReadStream(path).pipe(response);
    return;
  }

  const source = await readFile(path);
  let body = source;
  let encoding;
  if (accepts.includes("br")) {
    body = brotliCompressSync(source);
    encoding = "br";
  } else if (accepts.includes("gzip")) {
    body = gzipSync(source);
    encoding = "gzip";
  }

  response.writeHead(200, {
    "cache-control": cacheControl,
    "content-length": body.length,
    "content-type": type,
    ...(encoding ? { "content-encoding": encoding } : {}),
    vary: "Accept-Encoding",
  });
  response.end(body);
}

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error("RUX_QUALITY_PORT must be a valid TCP port");
}
if (!existsSync(resolve(outputDirectory, "200.html"))) {
  throw new Error("Generated SPA output is missing; run the quality build first");
}

const certificate = await generate([{ name: "commonName", value: "localhost" }], {
  algorithm: "sha256",
  keyType: "ec",
});

const server = createSecureServer(
  {
    allowHTTP1: true,
    cert: certificate.cert,
    key: certificate.private,
  },
  async (request, response) => {
    try {
      if (request.method !== "GET" && request.method !== "HEAD") {
        response.writeHead(405, { allow: "GET, HEAD" }).end();
        return;
      }

      const url = new URL(request.url ?? "/", `https://${hostname}:${port}`);
      if (url.pathname === "/v1/auth/session") {
        const referrer = request.headers.referer ? new URL(request.headers.referer) : null;
        if (referrer?.pathname === "/packages/-/dashboard") {
          json(response, {
            data: {
              user: {
                github_login: "octocat",
                display_name: "The Octocat",
                avatar_url: null,
              },
              // Relative to now: a fixed date eventually passes, and the app
              // treats an expired session as signed out.
              expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
              csrf_token: "quality-csrf",
            },
          });
        } else {
          authenticationRequired(response);
        }
        return;
      }
      const fixture = apiResponse(url);
      if (fixture) {
        json(response, fixture);
        return;
      }

      const path = safeStaticPath(url.pathname);
      if (!path) {
        response.writeHead(404).end();
        return;
      }
      await staticResponse(request, response, path);
    } catch (error) {
      console.error(error);
      if (!response.headersSent) response.writeHead(500);
      response.end();
    }
  },
);

server.listen(port, hostname, () => {
  console.log(`Quality server listening at https://${hostname}:${port}`);
});

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => server.close(() => process.exit(0)));
}
