# Rux Website

[![CI](https://github.com/rux-lang/Web/actions/workflows/ci.yml/badge.svg?branch=dev)](https://github.com/rux-lang/Web/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/github/license/rux-lang/Web)](LICENSE.md)
[![Website](https://img.shields.io/badge/website-rux--lang.dev-blue)](https://rux-lang.dev)

The official website for the [Rux programming language](https://rux-lang.dev), built with Nuxt 4, Nuxt Content 3, and Nuxt UI 4.

This application contains three main areas:

- **Documentation and blog** — more than 550 Markdown pages, prerendered as a fully static site.
- **Package registry** — a client-side interface under [`/packages`](https://rux-lang.dev/packages).
- **Playground** — a browser-based Rux editor and runner under [`/play`](https://rux-lang.dev/play).

The registry and playground communicate with the separate Rust [`rux-lang/Server`](https://github.com/rux-lang/Server) service at `https://api.rux-lang.dev`. This repository contains only the website; its sole Nitro server route generates the blog RSS feed during the static build.

## Requirements

- Node.js 24 (see [`.nvmrc`](.nvmrc))
- npm

## Getting Started

```bash
npm ci
npm run dev
```

The development server runs at <http://localhost:3000>. Documentation, blog, and marketing pages work without any other service.

Registry pages expect the Rux server at `http://localhost:8080` by default. The playground additionally requires the server's playground broker and sandbox. See the [`rux-lang/Server`](https://github.com/rux-lang/Server) documentation for its local setup.

## Project Structure

```text
.
├── app/
│   ├── assets/            # global CSS
│   ├── components/        # site, content, registry, and playground UI
│   ├── composables/       # shared API, authentication, and navigation state
│   ├── layouts/           # default, documentation, and registry layouts
│   ├── pages/             # marketing, blog, registry, and playground routes
│   ├── plugins/           # client initialization
│   ├── types/             # application types
│   └── utils/             # parsing, normalization, and domain utilities
├── content/
│   ├── docs/              # five documentation books under /docs
│   ├── blog/              # blog posts
│   └── partials/          # Markdown fragments embedded in Vue pages
├── grammars/              # Rux TextMate grammar used by Shiki and CodeMirror
├── public/                # static assets, fonts, headers, and redirects
├── scripts/               # build helpers and generated-site verification
├── server/                # prerendered blog RSS route and feed serializer
├── test/                  # Vitest and build-quality tests
├── content.config.ts      # Nuxt Content collections and schema
└── nuxt.config.ts         # Nuxt, Nitro, sitemap, icon, and runtime config
```

Nuxt Content maps routable Markdown under `content/` to URLs based on its path. Documentation navigation is derived from the filesystem—there is no sidebar file to edit. Numeric prefixes control ordering and are removed from URLs, while `.navigation.yml` files provide directory titles.

Images belong in `public/images/` and are referenced from `/images/...`.

## Commands

Run commands from the repository root:

| Command                      | Action                                                            |
| :--------------------------- | :---------------------------------------------------------------- |
| `npm run dev`                | Start the development server at `localhost:3000`                  |
| `npm run build`              | Create a Nuxt server build                                        |
| `npm run generate`           | Generate the static site in `.output/public/`                     |
| `npm run generate:hosting`   | Generate the production site and add the live registry sitemap    |
| `npm run preview`            | Preview a production build                                        |
| `npm run lint`               | Lint Vue and TypeScript source                                    |
| `npm run typecheck`          | Run Nuxt type checking                                            |
| `npm test`                   | Run the Vitest suite                                              |
| `npm run format:check`       | Check repository formatting with Prettier                         |
| `npm run verify`             | Verify routes, links, metadata, and rendering in a generated site |
| `npm run test:quality`       | Run Lighthouse checks against a previously generated site         |
| `npm run test:hosting-build` | Exercise the production hosting build                             |

## Verification

`npm run verify` checks `.output/public`, so run a static build first:

```bash
npm run generate
npm run verify
```

The verification gates derive their expectations from the repository:

| Gate            | Checks                                                               |
| :-------------- | :------------------------------------------------------------------- |
| `verify:routes` | Every Markdown page was generated and ordering prefixes did not leak |
| `verify:links`  | Internal links, assets, and page anchors resolve                     |
| `verify:meta`   | Canonical URLs, titles, and social metadata are complete             |
| `verify:render` | Syntax highlighting, prose components, fonts, and themes render      |

CI runs linting, type checking, unit tests, static generation, generated-site verification, and supply-chain checks.

## Deployment

Cloudflare Pages deploys `main` as a fully static site:

| Setting          | Value                      |
| :--------------- | :------------------------- |
| Build command    | `npm run generate:hosting` |
| Output directory | `dist`                     |
| Node.js version  | `24`                       |

The output directory is `dist`, not the `.output/public` a local build produces: on Cloudflare, nitro selects the `cloudflare-pages-static` preset, which writes the site to `dist` instead. Locally Nuxt symlinks `dist` to `.output/public`, so either path works on a developer machine.

Production builds use `NUXT_PUBLIC_API_BASE_URL`, `RUX_SITEMAP_API_BASE_URL`, and `RUX_SITE_ORIGIN` to point the client and generated sitemap at the deployed services. The registry sitemap is best-effort: if the API is unreachable, the build logs a warning and publishes a sitemap of content routes alone rather than failing.

## Contributing

Pull requests must target `dev`; CI rejects pull requests opened against `main`.

To add documentation, create a Markdown file under `content/docs/`. Routes and navigation are generated from the content tree, so no route or sidebar registry needs updating.

## License

Licensed under the [MIT License](LICENSE.md).
