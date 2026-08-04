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
  modules: ["@nuxt/ui", "@nuxt/content", "@nuxtjs/sitemap", "@nuxt/eslint"],
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
          // All three keys must be set. @nuxt/ui defaults to
          // light/default/dark = material-theme-{lighter,,palenight}, and
          // overriding only `default` + `dark` leaves `light` behind — the
          // emitted CSS puts `html.light .shiki span` after `html .default`,
          // so light mode would silently render in material-theme-lighter.
          theme: {
            default: "github-light",
            light: "github-light",
            dark: "github-dark",
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
        "/packages",
        "/packages/-/search",
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
      // Everything from `message-circle` down is an app.config `prose.codeIcon`
      // entry for the home page's code-group tabs. Those labels carry no
      // extension, so there is no `i-vscode-icons-file-type-*` fallback to hide
      // a miss: an unlisted one renders as a blank gap. Keep this in step with
      // the codeIcon map in app/app.config.ts.
      icons: [
        "lucide:file-code",
        "lucide:arrow-up-right",
        "lucide:message-circle",
        "lucide:sigma",
        "lucide:square-function",
        "lucide:ellipsis",
        "lucide:box",
        "lucide:pencil",
        "lucide:map-pin",
        "lucide:plug",
        "lucide:import",
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
