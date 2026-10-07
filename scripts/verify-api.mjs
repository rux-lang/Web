/**
 * npm run verify:api [-- <path-to-Rux>]
 *
 * Fails when a generated API Reference package (GENERATED in
 * scripts/api-packages.mjs) has no snapshot in data/api/, when any file in its
 * folder differs from what its snapshot renders (or is not rendered at all),
 * when a snapshot's version disagrees with its manifest or with the snapshot
 * of a package it depends on, or when a rux-lang.dev `@see` URL resolves to
 * no page or anchor. Needs no Rux checkout; given one (or with ../Rux beside
 * this repository), it also compares each version with the package's Rux.toml.
 */
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { API_ROOT, GENERATED, PACKAGES, packageBySlug } from "./api-packages.mjs";
import { pageAnchors, parseApiUrl, renderApiPackage } from "./api-docs.mjs";
import { contentRoutes } from "./routes.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const ruxArgument = process.argv[2] ? resolve(process.argv[2]) : resolve(root, "../Rux");
const rux = existsSync(join(ruxArgument, "Packages")) ? ruxArgument : null;
const failures = [];
const fail = (message) => failures.push(message);

function listFiles(directory) {
  if (!existsSync(directory)) return [];
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const full = join(directory, entry.name);
    return entry.isDirectory() ? listFiles(full) : [full];
  });
}

function manifestVersion(name) {
  if (!rux) return null;
  const manifest = join(rux, "Packages", name, "Rux.toml");
  if (!existsSync(manifest)) return null;
  const section = readFileSync(manifest, "utf8")
    .split(/^\[/m)
    .find((block) => block.startsWith("Package]"));
  return section?.match(/^Version\s*=\s*"([^"]+)"/m)?.[1] ?? null;
}

for (const slug of GENERATED) {
  if (!packageBySlug(slug)) fail(`GENERATED names "${slug}", which is not in PACKAGES`);
}

// Load and render every generated package first: `@see` URLs may point across packages.
const packages = [];
for (const entry of PACKAGES.filter((candidate) => GENERATED.has(candidate.slug))) {
  const snapshotPath = resolve(root, `data/api/${entry.slug}.json`);
  if (!existsSync(snapshotPath)) {
    fail(`${entry.name} is generated but data/api/${entry.slug}.json does not exist; run npm run sync:api`);
    continue;
  }
  const snapshot = JSON.parse(readFileSync(snapshotPath, "utf8"));
  const readmePath = resolve(root, `data/api/${entry.slug}.readme.md`);
  const readme = existsSync(readmePath) ? readFileSync(readmePath, "utf8") : null;
  let pages;
  try {
    pages = await renderApiPackage(snapshot, readme, entry);
  } catch (error) {
    fail(`data/api/${entry.slug}.json does not render: ${error.message}`);
    continue;
  }
  packages.push({ entry, snapshot, pages });
}

const anchors = new Map();
for (const { pages } of packages) {
  for (const markdown of pages.values()) {
    const route = markdown.match(/^path:\s*(\S+)\s*$/m)?.[1];
    if (route) anchors.set(route, pageAnchors(markdown));
  }
}
const routes = new Set(contentRoutes());

for (const { entry, snapshot, pages } of packages) {
  const where = `data/api/${entry.slug}.json`;
  const pkg = snapshot.package;
  if (pkg.homepage && pkg.homepage !== `https://rux-lang.dev${entry.path}`) {
    fail(`${where}: homepage ${pkg.homepage} is not https://rux-lang.dev${entry.path}`);
  }
  if (entry.version && entry.version !== pkg.version) {
    fail(`${where}: version ${pkg.version} differs from the registry's ${entry.version}`);
  }
  const manifest = manifestVersion(pkg.name);
  if (manifest && manifest !== pkg.version) {
    fail(`${where}: version ${pkg.version} differs from Packages/${pkg.name}/Rux.toml's ${manifest}`);
  }
  for (const dependency of pkg.dependencies) {
    const other = packages.find((candidate) => candidate.entry.name === dependency.name);
    if (other && other.snapshot.package.version !== dependency.version) {
      fail(
        `${where}: depends on ${dependency.name} ${dependency.version}, but data/api/${other.entry.slug}.json is ${other.snapshot.package.version}`,
      );
    }
  }

  // Every file in the package folder must be exactly what the snapshot renders.
  const folder = resolve(root, API_ROOT, entry.folder);
  for (const [path, expected] of pages) {
    const file = resolve(root, path);
    if (!existsSync(file)) fail(`Missing ${path}; run npm run sync:api`);
    else if (readFileSync(file, "utf8") !== expected) fail(`${path} has drifted from ${where}`);
  }
  const rendered = new Set([...pages.keys()].map((path) => resolve(root, path)));
  for (const file of listFiles(folder)) {
    if (!rendered.has(file)) fail(`${relative(root, file).split("\\").join("/")} is not generated from ${where}`);
  }

  // Every rux-lang.dev @see URL must land on a page, and on an anchor when it names one.
  const subjects = snapshot.items.flatMap((item) => [
    { owner: item.name, see: item.doc.see },
    ...item.members
      .filter((member) => member.public !== false)
      .map((member) => ({ owner: `${item.name}::${member.name}`, see: member.doc.see })),
  ]);
  for (const { owner, see } of subjects) {
    for (const url of see.filter((subject) => /^https:\/\/rux-lang\.dev(\/|$)/.test(subject))) {
      const parsed = new URL(url);
      const path = parsed.pathname.replace(/\/$/, "") || "/";
      const anchor = parsed.hash.slice(1);
      const api = parseApiUrl(url);
      if (api && GENERATED.has(api.slug)) {
        const ids = anchors.get(path);
        if (!ids) fail(`${where}: ${owner} links to ${url}, but no generated page has that path`);
        else if (anchor && !ids.has(anchor))
          fail(`${where}: ${owner} links to ${url}, but that page has no #${anchor}`);
      } else if (!routes.has(path)) {
        fail(`${where}: ${owner} links to ${url}, which is not a page of this site`);
      }
    }
  }
}

if (failures.length) {
  console.error(failures.map((failure) => `- ${failure}`).join("\n"));
  process.exit(1);
}
const count = packages.reduce(
  (total, { pages }) => total + [...pages.keys()].filter((path) => path.endsWith(".md")).length,
  0,
);
console.log(`Verified ${packages.length} generated API packages across ${count} Markdown pages`);
