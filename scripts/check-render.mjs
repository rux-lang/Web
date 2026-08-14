/**
 * Rendering checks — assert the DOM shape a correct render produces.
 *
 * These do not replace looking at the site, but they catch the failures that
 * are invisible in a quick glance: a code theme that is only wrong in light
 * mode, a callout that silently vanished, a literal `{{` that got interpolated.
 *
 *   node scripts/check-render.mjs [distDir]
 */
import fs from "node:fs";
import path from "node:path";

const DIST = process.argv[2] ?? ".output/public";

const read = (route) => {
  const f = path.join(DIST, route, "index.html");
  return fs.existsSync(f) ? fs.readFileSync(f, "utf8") : null;
};

const allPages = (() => {
  const out = [];
  const walk = (d) => {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) walk(p);
      else if (e.name === "index.html") out.push(p);
    }
  };
  walk(DIST);
  return out;
})();

const rows = [];
const check = (id, label, fn) => {
  let r;
  try {
    r = fn();
  } catch (e) {
    r = { ok: false, detail: e.message };
  }
  rows.push({ id, label, ...r });
};

const styleOf = (html) => [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map((m) => m[1]).join("\n");

// Rux fences highlighted
// @nuxt/content emits hashed token classes plus a <style> block of --shiki-*
// custom properties, not inline colours, so assert the class/variable pairing.
for (const route of [
  "/docs/lang/functions/declaration",
  "/docs/api/io/print",
  "/docs/start/examples",
  "/docs/lang/structs/methods",
]) {
  check("code", route, () => {
    const h = read(route);
    if (!h) return { ok: false, detail: "route missing" };
    const fences = [...h.matchAll(/<pre[^>]*class="[^"]*language-rux[^"]*"[\s\S]*?<\/pre>/g)].map((m) => m[0]);
    if (!fences.length) return { ok: false, detail: "no language-rux fences" };
    const classes = new Set();
    for (const f of fences) for (const m of f.matchAll(/<span class="(s[\w-]{4,6})"/g)) classes.add(m[1]);
    const styles = styleOf(h);
    // Every token class the fence references must have a --shiki-dark value,
    // or that token renders as inherited body text in dark mode.
    const themed = [...classes].filter((c) =>
      new RegExp("\\." + c + "\\{[^}]*--shiki-dark:#[0-9A-Fa-f]{6}").test(styles),
    );
    return {
      ok: classes.size > 2 && themed.length === classes.size,
      detail: fences.length + " fences, " + classes.size + " token classes, " + themed.length + " themed",
    };
  });
}

// All three theme slots must compile through — setting only `default`+`dark`
// leaves `light` at whatever @nuxt/ui defaults to, and the emitted
// `html.light .shiki span` rule then wins in light mode. Shiki emits the
// classes in default/light/dark order, so this catches a missing slot as well
// as a stale theme name. Keep in step with content.build.markdown.highlight
// .theme in nuxt.config.ts.
const SHIKI_THEMES = ["catppuccin-latte", "catppuccin-latte", "catppuccin-mocha"];

check("code", "shiki themes are the configured trio", () => {
  const h = read("/docs/lang/functions/declaration");
  if (!h) return { ok: false, detail: "route missing" };
  const cls = h.match(/class="[^"]*shiki-themes ([^"]*)"/)?.[1] ?? "";
  const themes = cls.trim().split(/\s+/).filter(Boolean);
  return {
    ok: themes.length === SHIKI_THEMES.length && themes.every((t, i) => t === SHIKI_THEMES[i]),
    detail: themes.join(" ") || "none",
  };
});

// All five container types
// Nuxt UI callouts carry no data attribute — they are identified by the
// semantic colour pair the variant resolves to. Count rendered blocks and
// assert parity with the `::kind` directives still in the source tree, so a
// silently-dropped container cannot pass.
const CALLOUT_COLOUR = {
  note: "info",
  tip: "success",
  warning: "warning",
  caution: "error",
  callout: "primary",
};

check("callouts", "every source callout renders", () => {
  const source = new Map();
  const walkContent = (d) => {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) walkContent(p);
      else if (e.name.endsWith(".md")) {
        for (const m of fs.readFileSync(p, "utf8").matchAll(/^::(note|tip|warning|caution|callout)\b/gm)) {
          source.set(m[1], (source.get(m[1]) ?? 0) + 1);
        }
      }
    }
  };
  walkContent("content");

  const rendered = new Map();
  for (const p of allPages) {
    const h = fs.readFileSync(p, "utf8");
    for (const [kind, colour] of Object.entries(CALLOUT_COLOUR)) {
      const n = (h.match(new RegExp("border-" + colour + "/25 bg-" + colour + "/10", "g")) ?? []).length;
      if (n) rendered.set(kind, (rendered.get(kind) ?? 0) + n);
    }
  }

  const kinds = [...new Set([...source.keys(), ...rendered.keys()])].sort();
  const diff = kinds.filter((k) => (source.get(k) ?? 0) !== (rendered.get(k) ?? 0));
  return {
    ok: diff.length === 0 && kinds.length > 0,
    detail: kinds.map((k) => k + " " + (source.get(k) ?? 0) + "->" + (rendered.get(k) ?? 0)).join(", ") || "none",
  };
});

// Titled callouts: the title must be its own block, not run into the body.
// ProseCallout unwraps the leading <p>, so a titled callout must end its title
// line with a backslash hard break. Forget it and `<strong>Title</strong>` ends
// up glued to the lowercase prose that follows.
check("callouts", "titled callouts keep the title on its own line", () => {
  const bad = [];
  for (const p of allPages) {
    const h = fs.readFileSync(p, "utf8");
    for (const m of h.matchAll(/<strong>([^<]{2,40})<\/strong>([^<]{0,4})/g)) {
      if (/^[A-Z][\w ]+$/.test(m[1]) && /^\s*[a-z]/.test(m[2])) bad.push(path.relative(DIST, p) + " -> " + m[1]);
    }
  }
  return {
    ok: bad.length === 0,
    detail: bad.length ? bad.length + " run together: " + bad.slice(0, 3).join(", ") : "none run together",
  };
});

// Code-group tabs
for (const [route, expectTabs] of [
  ["/docs/start/build", 11],
  ["/docs/start/editors/vscode", 2],
]) {
  check("tabs", route, () => {
    const h = read(route);
    if (!h) return { ok: false, detail: "route missing" };
    const groups = (h.match(/role="tablist"/g) ?? []).length;
    const tabs = (h.match(/role="tab"/g) ?? []).length;
    const panels = (h.match(/role="tabpanel"/g) ?? []).length;
    return {
      ok: tabs === expectTabs && groups > 0 && panels > 0,
      detail: groups + " groups / " + tabs + " tabs / " + panels + " panels (expected " + expectTabs + " tabs)",
    };
  });
}

// <sup> and wide tables
for (const route of ["/docs/lang/appendix/tokens", "/docs/lang/appendix/primitives"]) {
  check("tables", route, () => {
    const h = read(route);
    if (!h) return { ok: false, detail: "route missing" };
    const sups = (h.match(/<sup[ >]/g) ?? []).length;
    const tables = (h.match(/<table/g) ?? []).length;
    const scroll = (h.match(/overflow-x-auto/g) ?? []).length;
    return {
      ok: tables > 0 && scroll > 0,
      detail: tables + " tables, " + sups + " <sup>, " + scroll + " scroll containers",
    };
  });
}

// Literal {{ }} must survive as text, not be interpolated
for (const route of ["/docs/api/io", "/docs/api/io/print"]) {
  check("braces", route, () => {
    const h = read(route);
    if (!h) return { ok: false, detail: "route missing" };
    const braces = (h.match(/\{\{/g) ?? []).length;
    const leaked = /\[object Object\]|v-pre|Error parsing/.test(h);
    return {
      ok: braces > 0 && !leaked,
      detail: braces + " literal '{{' preserved, leak=" + leaked,
    };
  });
}

// Awkward titles
for (const [route, want] of [
  ["/docs/api/linux/syscalls", null],
  ["/docs/api/text/string/plus", "+"],
  ["/blog/release-v0.1.0", null],
  ["/docs/cli/global", null],
]) {
  check("titles", route, () => {
    const h = read(route);
    if (!h) return { ok: false, detail: "route missing" };
    const title = (h.match(/<title[^>]*>([\s\S]*?)<\/title>/)?.[1] ?? "").trim();
    const h1 = (h.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1] ?? "").replace(/<[^>]+>/g, "").trim();
    const bad = /undefined|\[object|&amp;lt;/.test(title);
    return {
      ok: title.length > 0 && h1.length > 0 && !bad && (!want || h1.includes(want)),
      detail: "title=" + JSON.stringify(title) + " h1=" + JSON.stringify(h1),
    };
  });
}

// Fonts, dark mode, search
check("assets", "self-hosted fonts, no external font host", () => {
  const cssDir = path.join(DIST, "_nuxt");
  const all = fs
    .readdirSync(cssDir)
    .filter((f) => f.endsWith(".css"))
    .map((f) => fs.readFileSync(path.join(cssDir, f), "utf8"))
    .join("\n");
  const faces = (all.match(/@font-face/g) ?? []).length;
  const external = /fonts\.googleapis|fonts\.gstatic/.test(all);
  const files = fs.existsSync(path.join(DIST, "fonts")) ? fs.readdirSync(path.join(DIST, "fonts")).length : 0;
  return {
    ok: faces >= 3 && !external,
    detail: faces + " @font-face, " + files + " font files in /fonts, external=" + external,
  };
});

check("assets", "dark-mode rules emitted", () => {
  const h = read("/docs/lang");
  if (!h) return { ok: false, detail: "route missing" };
  const inline = styleOf(h);
  const cssDir = path.join(DIST, "_nuxt");
  const all =
    inline +
    fs
      .readdirSync(cssDir)
      .filter((f) => f.endsWith(".css"))
      .map((f) => fs.readFileSync(path.join(cssDir, f), "utf8"))
      .join("\n");
  // Tailwind emits `dark:` variants as escaped class selectors (`.dark\:bg-x`)
  // as well as plain `.dark ` descendant rules; count both.
  const darkRules = (all.match(/\.dark(\\:|[\s,:{])/g) ?? []).length;
  const script = /colorMode|color-mode/.test(h);
  return {
    ok: darkRules > 50 && script,
    detail: darkRules + " dark rules, colour-mode script=" + script,
  };
});

check("assets", "content search payload prerendered", () => {
  const dir = path.join(DIST, "__nuxt_content");
  if (!fs.existsSync(dir)) return { ok: false, detail: "no __nuxt_content directory" };
  const files = fs
    .readdirSync(dir, { recursive: true })
    .map(String)
    .filter((f) => /\.(json|sql|txt)$/.test(f));
  const bytes = files.reduce((n, f) => n + fs.statSync(path.join(dir, f)).size, 0);
  return {
    ok: files.length > 0 && bytes > 100_000,
    detail: files.length + " artefacts, " + Math.round(bytes / 1024) + " KB",
  };
});

// Report
let fails = 0;
for (const r of rows) {
  if (!r.ok) fails++;
  console.log((r.ok ? "PASS" : "FAIL") + "  " + r.id.padEnd(9) + " " + r.label.padEnd(46) + " " + r.detail);
}
console.log("\n" + (rows.length - fails) + "/" + rows.length + " checks passed");
process.exit(fails ? 1 : 0);
