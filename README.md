# Rux Website

The official website for the [Rux](https://rux-lang.dev) programming language, built with [VitePress](https://vitepress.dev).

## Project Structure

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

VitePress processes `.md` files recursively under `src/`. Each file is exposed as a route based on its path and file name. Images can be added to `src/public/images/` and referenced in Markdown from `/images/`. Other static assets, such as favicons, can be placed in `src/public/`.

## Commands

All commands are run from the root of the project, from a terminal:

| Command           | Action                                           |
| :---------------- | :----------------------------------------------- |
| `npm install`     | Installs dependencies                            |
| `npm run dev`     | Starts local dev server at `localhost:5173`      |
| `npm run build`   | Builds the production site in `.vitepress/dist/` |
| `npm run preview` | Previews the production build locally            |

## Contributing

Pull requests should target `dev`, not `main`. CI rejects pull requests opened against `main`.

## License

Licensed under the [MIT License](LICENSE.md).
