export default defineAppConfig({
  ui: {
    colors: {
      primary: "rux",
      neutral: "slate",
    },
    // UPageHero's default padding is looser than nuxt.com's and its title stops
    // scaling at the `sm` breakpoint. These two overrides are the vertical
    // rhythm of every nuxt.com marketing page — ported verbatim so the hero on
    // the home page and the standalone content pages sit at the same height.
    pageHero: {
      slots: {
        container: "py-10 sm:py-20 lg:py-20",
        title: "sm:text-5xl",
      },
    },
    prose: {
      // Markdown images default to their intrinsic width, which leaves narrow
      // screenshots floating in the prose column. nuxt.com stretches them.
      img: {
        slots: {
          base: "w-full",
        },
      },
      // Highlight only the ICON of the active code-group tab, not the whole
      // trigger. `data-state` lives on the trigger, so the trigger carries
      // `group` and the icon reads it — the same pairing nuxt.com uses on its
      // home-page tabs.
      codeGroup: {
        slots: {
          trigger: "group",
          triggerIcon: "group-data-[state=active]:text-primary",
        },
      },
      // CodeIcon resolves a tab label in two steps: the whole filename
      // LOWERCASED first, then the extension, falling back to
      // `i-vscode-icons-file-type-<ext>`.
      //
      // `rux` covers the docs, where fences are named `[Main.rux]` — without it
      // they ask for a `file-type-rux` icon that does not exist (VitePress
      // supplied one through vitepress-plugin-group-icons).
      //
      // The lowercase entries are the home page's samples, whose labels carry no
      // extension. Because there is no extension to fall back to, a sample
      // missing from this map renders with no icon at all — so a new tab in
      // content/partials/home-examples.md needs a line here too.
      codeIcon: {
        rux: "i-lucide-file-code",
        hello: "i-lucide-message-circle",
        factorial: "i-lucide-sigma",
        func: "i-lucide-square-function",
        variadic: "i-lucide-ellipsis",
        struct: "i-lucide-box",
        mut: "i-lucide-pencil",
        pointer: "i-lucide-map-pin",
        interface: "i-lucide-plug",
        import: "i-lucide-import",
      },
    },
  },
});
