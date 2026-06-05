---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

# Hero section
hero:
  name: Rux
  text: Programming Language
  image:
    src: /images/mascot.svg
    alt: Rux mascot
  tagline: Fast, compiled, strongly typed, multi-paradigm, general-purpose
  actions:
    - theme: brand
      text: Get Started
      link: /tutorials/install/windows/
    - theme: alt
      text: Reference
      link: /docs/

# Features section
features:
  - icon:
      src: /icons/rocket.svg
    title: Native Performance
    details: Rux compiles to lean, self-contained native binaries — no virtual machines, no interpreters, no garbage collector pauses. Ship code that runs as fast as the hardware allows.
  - icon:
      src: /icons/block.svg
    title: Bulletproof Type System
    details: No implicit conversions and surprises. Primitive data types from 8 to 512 bits, multi-width Unicode characters, slices, tuples, structs, enums, and unions — all resolved at compile time, zero runtime cost.
  - icon:
      src: /icons/shield.svg
    title: Memory Safety
    details: References (&T) and pointers (*T) are first-class and distinct. Get the safety of high-level code and the power of low-level control — without the discipline tax or the complexity.
  - icon:
      src: /icons/dna.svg
    title: Multi-Paradigm Design
    details: Write imperative code, compose with higher-order functions, or model with structs and interfaces — whatever fits the problem. All paradigms, zero runtime overhead, no forced style.
  - icon:
      src: /icons/binary.svg
    title: Full Hardware Access
    details: Inline assembly, raw pointer arithmetic, union-based memory reinterpretation, direct foreign function interface. When you need the metal, Rux gets out of the way.
  - icon:
      src: /icons/code.svg
    title: Clean Syntax
    details: Reads like pseudocode and compiles like assembly. No ceremony, no hidden conversions, no boilerplate. Code that looks right usually is right.
  - icon:
      src: /icons/fast.svg
    title: Instant Toolchain
    details: The entire toolchain — compiler, package manager, formatter, and test runner — ships as a small single binary with zero dependencies. One download, everything included.
  - icon:
      src: /icons/platform.svg
    title: Cross-Platform
    details: From command line tools to game engines and servers — Rux handles it all. Target Windows, Linux, macOS, and more from the same clean source code.

# Meta property
head:
  - - meta
    - itemprop: name
      content: Rux Programming Language
  - - meta
    - itemprop: description
      content: Fast, compiled, strongly typed, multi-paradigm, general-purpose
  - - meta
    - itemprop: image
      content: https://rux-lang.dev/images/rux-social-wide.jpg
  - - meta
    - property: og:url
      content: https://rux-lang.dev
  - - meta
    - property: og:type
      content: website
  - - meta
    - property: og:title
      content: Rux Programming Language
  - - meta
    - property: og:description
      content: Fast, compiled, strongly typed, multi-paradigm, general-purpose
  - - meta
    - property: og:image
      content: https://rux-lang.dev/images/rux-social-wide.jpg
  - - meta
    - name: twitter:card
      content: summary_large_image
  - - meta
    - name: twitter:title
      content: Rux Programming Language
  - - meta
    - name: twitter:description
      content: Fast, compiled, strongly typed, multi-paradigm, general-purpose
  - - meta
    - name: twitter:image
      content: https://rux-lang.dev/images/rux-social-wide.jpg
---

## Code Examples

::: code-group

<<< @/examples/Hello.rux
<<< @/examples/Factorial.rux
<<< @/examples/Func.rux
<<< @/examples/Int.rux
<<< @/examples/Float.rux
<<< @/examples/Bool.rux
<<< @/examples/Char.rux
<<< @/examples/Pointer.rux
<<< @/examples/Mut.rux
<<< @/examples/Import.rux

:::

## Supported Editors

<div class="editor-section">
  <a href="https://zed.dev" target="_blank" rel="noopener"><svg width="48" height="48" viewBox="0 0 90 90" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M8.4375 5.625C6.8842 5.625 5.625 6.8842 5.625 8.4375V70.3125H0V8.4375C0 3.7776 3.7776 0 8.4375 0H83.7925C87.551 0 89.4333 4.5442 86.7756 7.20186L40.3642 53.6133H53.4375V47.8125H59.0625V55.0195C59.0625 57.3495 57.1737 59.2383 54.8438 59.2383H34.7392L25.0712 68.9062H68.9062V33.75H74.5312V68.9062C74.5312 72.0128 72.0128 74.5312 68.9062 74.5312H19.4462L9.60248 84.375H81.5625C83.1158 84.375 84.375 83.1158 84.375 81.5625V19.6875H90V81.5625C90 86.2224 86.2224 90 81.5625 90H6.20749C2.44898 90 0.566723 85.4558 3.22438 82.7981L49.46 36.5625H36.5625V42.1875H30.9375V35.1562C30.9375 32.8263 32.8263 30.9375 35.1562 30.9375H55.085L64.9288 21.0938H21.0938V56.25H15.4688V21.0938C15.4688 17.9871 17.9871 15.4688 21.0938 15.4688H70.5538L80.3975 5.625H8.4375Z"/></svg>Zed</a>
  <a href="https://packagecontrol.io/packages/Rux" target="_blank" rel="noopener"><svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24"><path d="M20.953.004a.4.4 0 0 0-.18.017L3.225 5.585c-.175.055-.323.214-.402.398a.4.4 0 0 0-.06.22v5.726a.4.4 0 0 0 .06.22c.079.183.227.341.402.397l7.454 2.364l-7.454 2.363c-.255.08-.463.374-.463.655v5.688c0 .282.208.444.463.363l17.55-5.565c.237-.075.426-.336.452-.6c.003-.022.013-.04.013-.065V12.06c0-.281-.208-.575-.463-.656L13.4 9.065l7.375-2.339c.255-.08.462-.375.462-.656V.384c0-.211-.117-.355-.283-.38z"/></svg>Sublime Text</a>
  <a href="https://marketplace.visualstudio.com/items?itemName=rux-lang.vscode-rux" target="_blank" rel="noopener"><svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24"><path d="M17 16.47V7.39l-6 4.54M2.22 9.19a.86.86 0 0 1-.02-1.15l1.2-1.11c.2-.18.69-.26 1.05 0l3.42 2.61l7.93-7.25c.32-.32.87-.45 1.5-.12l4 1.91c.36.21.7.54.7 1.15v13.5c0 .4-.29.83-.6 1l-4.4 2.1c-.32.13-.92.01-1.13-.2l-8.02-7.3l-3.4 2.6c-.38.26-.85.19-1.05 0l-1.2-1.1c-.32-.33-.28-.87.05-1.2l3-2.7"/></svg>Visual Studio Code</a>
</div>

## Blog

- [Programming Language Without LLVM](/blog/language-without-llvm) — June 1, 2026
- [Rux 0.2.0 — A Real Language, Allegedly](/blog/release-v0.2.0) — May 10, 2026
- [Rux 0.1.0 — 🎉 It Compiles!](/blog/release-v0.1.0) — April 30, 2026
- [Getting Started](/blog/getting-started) — October 12, 2025

## Community

Subscribe on [YouTube](https://www.youtube.com/@ruxlang), [X](https://x.com/ruxlang), [Bluesky](https://bsky.app/profile/rux-lang.dev), [Mastodon](https://mastodon.social/@ruxlang), or [Telegram](https://t.me/ruxlang) to get early updates, dev logs, and sneak peeks.

Join the conversation on [GitHub Discussions](https://github.com/rux-lang/rux/discussions), [Discord](https://discord.com/invite/uvSHjtZSVG), or [Reddit](https://www.reddit.com/r/ruxlang). We’d love to hear from you!

Not sure where to ask your question or how to get involved? Our community team is here to give you the right answer and help you get started at [info@rux-lang.dev](mailto:info@rux-lang.dev).
