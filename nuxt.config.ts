import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { contentRoutes } from "./scripts/routes.mjs";

// MDC registers object grammars by `lang.name` ONLY and ignores
// `aliases` (@nuxtjs/mdc does `langsMap.set(lang.name, lang)`). The grammar
// ships as name "Rux", so ```rux fences would silently render unhighlighted.
// Lowercase the name; do NOT also set aliases, or Shiki throws
// "Circular alias rux -> rux" and @nuxt/content drops the whole page.
const ruxGrammar = JSON.parse(
  readFileSync(fileURLToPath(new URL("./grammars/rux.tmLanguage.json", import.meta.url)), "utf-8"),
);
ruxGrammar.name = "rux";

export default defineNuxtConfig({
  // @nuxt/content MUST come after @nuxt/ui, or prose components don't resolve.
  //
  // motion-v is already in the tree as a dependency of @nuxt/ui, but @nuxt/ui
  // only consumes it internally — the module is what auto-imports <Motion> for
  // our own templates (the header toggle, the home page's in-view stagger).
  modules: ["@nuxt/ui", "@nuxt/content", "@nuxtjs/sitemap", "@nuxt/eslint", "motion-v/nuxt"],
  css: ["~/assets/css/main.css"],
  compatibilityDate: "2025-01-01",

  site: {
    url: "https://rux-lang.dev",
    name: "Rux Programming Language",
  },

  runtimeConfig: {
    public: {
      apiBaseUrl: "http://localhost:8080",
      // The Rux *language* release shown in the header badge — not this site's
      // package.json version, which happens to match today but drifts the
      // moment either ships on its own. Override at build time with
      // NUXT_PUBLIC_RUX_VERSION so a release does not need a code change.
      ruxVersion: "0.4.0",
      // Star count shown beside the header's GitHub button. Static: nuxt.com
      // serves this from its own cached API, and a prerendered site with no
      // server has nowhere to cache it. Bump it here, or set
      // NUXT_PUBLIC_GITHUB_STARS at build time to pull it from the API.
      githubStars: "489",
    },
  },

  app: {
    head: {
      titleTemplate: "%s | Rux Programming Language",
      link: [
        // Site-wide feed discovery: readers and browser extensions look for
        // this on whatever page the user is standing on, not just /blog.
        {
          rel: "alternate",
          type: "application/rss+xml",
          title: "Rux Blog",
          href: "https://rux-lang.dev/blog/rss.xml",
        },
        { rel: "icon", type: "image/svg+xml", href: "/logo.svg" },
        { rel: "icon", href: "/favicon.ico", sizes: "any" },
        {
          rel: "apple-touch-icon",
          sizes: "180x180",
          href: "/apple-touch-icon.png",
        },
      ],
    },
  },

  content: {
    // without this @nuxt/content interactively prompts to install
    // better-sqlite3, which hard-fails in non-interactive CI (Cloudflare).
    // 'native' uses Node's built-in node:sqlite.
    experimental: { sqliteConnector: "native" },
    build: {
      markdown: {
        // VitePress default outline was h2 only.
        toc: { depth: 2, searchDepth: 2 },
        highlight: {
          // nuxt.com's pair, which is also @nuxt/ui's default. All three keys
          // must still be set explicitly: the emitted CSS puts
          // `html.light .shiki span` after `html .default`, so leaving `light`
          // unset lets it fall through to whatever `default` resolves to.
          theme: {
            default: "material-theme-lighter",
            light: "material-theme-lighter",
            dark: "material-theme-palenight",
          },
          // Supplying `langs` REPLACES the default set, so every language the
          // site actually uses has to be listed explicitly.
          langs: [ruxGrammar, "sh", "bash", "toml", "json", "yaml", "js", "ts", "vue", "c", "powershell"],
        },
      },
    },
  },

  nitro: {
    prerender: {
      // seed deterministically from the content tree. crawlLinks alone
      // found 5 of 550 pages on the first build, because nothing linked to the
      // rest yet — exactly the silent drop gate 1 exists to catch.
      routes: contentRoutes().concat([
        "/200.html",
        // server/routes/blog/rss.xml.ts. Nothing links to it from a crawlable
        // <a> before this list is built, and a static host has no nitro to
        // serve it on demand — unlisted, the feed simply would not exist.
        "/blog/rss.xml",
        "/packages",
        "/packages/-/keywords",
        "/packages/-/auth/sign-in",
        "/packages/-/auth/callback",
        "/packages/-/dashboard",
        "/packages/-/dashboard/tokens",
        "/packages/-/dashboard/settings",
      ]),
      crawlLinks: true,
      failOnError: false,
    },
  },

  // Icons must be baked into the build. The default server bundle resolves
  // icons through a runtime API route, which does not exist in a fully
  // prerendered site — every icon then fails at SSR ("failed to load icon
  // lucide:chevron-down") and the HTML ships with no <svg> at all.
  icon: {
    clientBundle: {
      scan: true,
      includeCustomCollections: true,
      // The scanner only finds icon names written literally in templates, so
      // names referenced indirectly (app.config codeIcon, component defaults)
      // have to be listed or they fail to resolve at prerender time.
      // `arrow-up-right` is ui.icons.external, which UFooterColumns renders for
      // any `target: '_blank'` link — the name never appears in source.
      //
      // The five topic-tab icons are data in app/pages/index.vue rather than
      // literal template attributes, so the scanner cannot discover them.
      icons: [
        "lucide:file-code",
        "lucide:arrow-up-right",
        // UCodeIcon assembles `i-vscode-icons-file-type-<ext>` from a fence's
        // filename when neither the filename nor the extension is in the
        // codeIcon map, so the name exists nowhere in source for the scanner to
        // find. `.rux` is mapped to lucide:file-code above; the `Rux.toml`
        // manifest in every home-page code tree falls through to this one.
        "vscode-icons:file-type-toml",
        // Header dropdown icons. These live in app/composables/useNavigation.ts,
        // and the scanner only globs .vue/.md/.yml — an icon named only in a
        // .ts file is invisible to it and fails to resolve at prerender.
        "lucide:rocket",
        "lucide:book-open",
        "lucide:square-terminal",
        "lucide:code-xml",
        "lucide:package",
        "lucide:newspaper",
        "lucide:messages-square",
        "lucide:hand-heart",
        "lucide:circle-help",
        "lucide:message-square-text",
        "lucide:square-function",
        "lucide:layout-panel-top",
        "lucide:at-sign",
        "lucide:import",
        // The package page's tab strip. Same problem again: the names are data in
        // a computed in app/pages/packages/[namespace]/[package].vue, not literal
        // template attributes, so the scanner cannot see them.
        // (`lucide:package` is already listed above.)
        "lucide:book-text",
        "lucide:package-open",
        "lucide:scale",
        // The playground's example gallery. Same problem: the names are data in
        // app/utils/playground-examples.ts, and a .ts file is invisible to the
        // scanner, so they would render as blank gaps in the example selector.
        "lucide:terminal",
        "lucide:languages",
        "lucide:binary",
        "lucide:sigma",
        "lucide:brackets",
        "lucide:circle-dashed",
      ],
    },
  },

  // robots.txt hard-references https://rux-lang.dev/sitemap.xml, so the
  // sitemap must stay at exactly that path (a single sitemap, not an index).
  sitemap: {
    xsl: false,
  },

  typescript: {
    strict: true,
    typeCheck: true,
  },

  devtools: { enabled: true },
});
