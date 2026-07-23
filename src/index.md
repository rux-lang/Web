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
  tagline: Fast, compiled, strongly typed, multi-paradigm
  actions:
    - theme: brand
      text: Get Started
      link: /start/
    - theme: alt
      text: Reference
      link: /docs/

# Features section
features:
  - icon:
      src: /icons/rocket.svg
    title: Native Performance
    details: Compiles straight to native machine code. No virtual machine, no interpreter, no garbage collector pauses.
  - icon:
      src: /icons/fast.svg
    title: Instant Toolchain
    details: Compiler, linter, package manager, formatter, and test runner — one small binary, zero dependencies.
  - icon:
      src: /icons/block.svg
    title: Strong Types
    details: No implicit conversions, no surprises. Everything is checked at compile time and free at runtime.
  - icon:
      src: /icons/shield.svg
    title: Memory Safety
    details: References are checked and safe, pointers are raw and unchecked. You choose — no hidden cost on either.
  - icon:
      src: /icons/dna.svg
    title: Multi-Paradigm
    details: Imperative, functional, or data-oriented — pick what fits the problem, no forced style.
  - icon:
      src: /icons/binary.svg
    title: Hardware Access
    details: Inline assembly, raw pointers, and FFI. When you need the metal, Rux gets out of the way.
  - icon:
      src: /icons/code.svg
    title: Clean Syntax
    details: Reads like pseudocode, compiles like assembly. No ceremony, no boilerplate.
  - icon:
      src: /icons/platform.svg
    title: Cross-Platform
    details: Build CLI tools, servers, and games for Linux, Windows, and macOS from the same source.

# Meta property
head:
  - - meta
    - itemprop: name
      content: Rux Programming Language
  - - meta
    - itemprop: description
      content: Fast, compiled, strongly typed, multi-paradigm language
  - - meta
    - itemprop: image
      content: https://rux-lang.dev/images/og-rux.jpg
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
      content: Fast, compiled, strongly typed, multi-paradigm language
  - - meta
    - property: og:image
      content: https://rux-lang.dev/images/og-rux.jpg
  - - meta
    - name: twitter:card
      content: summary_large_image
  - - meta
    - name: twitter:title
      content: Rux Programming Language
  - - meta
    - name: twitter:description
      content: Fast, compiled, strongly typed, multi-paradigm language
  - - meta
    - name: twitter:image
      content: https://rux-lang.dev/images/og-rux.jpg
---

## Up and Running in Seconds

<p class="home-lead">One small download gives you the compiler, linter, package manager, formatter, and test runner. No SDKs to chain together, nothing else to install.</p>

<div class="home-terminal">
  <div class="home-terminal-bar">
    <span class="home-terminal-dot red"></span>
    <span class="home-terminal-dot yellow"></span>
    <span class="home-terminal-dot green"></span>
    <span class="home-terminal-title">Terminal</span>
  </div>
  <div class="home-terminal-body">
    <div class="t-line"><span class="t-prompt">$</span><span class="t-cmd t-cmd-1">rux new App</span></div>
    <div class="t-line t-l2"><span class="t-prompt">$</span><span class="t-cmd t-cmd-2">cd App</span></div>
    <div class="t-line t-l3"><span class="t-prompt">$</span><span class="t-cmd t-cmd-3">rux add Io</span></div>
    <div class="t-line t-l4"><span class="t-prompt">$</span><span class="t-cmd t-cmd-4">rux install</span></div>
    <div class="t-line t-l5"><span class="t-prompt">$</span><span class="t-cmd t-cmd-5">rux run</span></div>
    <div class="t-line t-out t-o1">Compiling App — finished in 38ms</div>
    <div class="t-line t-out t-o2">Hello World</div>
    <div class="t-line t-ready"><span class="t-prompt">$</span><span class="t-cursor"></span></div>
  </div>
</div>

<div class="home-stats">
  <div class="home-stat">
    <div class="home-stat-value">50ms</div>
    <div class="home-stat-label">typical compile — no LLVM, no waiting</div>
  </div>
  <div class="home-stat">
    <div class="home-stat-value">1</div>
    <div class="home-stat-label">tiny binary for the whole toolchain</div>
  </div>
  <div class="home-stat">
    <div class="home-stat-value">0</div>
    <div class="home-stat-label">dependencies, VMs, or runtimes</div>
  </div>
  <div class="home-stat">
    <div class="home-stat-value">100%</div>
    <div class="home-stat-label">native machine code, full speed</div>
  </div>
</div>

## Clean Code

<p class="home-lead">Code that does what it looks like it does — explicit, predictable, and free of ceremony.</p>

::: code-group

<<< @/examples/Hello.rux
<<< @/examples/Greet.rux
<<< @/examples/Factorial.rux
<<< @/examples/Func.rux
<<< @/examples/Variadic.rux
<<< @/examples/Struct.rux
<<< @/examples/Mut.rux
<<< @/examples/Pointer.rux

:::

## Works With Your Editor

<p class="home-lead">Syntax highlighting and language support, wherever you write code.</p>

<div class="home-editors">
  <a class="home-editor-card" href="https://marketplace.visualstudio.com/items?itemName=rux-lang.vscode-rux" target="_blank" rel="noopener">
    <svg class="home-editor-icon" xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24"><path d="M17 16.47V7.39l-6 4.54M2.22 9.19a.86.86 0 0 1-.02-1.15l1.2-1.11c.2-.18.69-.26 1.05 0l3.42 2.61l7.93-7.25c.32-.32.87-.45 1.5-.12l4 1.91c.36.21.7.54.7 1.15v13.5c0 .4-.29.83-.6 1l-4.4 2.1c-.32.13-.92.01-1.13-.2l-8.02-7.3l-3.4 2.6c-.38.26-.85.19-1.05 0l-1.2-1.1c-.32-.33-.28-.87.05-1.2l3-2.7"/></svg>
    <span class="home-editor-name">Visual Studio Code</span>
    <span class="home-editor-more">Get extension →</span>
  </a>
  <a class="home-editor-card" href="https://github.com/rux-lang/Zed" target="_blank" rel="noopener">
    <svg class="home-editor-icon" width="40" height="40" viewBox="0 0 90 90" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M8.4375 5.625C6.8842 5.625 5.625 6.8842 5.625 8.4375V70.3125H0V8.4375C0 3.7776 3.7776 0 8.4375 0H83.7925C87.551 0 89.4333 4.5442 86.7756 7.20186L40.3642 53.6133H53.4375V47.8125H59.0625V55.0195C59.0625 57.3495 57.1737 59.2383 54.8438 59.2383H34.7392L25.0712 68.9062H68.9062V33.75H74.5312V68.9062C74.5312 72.0128 72.0128 74.5312 68.9062 74.5312H19.4462L9.60248 84.375H81.5625C83.1158 84.375 84.375 83.1158 84.375 81.5625V19.6875H90V81.5625C90 86.2224 86.2224 90 81.5625 90H6.20749C2.44898 90 0.566723 85.4558 3.22438 82.7981L49.46 36.5625H36.5625V42.1875H30.9375V35.1562C30.9375 32.8263 32.8263 30.9375 35.1562 30.9375H55.085L64.9288 21.0938H21.0938V56.25H15.4688V21.0938C15.4688 17.9871 17.9871 15.4688 21.0938 15.4688H70.5538L80.3975 5.625H8.4375Z"/></svg>
    <span class="home-editor-name">Zed</span>
    <span class="home-editor-more">Get extension →</span>
  </a>
  <a class="home-editor-card" href="https://packagecontrol.io/packages/Rux" target="_blank" rel="noopener">
    <svg class="home-editor-icon" xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24"><path d="M20.953.004a.4.4 0 0 0-.18.017L3.225 5.585c-.175.055-.323.214-.402.398a.4.4 0 0 0-.06.22v5.726a.4.4 0 0 0 .06.22c.079.183.227.341.402.397l7.454 2.364l-7.454 2.363c-.255.08-.463.374-.463.655v5.688c0 .282.208.444.463.363l17.55-5.565c.237-.075.426-.336.452-.6c.003-.022.013-.04.013-.065V12.06c0-.281-.208-.575-.463-.656L13.4 9.065l7.375-2.339c.255-.08.462-.375.462-.656V.384c0-.211-.117-.355-.283-.38z"/></svg>
    <span class="home-editor-name">Sublime Text</span>
    <span class="home-editor-more">Get package →</span>
  </a>
</div>

## Sponsors

<p class="home-lead">Rux is free, open source, and developed independently. You could be the first.</p>

<div class="home-sponsors">
  <a class="home-sponsor-slot" href="/support">Your logo here</a>
  <a class="home-sponsor-slot home-sponsor-slot-heart" href="/support" aria-label="Become a sponsor">💜</a>
  <a class="home-sponsor-slot" href="/support">Your logo here</a>
</div>

<div class="home-sponsors-action">
  <a class="home-sponsors-btn" href="/support">Become a Sponsor</a>
</div>

## From the Blog

<div class="home-blog">
  <a class="home-blog-card" href="/blog/release-v0.3.0">
    <span class="home-blog-date">June 23, 2026</span>
    <span class="home-blog-title">Rux 0.3.0 — Laying the Cross-Platform Groundwork</span>
    <span class="home-blog-more">Read post →</span>
  </a>
  <a class="home-blog-card" href="/blog/language-without-llvm">
    <span class="home-blog-date">June 1, 2026</span>
    <span class="home-blog-title">Programming Language Without LLVM</span>
    <span class="home-blog-more">Read post →</span>
  </a>
  <a class="home-blog-card" href="/blog/release-v0.2.0">
    <span class="home-blog-date">May 10, 2026</span>
    <span class="home-blog-title">Rux 0.2.0 — A Real Language, Allegedly</span>
    <span class="home-blog-more">Read post →</span>
  </a>
  <a class="home-blog-card" href="/blog/release-v0.1.0">
    <span class="home-blog-date">April 30, 2026</span>
    <span class="home-blog-title">Rux 0.1.0 — 🎉 It Compiles!</span>
    <span class="home-blog-more">Read post →</span>
  </a>
</div>
