# Rux Website

The official website for [Rux](https://rux-lang.dev), built with Nuxt, Nuxt Content, and Nuxt UI. The registry is served at `https://rux-lang.dev/packages`; its API is the separate `rux-lang/WebApi` service at `https://api.rux-lang.dev`.

## Project Structure

```
.
├── app/
│   ├── assets/           # CSS and the .rux example sources
│   ├── components/       # site shell, docs, and package-registry UI
│   ├── layouts/
│   ├── pages/            # site pages and the /packages registry subtree
│   ├── app.vue
│   ├── error.vue
│   └── app.config.ts
├── content/              # every page, as Markdown
│   ├── docs/             # language reference
│   ├── api/              # standard library and platform APIs
│   ├── cli/              # rux CLI subcommands
│   ├── start/            # Get Started guide
│   ├── blog/
│   └── partials/         # fragments rendered inside Vue pages
├── grammars/             # rux.tmLanguage.json, the Shiki grammar
├── public/               # static assets, fonts, served from the site root
├── scripts/              # build helpers and the verification gates
├── content.config.ts
└── nuxt.config.ts
```

Nuxt Content maps every `.md` file under `content/` to a route based on its path. Navigation is generated from the filesystem — **there is no sidebar file to edit.** Ordering comes from numeric filename prefixes (`03.signed/2.int8.md` → `/docs/signed/int8`), which are stripped from the URL, and directory titles come from `.navigation.yml`.

Images go in `public/images/` and are referenced from `/images/`.

## Commands

All commands are run from the root of the project, from a terminal:

| Command                    | Action                                                         |
| :------------------------- | :------------------------------------------------------------- |
| `npm install`              | Installs dependencies                                          |
| `npm run dev`              | Starts local dev server at `localhost:3000`                    |
| `npm run generate`         | Builds the static site into `.output/public/`                  |
| `npm run generate:hosting` | Builds and adds the live registry sitemap                      |
| `npm run preview`          | Previews the production build locally                          |
| `npm run verify`           | Runs documentation-site verification gates                     |
| `npm run lint`             | Lints all Vue and TypeScript source                            |
| `npm run typecheck`        | Runs Nuxt type checking                                        |
| `npm test`                 | Runs the Vitest suite                                          |
| `npm run sync:examples`    | Regenerates the home page snippets from `app/assets/examples/` |

`npm run build` produces a server build. Cloudflare Pages uses `npm run generate:hosting`, with `NUXT_PUBLIC_API_BASE_URL=https://api.rux-lang.dev`, `RUX_SITEMAP_API_BASE_URL=https://api.rux-lang.dev`, and `RUX_SITE_ORIGIN=https://rux-lang.dev`.

Registry data is loaded only in the browser. Static utility pages are prerendered, while `/packages/*` deep links fall back to Nuxt's generated `200.html` through `public/_redirects`.

## Verification

`npm run verify` runs after `npm run generate` and checks the built output:

| Gate              | Checks                                                            |
| :---------------- | :---------------------------------------------------------------- |
| `verify:routes`   | Every Markdown file produced a route; no ordering prefix in a URL |
| `verify:links`    | Every internal link and `#anchor` resolves                        |
| `verify:meta`     | Canonical link, title, and complete share cards                   |
| `verify:snippets` | Home page snippets match `app/assets/examples/*.rux`              |
| `verify:render`   | Highlighting, callouts, code groups, fonts, dark mode             |

Every gate checks the build against the repository itself, so adding or removing pages needs no bookkeeping.

## Deployment

Cloudflare Pages, from `main`:

| Setting          | Value                      |
| :--------------- | :------------------------- |
| Build command    | `npm run generate:hosting` |
| Output directory | `.output/public`           |
| `NODE_VERSION`   | `24`                       |

A wrong output directory publishes a blank site rather than failing the build, so check it on the first deploy.

## Contributing

Pull requests should target `dev`, not `main`. CI rejects pull requests opened against `main`. To add a page, create the Markdown file under `content/` — it appears in the navigation automatically.

## License

Licensed under the [MIT License](LICENSE.md).
