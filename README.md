# Rux Website

Built with [VitePress](https://vitepress.dev)

## ⚙️ Project Structure

Inside the project you'll see the following folders and files:

```
.
├── .vitepress/
│   └── config.mts
├── src/
│   ├── docs/
│   │   └── *.md
│   ├── public/
│   │   └── images/
│   ├── index.md
│   └── *.md
└── package.json
```

VitePress looks for `.md` files in the `src/` and `src/docs/` directories. Each file is exposed as a route based on its file name.

Images can be added to `src/public/images/` and embedded in Markdown with a relative link.

Static assets, like favicons, can be placed in the `src/public/` directory.

## 🔨 Commands

All commands are run from the root of the project, from a terminal:

| Command           | Action                                             |
| :---------------- | :------------------------------------------------- |
| `npm install`     | Installs dependencies                              |
| `npm run dev`     | Starts local dev server at `localhost:5173`        |
| `npm run build`   | Build your production site to `./.vitepress/dist/` |
| `npm run preview` | Preview your build locally, before deploying       |

## 👀 Want to learn more?

Check out [VitePress Guide](https://vitepress.dev/guide/what-is-vitepress), read [VitePress Reference](https://vitepress.dev/reference/site-config), or jump into the [Getting Started](https://vitepress.dev/guide/getting-started).
