import { defineConfig } from "vitepress";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";

// Load Rux grammar for syntax highlighting
const dirname = path.dirname(fileURLToPath(import.meta.url));
const filename = path.resolve(dirname, "./grammars/rux.tmLanguage.json");
const ruxGrammar = JSON.parse(readFileSync(filename, "utf-8"));

// Set aliases for the Rux grammar
ruxGrammar.aliases = ["rux"];

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Rux Programming Language",
  description:
    "Fast, compiled, strongly typed, multi-paradigm, general-purpose",
  srcDir: "./src",
  cleanUrls: true,
  lastUpdated: true,
  sitemap: { hostname: "https://rux-lang.dev" },

  head: [
    ["link", { rel: "icon", type: "image/svg+xml", href: "/logo.svg" }],
    ["link", { rel: "icon", href: "/favicon.ico", sizes: "any" }],
    [
      "link",
      {
        rel: "apple-touch-icon",
        sizes: "180x180",
        href: "/apple-touch-icon.png",
      },
    ],
    [
      "script",
      {
        defer: "true",
        src: "https://cloud.umami.is/script.js",
        "data-website-id": "c3db4674-752d-4334-a22b-6deba2e4ecfb",
      },
    ],
  ],

  // https://vitepress.dev/reference/default-theme-config
  themeConfig: {
    logo: "/logo.svg",
    siteTitle: "Rux",

    nav: [
      { text: "Home", link: "/" },
      {
        text: "Reference",
        items: [
          { text: "Rux Reference", link: "/docs/" },
          { text: "API Reference", link: "/api/" },
          { text: "CLI Reference", link: "/cli/" },
        ],
      },
      { text: "Tutorials", link: "/tutorials/" },
      { text: "Packages", link: "/packages" },
      {
        text: "Download",
        items: [
          { text: "0.1.0", link: "https://github.com/rux-lang/Rux/releases" },
          {
            text: "Changelog",
            link: "https://github.com/rux-lang/Rux/blob/main/CHANGELOG.md",
          },
        ],
      },
      { text: "Blog", link: "/blog/getting-started" },
      { text: "FAQ", link: "/faq" },
    ],

    sidebar: {
      "/docs/": [
        {
          text: "Rux Reference",
          collapsed: false,
          items: [
            { text: "Table of Contents", link: "/docs/" },
            { text: "Introduction", link: "/docs/introduction" },
            {
              text: "Lexical Structure",
              collapsed: true,
              items: [
                { text: "Source Files", link: "/docs/lexical/sources" },
                { text: "Comments", link: "/docs/lexical/comments" },
                { text: "Keywords", link: "/docs/lexical/keywords" },
                { text: "Identifiers", link: "/docs/lexical/identifiers" },
                { text: "Literals", link: "/docs/lexical/literals" },
                { text: "Operators", link: "/docs/lexical/operators" },
              ],
            },
            {
              text: "Types",
              collapsed: true,
              items: [
                { text: "Integer Types", link: "/docs/types/int" },
                { text: "Floating-Point Types", link: "/docs/types/float" },
                { text: "Boolean Types", link: "/docs/types/bool" },
                { text: "Character Types", link: "/docs/types/char" },
                { text: "Composite Types", link: "/docs/types/composite" },
                { text: "Type Aliases", link: "/docs/types/alias" },
              ],
            },
            { text: "Variables", link: "/docs/variables" },
            { text: "Constants", link: "/docs/constants" },
            { text: "Statements", link: "/docs/statements" },
            { text: "Functions", link: "/docs/functions" },
            { text: "Structs", link: "/docs/structs" },
            { text: "Enums", link: "/docs/enums" },
            { text: "Unions", link: "/docs/unions" },
            { text: "Interfaces", link: "/docs/interfaces" },            
            { text: "Modules", link: "/docs/modules" },            
            { text: "Error Handling", link: "/docs/error" },
            { text: "Extern and FFI", link: "/docs/extern" },
            {
              text: "Package System",
              collapsed: true,
              items: [
                { text: "Package Manifest", link: "/docs/packages/manifest" },
                { text: "Package Types", link: "/docs/packages/types" },
                { text: "Directory Layout", link: "/docs/packages/dirs" },
                { text: "Dependencies", link: "/docs/packages/dependencies" },
              ],
            },
            {
              text: "Appendix",
              collapsed: true,
              items: [
                { text: "Token Reference", link: "/docs/appendix/tokens" },
              ],
            },
          ],
        },
      ],
      "/api/": [
        {
          text: "API Reference",
          collapsed: false,
          items: [{ text: "Overview", link: "/api/" }],
        },
      ],
      "/cli/": [
        {
          text: "CLI Reference",
          collapsed: false,
          items: [
            { text: "Overview", link: "/cli/" },
            { text: "Global Options", link: "/cli/global" },
            { text: "rux add", link: "/cli/add" },
            { text: "rux build", link: "/cli/build" },
            { text: "rux clean", link: "/cli/clean" },
            { text: "rux doc", link: "/cli/doc" },
            { text: "rux fmt", link: "/cli/fmt" },
            { text: "rux help", link: "/cli/help" },
            { text: "rux init", link: "/cli/init" },
            { text: "rux install", link: "/cli/install" },
            { text: "rux new", link: "/cli/new" },
            { text: "rux remove", link: "/cli/remove" },
            { text: "rux run", link: "/cli/run" },
            { text: "rux test", link: "/cli/test" },
            { text: "rux up", link: "/cli/up" },
            { text: "rux version", link: "/cli/version" },
          ],
        },
      ],
      "/tutorials/": [
        {
          text: "Tutorials",
          collapsed: false,
          items: [
            { text: "Overview", link: "/tutorials/" },
            { text: "Hello World", link: "/tutorials/hello-world" },
          ],
        },
      ],
      "/blog/": [
        {
          text: "2025",
          collapsed: false,
          items: [{ text: "Getting Started", link: "/blog/getting-started" }],
        },
      ],
    },

    socialLinks: [
      {
        icon: "github",
        link: "https://github.com/rux-lang",
        ariaLabel: "GitHub",
      },
      { icon: "x", link: "https://x.com/ruxlang", ariaLabel: "X" },
      {
        icon: "bluesky",
        link: "https://ruxlang.bsky.social",
        ariaLabel: "Bluesky",
      },
      {
        icon: "mastodon",
        link: "https://mastodon.social/@ruxlang",
        ariaLabel: "Mastodon",
      },
      {
        icon: "telegram",
        link: "https://t.me/ruxlang",
        ariaLabel: "Telegram",
      },
      {
        icon: "discord",
        link: "https://discord.com/invite/uvSHjtZSVG",
        ariaLabel: "Discord",
      },
      {
        icon: {
          svg: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path stroke="none" d="M19.2,1.2c2.65,0,4.8,2.15,4.8,4.8v9.6c0,2.65-2.15,4.8-4.8,4.8h-3.1l-3.25,3.25c-.43.43-1.11.47-1.58.1l-.11-.1-3.25-3.25h-3.1c-2.56,0-4.67-2.01-4.79-4.56v-.24s0-9.6,0-9.6C0,3.35,2.15,1.2,4.8,1.2h14.4ZM14.4,12h-7.2c-.66,0-1.2.54-1.2,1.2s.54,1.2,1.2,1.2h7.2c.66,0,1.2-.54,1.2-1.2s-.54-1.2-1.2-1.2M16.8,7.2H7.2c-.66,0-1.2.54-1.2,1.2s.54,1.2,1.2,1.2h9.6c.66,0,1.2-.54,1.2-1.2s-.54-1.2-1.2-1.2" /></svg>',
        },
        link: "https://github.com/rux-lang/Rux/discussions",
        ariaLabel: "Discussions",
      },
    ],

    externalLinkIcon: true,

    editLink: {
      pattern: "https://github.com/rux-lang/Rux.Web/edit/main/docs/:path",
      text: "Edit this page on GitHub",
    },

    lastUpdated: {
      text: "Last updated",
      formatOptions: {
        dateStyle: "medium",
        timeStyle: "medium",
      },
    },

    footer: {
      message:
        'Released under the <a href="https://github.com/rux-lang/Rux/blob/main/LICENSE">MIT License</a>',
      copyright:
        'Copyright © 2026 <a href="https://github.com/musicvano">Ivan Muzyka</a>',
    },
  },

  markdown: {
    math: true,
    theme: {
      light: "github-light",
      dark: "github-dark",
    },
    languages: [ruxGrammar],
  },
});
