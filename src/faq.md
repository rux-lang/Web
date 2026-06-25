---
title: Frequently Asked Questions
description: Answers to common questions about Rux — what it is, supported platforms, installation, projects, the compiler, FFI, the standard library, the package manager, and more.
sidebar: false
prev: false
next: false
head:
  - - meta
    - itemprop: name
      content: Rux Frequently Asked Questions
  - - meta
    - itemprop: description
      content: Answers to common questions about Rux — what it is, supported platforms, installation, projects, the compiler, FFI, the standard library, the package manager, and more.
  - - meta
    - itemprop: image
      content: https://rux-lang.dev/images/og-faq.jpg
  - - meta
    - property: og:url
      content: https://rux-lang.dev/faq
  - - meta
    - property: og:type
      content: website
  - - meta
    - property: og:title
      content: Rux Frequently Asked Questions
  - - meta
    - property: og:description
      content: Answers to common questions about Rux — what it is, supported platforms, installation, projects, the compiler, FFI, the standard library, the package manager, and more.
  - - meta
    - property: og:image
      content: https://rux-lang.dev/images/og-faq.jpg
  - - meta
    - name: twitter:card
      content: summary_large_image
  - - meta
    - name: twitter:title
      content: Rux Frequently Asked Questions
  - - meta
    - name: twitter:description
      content: Answers to common questions about Rux — what it is, supported platforms, installation, projects, the compiler, FFI, the standard library, the package manager, and more.
  - - meta
    - name: twitter:image
      content: https://rux-lang.dev/images/og-faq.jpg
---

# Frequently Asked Questions

## What is Rux?

Rux is a compiled, strongly typed, multi-paradigm programming language. It compiles directly to native machine code and is being designed for systems programming, command-line tools, libraries, and other performance-sensitive software.

## What is the current status of Rux?

Rux is experimental and under active development. The latest stable release is **v0.3.0**, released on June 23, 2026.

Version 0.3.0 added broader platform support, target-specific compilation attributes, Unicode escapes, a macOS linker backend, Windows DLL output, new package-manager commands, and compiler fixes. Language features and tooling may still change between releases.

See the [release history](https://github.com/rux-lang/Rux/blob/dev/CHANGELOG.md) and [GitHub releases](https://github.com/rux-lang/Rux/releases) for details.

## Which platforms are supported?

The compiler is continuously tested on:

- Linux x64
- Windows x64

## Does Rux support cross-compilation?

Not yet. The current compiler primarily builds native programs for its host platform. Target-specific declarations and dependencies can be selected with [`@[Target(...)]`](/docs/attributes/target) and target sections in `Rux.toml`.

## How do I install Rux?

Windows and Linux ship prebuilt binaries — see the [Download](/download) page for installers and archives.

On Windows, you can also install through the official Scoop bucket:

```sh
scoop bucket add rux-lang https://github.com/rux-lang/Scoop
scoop install rux
```

On Linux, install with the one-line script, your distribution's package manager
(Arch, Fedora-based distributions, and openSUSE), or the prebuilt tarball — see
the [Linux install guide](/start/install/linux):

```sh
curl -fsSL https://rux-lang.dev/install.sh | sh
```

macOS, BSD, and illumos do not have prebuilt packages yet; on those platforms
[build the compiler from source](/start/build) with CMake and a C++26-capable
compiler.

## How do I create and run a project?

The `rux` executable contains the compiler and project tooling:

```sh
rux new Hello
cd Hello
rux run
```

A package contains a `Rux.toml` manifest and source files under `Src/`. See
[Directory Layout](/docs/packages/dirs) and the [CLI Reference](/cli/) for the
available commands.

## What language is the compiler written in?

The Rux compiler is written in modern C++ and built with CMake. The current
source requires a C++26-capable compiler.

## Does Rux use LLVM?

No. Rux implements its own compilation pipeline:

1. Lexer and parser
2. Semantic analysis
3. High-level intermediate representation (HIR)
4. Low-level intermediate representation (LIR)
5. x86-64 machine-code generation
6. Rux Compiled Unit emission
7. Native linking

The compiler does not depend on LLVM or an external system linker to produce
normal Rux executables.

## What is the entry point of an executable?

An executable package must define a function named `Main`. The conventional
signature takes no parameters and returns `int`:

```rux
func Main() -> int {
    return 0;
}
```

The returned integer becomes the process exit code. Library and Windows DLL
packages do not use the normal executable entry point; a Windows DLL may
optionally define `DllMain`.

## What is the difference between `let` and `var`?

`let` creates an immutable binding. `var` creates a mutable binding:

```rux
let name = "Rux";

var count = 1;
count += 1;
```

Reassigning a `let` binding is a compile-time error. See
[Variables](/docs/variables/overview).

## Does Rux have a garbage collector?

No. Generated programs do not include a garbage collector or virtual machine.
Rux exposes low-level pointers and foreign-function interfaces for explicit
resource management.

Higher-level ownership and resource-management facilities are still evolving,
so memory-intensive application development should be considered
experimental.

## Does Rux have exceptions?

Rux does not currently implement stack-unwinding exceptions. Error handling is
explicit and remains an evolving part of the language and standard library.

See [Error Handling](/docs/error/overview) for the current documented approach.

## Can Rux call native functions?

Yes. `extern` declarations describe functions and variables supplied by the
operating system or a native library:

```rux
extern func GetStdHandle(handle: int) -> int;
```

Windows supports imported DLL symbols. Native external-symbol support on the
ELF and Mach-O backends is currently more limited. See the
[Foreign Function Interface](/docs/ffi/overview).

## Can Rux build libraries?

Rux packages can be initialized as executable or library packages:

```sh
rux new App --bin
rux new Utility --lib
```

Version 0.3.0 also supports Windows PE32+ DLL output by setting the package type
to `Dll` in `Rux.toml`. Shared-library support on other platforms is still
developing.

## Is there a standard library?

The standard library is developed separately in the
[`rux-lang/Std`](https://github.com/rux-lang/Std) repository.

Platform packages are also maintained separately, including [`rux-lang/BSD`](https://github.com/rux-lang/BSD), [`rux-lang/Illumos`](https://github.com/rux-lang/Illumos), [`rux-lang/Linux`](https://github.com/rux-lang/Linux), [`rux-lang/MacOS`](https://github.com/rux-lang/MacOS), and [`rux-lang/Windows`](https://github.com/rux-lang/Windows).

These libraries are early-stage and do not yet provide the breadth or stability
of a mature standard library.

## Does Rux include a package manager?

Yes. Package management is integrated into the `rux` CLI. Common commands
include:

```sh
rux add Std
rux install
rux list
rux update
rux remove Std
```

Registry packages are indexed by the official registry at
[`rux-lang.dev/packages`](https://rux-lang.dev/packages). Local path and
target-specific dependencies are also supported. See the
[Package System](/docs/packages/manifest).

## What other commands does the CLI provide?

The CLI includes commands for creating, initializing, building, checking,
running, cleaning, formatting, and managing packages. Use:

```sh
rux help
rux help build
```

Some newer command surfaces, including parts of documentation generation and test execution, are still under implementation. Consult the [CLI Reference](/cli/) and the help output of your installed version.

## Which editors support Rux?

Syntax support is available for:

- [Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=rux-lang.vscode-rux)
- [Sublime Text](https://packagecontrol.io/packages/Rux)
- [Zed](https://github.com/rux-lang/Zed)

Editor integrations are developed independently from the compiler, so feature coverage varies.

## What is an RCU file?

An `.rcu` file is a **Rux Compiled Unit**, the compiler's native object format. It stores machine code, data, symbols, and relocations before the Rux linker combines units into a platform executable or library.

See the [Rux Compiled Unit specification](/docs/appendix/rcu).

## Is Rux open source?

Yes. The compiler is published under the [MIT License](https://github.com/rux-lang/Rux/blob/main/LICENSE). Development happens in the open at [`github.com/rux-lang/Rux`](https://github.com/rux-lang/Rux).

## How can I contribute?

Read the [contribution guide](https://github.com/rux-lang/Rux/blob/dev/CONTRIBUTING.md), build the `dev` branch, run the test suite, and open an issue or pull request. Compiler, documentation, package, and editor contributions are all maintained through the [Rux GitHub organization](https://github.com/rux-lang).
