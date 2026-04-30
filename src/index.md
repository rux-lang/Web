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
      link: /docs/
    - theme: alt
      text: Tutorials
      link: /tutorials/

# Features section
features:
  - icon:
      src: /icons/rocket.svg
    title: Compiled for Speed
    details: Rux compiles directly to native machine code using optimizations. No virtual machine, no interpreter, no runtime surprises — just raw performance. Rux generates binaries like C, C++, Rust, Zig.
  - icon:
      src: /icons/block.svg
    title: Strongly Typed
    details: No implicit conversions, no hidden boxing, no “maybe copy”. Rux’s type system ensures correctness without verbosity — similar to Rust’s safety, but with a cleaner syntax and simpler rules.
  - icon:
      src: /icons/shield.svg
    title: Safety Without Sacrifice
    details: Memory safety is built-in, not bolted on. Rux distinguishes references (&T) and pointers (*T) clearly, allowing both safe high-level code and low-level control. Unlike C++, you don’t need manual discipline.
  - icon:
      src: /icons/dna.svg
    title: Multi-Paradigm by Design
    details: Rux blends procedural, functional, and object-oriented paradigms seamlessly. You can write clean imperative code, use higher-order functions, or design modular, data-driven systems — all with zero runtime overhead.
  - icon:
      src: /icons/binary.svg
    title: Low-Level Control
    details: When you care about bytes and cycles, Rux gives you direct access. Explicit memory layout, fixed-width data types, and pointer arithmetic when needed. Like Zig or C, but with strong typing and clear mutability rules.
  - icon:
      src: /icons/code.svg
    title: Simple Syntax
    details: Rux’s syntax is minimal yet expressive — designed to read like pseudocode and compile like assembly. No clutter, no hidden conversions, no unnecessary ceremony. Readable, concise, and fully type-safe.
  - icon:
      src: /icons/fast.svg
    title: Fast Compilation and Tooling
    details: Nobody likes waiting on builds. Rux features an incremental compiler with near-instant rebuilds and dependency-free binaries. You get Go-like build speed with Rust-like optimization quality — the best of both worlds.
  - icon:
      src: /icons/platform.svg
    title: Cross-Platform
    details: Rux isn’t just for systems programming. It’s equally comfortable writing CLI tools, servers, games, or libraries. Compile to Windows, Linux, macOS, and more — all from the same clean source code.

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

## Examples

::: code-group

<<< @/examples/hello-world.rux [📦 Hello World]
<<< @/examples/factorial.rux [📦 Factorial]
<<< @/examples/functions.rux [📦 Functions]
<<< @/examples/integers.rux [📦 Integers]
<<< @/examples/floats.rux [📦 Floats]
<<< @/examples/booleans.rux [📦 Booleans]
<<< @/examples/characters.rux [📦 Characters]

:::

### Control Mutability

```rux
var value: int = 10;
let value: int = 20;
const value: int = 30;
```

### Raw pointers 🤯

```rux
var ptr: *int32 = null;
var ptr: *const int32 = null;
var value: float64 = 3.14;
const ptr: *float = @value;
const ptr: *const int32;
var data: **int64;
```

### Module System

```rux
// Import from modules
import Math;
import Math::*;
import Math::Sin;
import Math::{ Sin, Cos };
import Math::Sin as Sinf;
```

## Community

Subscribe on [X](https://x.com/ruxlang), [Bluesky](https://bsky.app/profile/ruxlang.bsky.social), [Mastodon](https://mastodon.social/@ruxlang), or [Telegram](https://t.me/ruxlang) to get early updates, dev logs, and sneak peeks. Join the conversation on [Discord](https://discord.com/invite/uvSHjtZSVG), [GitHub Discussions](https://github.com/rux-lang/rux/discussions), or [Reddit](https://www.reddit.com/r/ruxlang). We’d love to hear from you! Not sure where to ask your question or how to get involved? Our community team is here to give you the right answer and help you get started [info@rux-lang.dev](mailto:info@rux-lang.dev).

## Project Status

Rux compiler, documentation, and this site are under construction 🏗️.
