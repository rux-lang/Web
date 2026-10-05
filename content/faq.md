---
title: Frequently Asked Questions
description: Answers to common questions about Rux — what it is, supported platforms, installation, projects, the compiler, error handling, memory, FFI, the standard packages, the package manager, and more.
seo:
  title: FAQ
  description: Answers to common questions about Rux — what it is, supported platforms, installation, projects, the compiler, error handling, memory, FFI, the standard packages, the package manager, and more.
  ogImage: https://rux-lang.dev/images/og-faq.png
  ogType: website
  ogUrl: https://rux-lang.dev/faq
---

# Frequently Asked Questions

## What is Rux?

Rux is a compiled, strongly typed, multi-paradigm programming language. It compiles directly to native machine code and is designed for systems programming, command-line tools, libraries, and other performance-sensitive software.

## What is the current status of Rux?

Rux is experimental and under active development. The current release is **v0.4.0**.

Version 0.4.0 is the release where the language took its present shape:

- **Native outcome types** — optionals `T?`, fallibles `T ! E` and sums `A | B`, with `none`, `fail`, `?`, `??` and `catch` built into the language.
- **Ownership** — explicit moves with `<-`, references `&T` and `&var T`, destructors and deterministic cleanup, and `defer`.
- **Separate `enum` and `variant` declarations** — scalar enumerations and tagged unions with data.
- **Compile-time programming** — `when` conditional compilation, `intrinsic` declarations, and the `#target`, `#build`, `#compiler`, `#config` and `#source` context.
- **Tooling** — cross-target builds for every supported platform, a versioned `Rux.toml` manifest, registry install and publish, and HTML documentation from `rux doc`.

Language features and tooling may still change between releases. See the [release history](https://github.com/rux-lang/Rux/blob/dev/CHANGELOG.md) and [GitHub releases](https://github.com/rux-lang/Rux/releases) for details.

## How do I learn Rux?

Start with [Learn Rux](/docs/learn), a free course of 231 short lessons in 25 parts, from installing the compiler to complete programs. Every lesson is a runnable package in the [Examples repository](https://github.com/rux-lang/Examples). The [Rux Reference](/docs/lang) is the precise description of the language for when you need every rule.

You can also try Rux without installing anything in the [Playground](/play), which compiles and runs a program in your browser.

## Which platforms are supported?

Rux supports exactly eight targets: FreeBSD, Linux, macOS and Windows, each on x86-64 and AArch64. The compiler is built and tested on all of them, and prebuilt releases are published for each. Any other target is rejected by name.

## Does Rux support cross-compilation?

Yes. Every target-aware command accepts `--target`, and the compiler produces machine code, object files and the final executable in-process for all eight targets — no external toolchain is involved:

```sh
rux build --target linux-aarch64
rux build --all
```

`rux build --all` builds every target in both Debug and Release. A program can only be _run_ on a matching machine, so `rux run` always builds for the host. Code that differs per platform is selected with [conditional compilation](/docs/lang/comptime/conditional): `when #target.os == .Windows { ... }`.

## How do I install Rux?

FreeBSD, Linux, macOS and Windows ship prebuilt binaries for x86-64 and AArch64 — see the [Download](/download) page for the archives, the Windows installer, and the `SHA256SUMS` checksums.

On Windows, the PowerShell installer picks the right architecture:

```powershell
irm https://rux-lang.dev/install.ps1 | iex
```

The official Scoop bucket and the `rux-windows.msi` installer are also available, but currently install the x86-64 build only:

```sh
scoop bucket add rux-lang https://github.com/rux-lang/Scoop
scoop install rux
```

On Linux, install with the one-line script or the prebuilt tarball — see the [Linux install guide](/docs/learn/install/linux):

```sh
curl -fsSL https://rux-lang.dev/install.sh | sh
```

You can also [build the compiler from source](/docs/learn/build) with upstream Clang 23.1 or newer, CMake and Ninja.

## How do I create and run a project?

The `rux` executable contains the compiler and project tooling:

```sh
rux new Hello
cd Hello
rux run
```

A package contains a `Rux.toml` manifest and source files under `Src/`. See [Directory Layout](/docs/packaging/layout) and the [CLI Reference](/docs/cli) for the available commands, or follow [Your first project](/docs/learn/first-project).

## What language is the compiler written in?

The Rux compiler is written in C++26 and builds with upstream Clang 23.1 or newer, CMake and Ninja.

## Does Rux use LLVM?

No. Rux implements its own compilation pipeline:

1. Lexer and parser
2. Semantic analysis
3. High-level intermediate representation (HIR)
4. Low-level intermediate representation (LIR)
5. x86-64 and AArch64 machine-code generation
6. Rux Compiled Unit emission
7. Native linking to PE, ELF or Mach-O

The compiler does not depend on LLVM, an assembler, a C compiler or an external linker to produce Rux executables.

## What is the entry point of an executable?

An executable package must define a function named `Main`. The usual signature takes no parameters and returns `int`, which becomes the process exit status:

```rux
func Main() -> int {
    return 0;
}
```

`Main` may also be fallible — `func Main() -> ! E` or `func Main() -> int ! E` — and a failure ends the program with exit status 1. See [The Main function](/docs/lang/functions/main). Library packages have no entry point; a Windows DLL may optionally define `DllMain`.

## What is the difference between `let` and `var`?

`let` creates an immutable binding. `var` creates a mutable binding:

```rux
let name = "Rux";

var count = 1;
count += 1;
```

Reassigning a `let` binding is a compile-time error. See [Bindings](/docs/lang/bindings/overview).

## Does Rux have a garbage collector?

No. Generated programs include no garbage collector and no virtual machine. Memory and other resources are managed by ownership: a value is copied with `=` or moved with `<-`, borrowed through references `&T` and `&var T`, and destroyed deterministically when its owner goes out of scope, running its destructor. `defer` schedules cleanup at the end of a function. Heap memory comes from allocators in the `Allocator` package, and raw pointers remain available for low-level work. See [Ownership](/docs/lang/ownership/overview).

## Does Rux have exceptions?

No. Errors are values. A function that can fail returns a fallible type `T ! E`, fails with `fail`, and its caller must deal with the outcome — by matching it, recovering with `catch`, or passing the failure on with `?`. Ignoring a fallible result is a compile-time error. A value that may simply be absent is an optional `T?` instead.

Bugs that should never happen stop the program with `Panic` or a failed `Assert`; there is no stack unwinding. See [Errors](/docs/lang/errors/overview) and [Optionals](/docs/lang/optionals/overview).

## Can Rux call native functions?

Yes. `extern` declarations describe functions and variables supplied by the operating system or a native library, and `#Link` names the library the loader resolves them from:

```rux
#Link("Kernel32.dll")
extern func GetStdHandle(handle: uint32) -> *opaque;
```

Library names differ per system, so guard the declarations with [conditional compilation](/docs/lang/comptime/conditional) rather than declaring them unconditionally. See the [Foreign Function Interface](/docs/lang/ffi/overview).

## Can Rux build libraries?

Yes. A package is one of four kinds, chosen when it is created:

```sh
rux new App --executable
rux new Plugin --shared
rux new Utility --static
rux new Json --source
```

`SharedLibrary` emits a DLL plus import library on Windows, an `.so` on ELF targets, or a `.dylib` on macOS. `StaticLibrary` emits a `.lib` on Windows or `.a` elsewhere. A `SourceLibrary` is compiled into each program that uses it and cannot be built on its own. In 0.4.0 only source libraries can be published to the registry; shared and static libraries are local artifacts. See [Package types](/docs/packaging/types).

## Is there a standard library?

Not a monolithic one. Rux has no built-in runtime — the standard library is a set of packages, and a program depends only on the ones it lists in `Rux.toml`.

The portable layer is what you should reach for first: [`Core`](/docs/api/core), [`C`](/docs/api/c), [`Format`](/docs/api/format), [`Io`](/docs/api/io), [`Math`](/docs/api/math), [`Memory`](/docs/api/memory) and [`Text`](/docs/api/text), together with `Algorithms`, `Allocator`, `Collections`, `Crypto`, `Entropy`, `FileSystem`, `Hash`, `Json`, `Path`, `Random`, `Time`, `Toml`, `Unicode` and `Uuid`. Below it, the platform layer declares one operating system's own entry points: [`FreeBSD`](/docs/api/bsd), [`Linux`](/docs/api/linux), [`macOS`](/docs/api/macos) and [`Windows`](/docs/api/windows).

These packages are developed alongside the compiler in the [`rux-lang/Rux`](https://github.com/rux-lang/Rux/tree/dev/Packages) repository. None of them has a stable API yet — names, signatures and behaviour may change between releases. See the [API Reference](/docs/api), and the course's [standard-library parts](/docs/learn/algorithms) for guided tours.

## Does Rux include a package manager?

Yes. Package management is integrated into the `rux` CLI:

```sh
rux add Namespace/Package
rux install
rux list
rux update
rux remove Package
rux uninstall
```

Registry packages are indexed by the official registry at [`rux-lang.dev/packages`](/packages), and local path dependencies are also supported. A manifest declares a single `[Dependencies]` table — platform selection belongs in source, with [conditional compilation](/docs/lang/comptime/conditional). The standard packages are declared by hand, for example `Io = { Namespace = "Rux", Version = "*" }`. See [Packaging](/docs/packaging) for the whole subject.

## How do I publish a package?

Give a source-library package a [namespace](/docs/packaging/namespaces) you own and a `MinRux` version of at least 0.4.0, sign in with [`rux login`](/docs/cli/login) or create an [API token](/docs/packaging/tokens) with the `publish` scope, then:

```sh
rux publish --dry-run
rux publish
```

Published versions are immutable — a mistake is fixed by publishing a new version and [yanking](/docs/packaging/yanking) the old one. See [Publishing](/docs/packaging/publishing) for the full walkthrough.

## What other commands does the CLI provide?

The CLI includes commands for creating, initialising, building, checking, running, testing, cleaning, formatting, linting, documenting and packing packages. [`rux doc`](/docs/cli/doc) generates self-contained HTML API documentation from `///` comments. Use:

```sh
rux help
rux help build
```

See the [CLI Reference](/docs/cli) and the help output of your installed version.

## Which editors support Rux?

Syntax support is available for:

- [Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=rux-lang.vscode-rux)
- [Sublime Text](https://packagecontrol.io/packages/Rux)
- [Zed](https://github.com/rux-lang/Zed)

Editor integrations are developed independently from the compiler, so feature coverage varies. Setup guides are in [Learn Rux](/docs/learn/editors/vscode).

## What is an RCU file?

An `.rcu` file is a **Rux Compiled Unit**, the compiler's native object format. It stores machine code, data, symbols and relocations before the Rux linker combines units into a platform executable or library.

See the [Rux Compiled Unit specification](/docs/lang/appendix/rcu).

## Is Rux open source?

Yes. The compiler is published under the [MIT License](https://github.com/rux-lang/Rux/blob/main/LICENSE.md). Development happens in the open at [`github.com/rux-lang/Rux`](https://github.com/rux-lang/Rux).

## How can I contribute?

Read the [contribution guide](https://github.com/rux-lang/Rux/blob/dev/CONTRIBUTING.md), build the `dev` branch, run the test suite, and open an issue or pull request. Compiler, documentation, package, and editor contributions are all maintained through the [Rux GitHub organization](https://github.com/rux-lang). The [Code of Conduct](/code-of-conduct) applies everywhere the community gathers.

## How do I report a bug or a security problem?

Bugs go to the [issue tracker](https://github.com/rux-lang/Rux/issues/new?template=bug_report.yml) with a minimal reproducer. Feature ideas start in [Discussions](https://github.com/rux-lang/Rux/discussions).

Security vulnerabilities are reported **privately** — follow the [security policy](/security) rather than opening a public issue. The [support page](/support) lists all three routes.

## What data does the website collect?

The documentation site uses [Umami](https://umami.is), a cookieless analytics script that counts page views without identifying you or tracking you across sites. There is no advertising. The only personal data held is what a registry account needs, and it comes from GitHub. The [Privacy Policy](/privacy) has the details.
