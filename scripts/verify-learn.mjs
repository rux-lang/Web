/**
 * Learn Rux course integrity.
 *
 *   node scripts/verify-learn.mjs
 *
 * Runs without a checkout of rux-lang/Examples, so it can gate CI.
 * (`npm run sync:learn -- ../Examples --check` is the companion that compares
 * the pages with the Examples packages themselves.)
 *
 *   1. every part in scripts/learn-course.mjs has its folder, overview page and
 *      .navigation.yml, and no other numbered folder exists
 *   2. every course page declares a flat `path: /docs/learn/<slug>`, and no
 *      two pages share a slug — lessons, part overviews and onboarding pages
 *      all live in the one /docs/learn/ namespace
 *   3. every lesson declares `lesson.number` and `lesson.source`, numbered
 *      <part>.<n> after its folder, and in file order
 *   4. every `lesson.requires` slug is a lesson that comes earlier
 *   5. every lesson still carries its generated regions (sync:needs,
 *      sync:program, sync:output), so sync:learn can keep it up to date
 */
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { LEARN_ROOT, PARTS } from "./learn-course.mjs";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const BOOK = path.join(ROOT, LEARN_ROOT);
const problems = [];
const fail = (file, message) => problems.push(`${path.relative(ROOT, file).split(path.sep).join("/")}: ${message}`);

function frontmatter(file) {
  const block =
    readFileSync(file, "utf8")
      .replace(/\r\n/g, "\n")
      .match(/^---\n([\s\S]*?)\n---/)?.[1] ?? "";
  const value = (key, indent = "") => block.match(new RegExp(`^${indent}${key}:\\s*"?([^"\\n]*?)"?\\s*$`, "m"))?.[1];
  return {
    path: value("path"),
    number: value("number", " {2}"),
    source: value("source", " {2}"),
    requires:
      block
        .match(/^ {2}requires: \[(.*)\]$/m)?.[1]
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean) ?? [],
    isLesson: /^lesson:$/m.test(block),
  };
}

const markdown = (dir) =>
  readdirSync(dir).flatMap((entry) => {
    const full = path.join(dir, entry);
    return statSync(full).isDirectory() ? markdown(full) : entry.endsWith(".md") ? [full] : [];
  });

// 1. Parts
const folders = readdirSync(BOOK).filter((f) => /^\d+\./.test(f) && statSync(path.join(BOOK, f)).isDirectory());
for (const part of PARTS) {
  const dir = path.join(BOOK, part.folder);
  if (!existsSync(dir)) {
    fail(dir, "part folder is missing");
    continue;
  }
  if (!existsSync(path.join(dir, "00.index.md"))) fail(dir, "part has no 00.index.md overview");
  if (!existsSync(path.join(dir, ".navigation.yml"))) fail(dir, "part has no .navigation.yml");
  const overview = path.join(dir, "00.index.md");
  if (existsSync(overview) && frontmatter(overview).path !== `/docs/learn/${part.slug}`) {
    fail(overview, `overview path must be /docs/learn/${part.slug}`);
  }
}
for (const folder of folders) {
  if (folder !== "00.start" && !PARTS.some((p) => p.folder === folder)) {
    fail(path.join(BOOK, folder), "folder is not a part in scripts/learn-course.mjs");
  }
}

// 2. Flat, unique paths
const owners = new Map();
for (const file of markdown(BOOK)) {
  const { path: route } = frontmatter(file);
  if (!route) {
    fail(file, "no frontmatter `path:` — course pages are served flat under /docs/learn");
    continue;
  }
  if (route !== "/docs/learn" && !/^\/docs\/learn\/[a-z0-9-]+(\/[a-z0-9-]+)?$/.test(route)) {
    fail(file, `path ${route} is not /docs/learn/<slug>`);
  }
  if (owners.has(route)) fail(file, `path ${route} is also used by ${path.relative(ROOT, owners.get(route))}`);
  owners.set(route, file);
}

// 3–5. Lessons
const seen = new Set();
for (const part of PARTS) {
  const dir = path.join(BOOK, part.folder);
  if (!existsSync(dir)) continue;
  const files = readdirSync(dir)
    .filter((f) => /^\d+\.[a-z0-9-]+\.md$/.test(f) && !f.startsWith("00."))
    .sort();
  let previous = 0;
  for (const name of files) {
    const file = path.join(dir, name);
    const meta = frontmatter(file);
    const slug = name.replace(/^\d+\./, "").replace(/\.md$/, "");
    if (!meta.isLesson || !meta.number || !meta.source) {
      fail(file, "lesson frontmatter needs lesson.number and lesson.source");
      continue;
    }
    const [partNumber, index] = meta.number.split(".").map(Number);
    if (partNumber !== part.number) fail(file, `lesson ${meta.number} is filed in part ${part.number}`);
    if (!(index > previous)) fail(file, `lesson ${meta.number} is out of order`);
    previous = index;
    if (meta.path !== `/docs/learn/${slug}`) fail(file, `path should be /docs/learn/${slug} to match the file name`);
    for (const required of meta.requires) {
      if (!seen.has(required)) fail(file, `requires "${required}", which is not an earlier lesson`);
    }
    const text = readFileSync(file, "utf8");
    for (const region of ["needs", "program", "output"]) {
      if (!text.includes(`<!-- sync:${region}:start -->`) || !text.includes(`<!-- sync:${region}:end -->`)) {
        fail(file, `the generated sync:${region} region is missing`);
      }
    }
    seen.add(slug);
  }
}

console.log(`course pages    : ${owners.size}`);
console.log(`lessons         : ${seen.size}`);
console.log(`problems        : ${problems.length}`);
for (const problem of problems) console.log(`  ${problem}`);
console.log(problems.length ? "FAIL" : "PASS");
process.exit(problems.length ? 1 : 0);
