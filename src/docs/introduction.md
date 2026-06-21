# Introduction

Rux is a **fast, compiled, strongly typed, and multi-paradigm** programming language designed for clarity, safety, and performance. It combines expressive high-level constructs with predictable low-level control, so the same language scales from command-line tools and libraries to applications and services.

Rux is in early development. The work happens in the open across several [GitHub repositories](https://github.com/rux-lang) — compiler, website and documentation, package manager, and code-editor support — all released under the permissive [MIT license](https://github.com/rux-lang/Rux/blob/main/LICENSE). The language is actively evolving and improving with every release.

::: warning
Please note that Rux is still in active development. As the language matures, some syntax and features may evolve, so the documentation may change over time.
:::


## Design Goals

- **Performance** — Rux compiles to native machine code with no hidden runtime overhead.
- **Safety** — A strong static type system catches errors at compile time.
- **Clarity** — Syntax is regular and readable; the language avoids implicit surprises.
- **Multi-paradigm** — Rux supports procedural, object-oriented, and functional styles.
- **Ergonomic tooling** — A single `rux` binary handles compilation, packaging, formatting, and more.

These goals rest on a few guiding principles: performance matters, developer experience matters, readable code scales, tooling should be first-class, and simplicity beats unnecessary complexity.

## Hello, World

```rux
import Std::Io::Print;

func Main() -> int {
    Print("Hello, World!");
    return 0;
}
```

`Main` is the [entry point](/docs/functions/main) of every executable, and `import` brings `Print` from the standard library's `Std::Io` module into scope.

## Where to Go Next

- **New to Rux?** Follow the [Get Started guide](/start/) or try it in the browser on the [Playground](/playground) — nothing to install.
- **Looking something up?** This reference is organized bottom-up: [lexical structure](/docs/lexical/sources), [primitive types](/docs/signed/int), [variables](/docs/variables/overview) and [statements](/docs/statements/overview), then [functions](/docs/functions/overview), [user-defined types](/docs/structs/overview), [modules](/docs/modules/overview), and the [package system](/docs/packages/types).
- **Calling native code?** See the [Foreign Function Interface](/docs/ffi/overview) and the [attributes](/docs/attributes/overview) that control linking and targets.
- **Want to contribute?** Bug reports, feature requests, documentation improvements, and pull requests are all welcome across the [project's repositories](https://github.com/rux-lang).
