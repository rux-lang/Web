---
sidebar: false
prev: false
next: false
---

# FAQ

## What is Rux?

Rux is a fast, compiled, strongly typed, multi-paradigm, general-purpose programming language designed for clarity, safety, and performance. It compiles to native machine code and targets systems programming use cases.

## What is the current status of Rux?

Rux is in early development. The latest release is **v0.2.0**, which added control flow, slices, tuples, enums, interfaces, modules, and packages. The language is under active development and new features are added with each release.

## What platforms does Rux support?

Currently Rux targets **Windows x86-64**. The compiler produces native `.exe` binaries linked against the Windows x64 ABI. Support for additional platforms is planned for future releases.

## How do I install Rux?

On Windows, the easiest way is via [Scoop](https://scoop.sh):

```sh
scoop bucket add rux-lang https://github.com/rux-lang/Scoop
scoop install rux
```

Full instructions: [Installation on Windows](/tutorials/install/windows).

## What language is Rux written in?

The Rux compiler is written in C++.

## Does Rux use LLVM?

No. Rux has its own frontend (lexer, parser, semantic analysis) and backend (HIR, LIR, x86-64 assembler, linker). It does not depend on LLVM or any external compiler infrastructure.

## What is the entry point of a Rux program?

Every executable package must define a `Main` function with no parameters that returns an integer:

```rux
func Main() -> int {
    return 0;
}
```

## What is the difference between `let` and `var`?

`let` declares an immutable binding — it cannot be reassigned after initialization. `var` declares a mutable variable that can be reassigned:

```rux
let x = 10;   // immutable
var y = 10;   // mutable
y = 20;       // OK
```

## Does Rux have a garbage collector?

No. Rux compiles to native machine code with no hidden runtime overhead. Memory management is explicit, similar to C and C++.

## Does Rux have exceptions?

No. Rux uses explicit error handling through return-type encoding with a `Result` type. Errors are values that must be handled at the call site — the compiler does not unwind the stack automatically.

## Can I call C/C++ functions from Rux?

Yes. The `extern` keyword declares functions defined outside Rux, typically in C libraries or the Windows API:

```rux
extern func malloc(size: uint) -> *opaque;
extern func free(ptr: *opaque);
```

See [Foreign Function Interface](/docs/extern) for the full syntax.

## Is there a standard library?

The official standard library is under development at [github.com/rux-lang/Std](https://github.com/rux-lang/Std). Windows API bindings are being developed separately at [github.com/rux-lang/Windows](https://github.com/rux-lang/Windows).

## Does Rux have a package manager?

Yes, it is built into the `rux` CLI. Use `rux add` to add a dependency to your project and `rux install` to download it. Packages are resolved from the official registry at [github.com/rux-lang/Registry](https://github.com/rux-lang/Registry).

## Which editors are supported?

- **Visual Studio Code** — via the [Rux Language](https://marketplace.visualstudio.com/items?itemName=rux-lang.vscode-rux) extension (recommended)
- **Sublime Text** — via the [Rux](https://packagecontrol.io/packages/Rux) package on Package Control

Both extensions provide syntax highlighting for `.rux` source files.

## What object file format does the Rux compiler produce?

The compiler emits `.rcu` files — **Rux Compiled Units**. This is a custom binary object file format specific to Rux, designed to be simple and fast to parse. The Rux linker collects `.rcu` files and links them into a Windows PE executable. See [Rux Compiled Unit](/docs/appendix/rcu) for the full specification.

## Under which license is Rux published?

Rux is licensed under the [MIT License](https://github.com/rux-lang/Rux/blob/main/LICENSE).
