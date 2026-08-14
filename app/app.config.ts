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
      // Nuxt UI's default `pre` base carries `whitespace-pre-wrap
      // wrap-break-word`, so a long line folds mid-token instead of scrolling —
      // which reads badly for code, where indentation is structure. The slot
      // already has `overflow-x-auto`; switching the two wrapping utilities off
      // is all it takes to turn that into a real horizontal scrollbar.
      pre: {
        slots: {
          base: "whitespace-pre wrap-normal",
        },
      },
      // CodeIcon resolves a tab label in two steps: the whole filename
      // LOWERCASED first, then the extension, falling back to
      // `i-vscode-icons-file-type-<ext>`.
      //
      // `rux` covers the docs, where fences are named `[Main.rux]` — without it
      // they ask for a `file-type-rux` icon that does not exist (VitePress
      // supplied one through vitepress-plugin-group-icons).
      codeIcon: {
        rux: "i-lucide-file-code",
      },
    },
  },
});
