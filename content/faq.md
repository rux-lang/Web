---
title: Frequently Asked Questions
description: Answers to common questions about Rux — what it is, supported platforms, installation, projects, the compiler, FFI, the standard library, the package manager, and more.
seo:
  title: FAQ
  description: Answers to common questions about Rux — what it is, supported platforms, installation, projects, the compiler, FFI, the standard library, the package manager, and more.
  ogImage: https://rux-lang.dev/images/og-faq.jpg
  ogType: website
  ogUrl: https://rux-lang.dev/faq
---

# Frequently Asked Questions

## What is Rux?

Rux is a compiled, strongly typed, multi-paradigm programming language. It compiles directly to native machine code and is being designed for systems programming, command-line tools, libraries, and other performance-sensitive software.

## What is the current status of Rux?

Rux is experimental and under active development. The latest stable release is **v0.4.0**.

Version 0.4.0 added compile-time programming — `when` conditional compilation, `intrinsic` declarations, and the `#`-prefixed compiler context — along with native AArch64 host support on every tested platform, an explicit `let`/`var` mutability model, inline assembly functions, and the System V AMD64 calling convention on Linux. It also removed `#{...}` metadata blocks and the `$`-sigil compiler parameters, so code written against v0.3.0 needs updating. Language features and tooling may still change between releases.

See the [release history](https://github.com/rux-lang/Rux/blob/dev/CHANGELOG.md) and [GitHub releases](https://github.com/rux-lang/Rux/releases) for details.

## Which platforms are supported?

The compiler is built and continuously tested on both x86-64 and AArch64 for: FreeBSD, Linux, macOS, and Windows. Other hosts are supported by [building from source](/start/build), without prebuilt binaries or continuous testing.

## Does Rux support cross-compilation?

Not yet. The current compiler primarily builds native programs for its host platform. Target-specific declarations can be selected with [conditional compilation](/docs/comptime/conditional) — `when #target.os == .Windows { ... }`.

## How do I install Rux?

FreeBSD, Linux, macOS, and Windows ship prebuilt binaries for x86-64 and
AArch64 — see the [Download](/download) page for the archives, the Windows
installer, and the `SHA256SUMS` checksums.

On Windows, you can also install through the official Scoop bucket:

```sh
scoop bucket add rux-lang https://github.com/rux-lang/Scoop
scoop install rux
```

On Linux, install with the one-line script or the prebuilt tarball — see the
[Linux install guide](/start/install/linux):

```sh
curl -fsSL https://rux-lang.dev/install.sh | sh
```

On any other platform, [build the compiler from source](/start/build) with
CMake and a C++26-capable compiler.

## How do I create and run a project?

The `rux` executable contains the compiler and project tooling:

```sh
rux new Hello
cd Hello
rux run
```

A package contains a `Rux.toml` manifest and source files under `Src/`. See
[Directory Layout](/packaging/layout) and the [CLI Reference](/cli) for the
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
5. x86-64 and AArch64 machine-code generation
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
operating system or a native library, and `#Link` names the library the
loader resolves them from:

```rux
#Link("Kernel32.dll")
extern func GetStdHandle(handle: uint32) -> *opaque;
```

Library names differ per system, so guard the declarations with
[conditional compilation](/docs/comptime/conditional) rather than declaring
them unconditionally. See the
[Foreign Function Interface](/docs/ffi/overview).

## Can Rux build libraries?

Rux packages can be initialized as executable or library packages:

```sh
rux new App --bin
rux new Utility --lib
```

Setting the package type to `Dll` in `Rux.toml` emits a Windows PE32+ DLL, with
an export directory and an optional `DllMain`. Shared-library output on other
platforms is still developing.

## Is there a standard library?

Not a monolithic one. Rux has no built-in runtime — everything is a package you
add to a project with [`rux add`](/cli/add), so a program depends only on what
it asks for.

The cross-platform layer is portable and is what you should reach for first:
[`Rux`](/api/rux), [`C`](/api/c), [`Format`](/api/format), [`Io`](/api/io),
[`Math`](/api/math), [`Memory`](/api/memory), and [`Text`](/api/text). Below it,
the platform layer declares one operating system's own entry points:
[`BSD`](/api/bsd), [`Linux`](/api/linux), [`MacOS`](/api/macos), and
[`Windows`](/api/windows).

These packages are developed alongside the compiler in the
[`rux-lang/Rux`](https://github.com/rux-lang/Rux) repository. None of them has a
stable API yet — names, signatures, and behavior may change between releases.
See the [API Reference](/api).

## Does Rux include a package manager?

Yes. Package management is integrated into the `rux` CLI. Common commands
include:

```sh
rux add Rux/Io
rux install
rux list
rux update
rux remove Io
rux uninstall
```

Registry packages are indexed by the official registry at
[`rux-lang.dev/packages`](/packages). Local path
dependencies are also supported. A manifest declares a single `[Dependencies]`
table — platform selection belongs in source, with
[conditional compilation](/docs/comptime/conditional), rather than in
target-specific dependency sections. See [Packaging](/packaging) for the whole
subject.

## How do I publish a package?

Give the package a [namespace](/packaging/namespaces) you own and a `MinRux`
version, create an [API token](/packaging/tokens) with the `publish` scope, then:

```sh
rux publish --dry-run
rux publish
```

Published versions are immutable — a mistake is fixed by publishing a new
version and [yanking](/packaging/yanking) the old one. See
[Publishing](/packaging/publishing) for the full walkthrough.

## What other commands does the CLI provide?

The CLI includes commands for creating, initializing, building, checking,
running, cleaning, formatting, and managing packages. Use:

```sh
rux help
rux help build
```

[`rux doc`](/cli/doc) is still a stub — it reads the manifest but does not generate documentation yet. Consult the [CLI Reference](/cli) and the help output of your installed version.

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

Yes. The compiler is published under the [MIT License](https://github.com/rux-lang/Rux/blob/main/LICENSE.md). Development happens in the open at [`github.com/rux-lang/Rux`](https://github.com/rux-lang/Rux).

## How can I contribute?

Read the [contribution guide](https://github.com/rux-lang/Rux/blob/dev/CONTRIBUTING.md), build the `dev` branch, run the test suite, and open an issue or pull request. Compiler, documentation, package, and editor contributions are all maintained through the [Rux GitHub organization](https://github.com/rux-lang). The [Code of Conduct](/code-of-conduct) applies everywhere the community gathers.

## How do I report a bug or a security problem?

Bugs go to the [issue tracker](https://github.com/rux-lang/Rux/issues/new?template=bug_report.yml) with a minimal reproducer. Feature ideas start in [Discussions](https://github.com/rux-lang/Rux/discussions).

Security vulnerabilities are reported **privately** — follow the [security policy](/security) rather than opening a public issue. The [support page](/support) lists all three routes.

## What data does the website collect?

The documentation site has no analytics, no tracking, and no third-party scripts. The only personal data held is what a registry account needs, and it comes from GitHub. The [Privacy Policy](/privacy) has the details.
