# Introduction

Rux is a **fast, compiled, strongly typed, multi-paradigm, general-purpose** programming language designed for clarity, safety, and performance. It combines expressive high-level constructs with predictable low-level control. It’s still in early development, with multiple GitHub repositories exploring different projects: compiler, website, docs, blog, package manager, code editor support. The project is released under the [MIT license](https://github.com/rux-lang/Rux/blob/main/LICENSE), making it open-source and permissive for contribution.

## Design Goals

- **Performance** — Rux compiles to native machine code with no hidden runtime overhead.
- **Safety** — A strong static type system catches errors at compile time.
- **Clarity** — Syntax is regular and readable; the language avoids implicit surprises.
- **Multi-paradigm** — Rux supports procedural, object-oriented, and functional styles.
- **Ergonomic tooling** — A single `rux` binary handles compilation, packaging, formatting, and more.

## Hello, World

```rux
func Main() -> int32 {
    Print("Hello, World!");
    return 0;
}
```
