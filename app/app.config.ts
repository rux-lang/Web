export default defineAppConfig({
  ui: {
    colors: {
      primary: "rux",
      neutral: "slate",
    },
    prose: {
      // Nuxt UI derives code-group tab icons from the filename extension and
      // falls back to `i-vscode-icons-file-type-<ext>`, so `[Hello.rux]` asks
      // for a `file-type-rux` icon that does not exist. VitePress supplied one
      // through vitepress-plugin-group-icons; map it here instead.
      codeIcon: {
        rux: "i-lucide-file-code",
      },
    },
  },
});
