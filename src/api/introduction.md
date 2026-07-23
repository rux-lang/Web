# Introduction

This reference documents the packages that ship with Rux: what each function does, what it returns, and where its behavior differs from the platform underneath. It is a lookup reference rather than a tutorial — if you are new to the language, start with the [Get Started guide](/start/) or the [Rux Language Reference](/docs/).

Rux has no monolithic runtime. Everything below is a **package** you add to a project with [`rux add`](/cli/add), and a program depends only on what it asks for.

::: warning Unstable API
Every package here is under active development and none of them has a **stable API** yet. Names, signatures, and behavior may change between releases, and this documentation will be updated to match.
:::

## Two Layers

The packages come in two layers, and the one you should reach for first is the portable one.

**Cross-platform packages** are portable. The same call compiles on every supported target, and the package hides the platform underneath it — [`Alloc`](memory/alloc) is one function whether it becomes a Win32 heap call or an anonymous `mmap`. Write against these unless they do not expose what you need.

| Package             | Description                                                                            |
| ------------------- | -------------------------------------------------------------------------------------- |
| [`C`](c/)           | Thin bindings to the platform C standard library: math, I/O, general utilities, time.  |
| [`Format`](format/) | Values as text: a conversion for every primitive, and an interface for your own types. |
| [`Io`](io/)         | Standard input and output: print a value or a formatted line, and read a line back.    |
| [`Math`](math/)     | Constants and floating-point functions, for both `float64` and `float32`.              |
| [`Memory`](memory/) | Allocate, resize, and release raw blocks, and fill, copy, and compare their bytes.     |
| [`Rux`](rux/)       | The core language: primitive types, `Result`, `Slice`, ranges, and compiler intrinsics. |
| [`Text`](text/)     | Strings and fundamental text manipulation: an immutable string and a builder for one.  |

**Platform-dependent packages** are the layer below — thin, direct declarations of one operating system's own entry points, with no portability layer and no safety net. A program that calls them is a program for that platform. Reach for them when the cross-platform packages have no answer, and guard every call with [conditional compilation](/docs/comptime/conditional).

| Package               | Description                                               |
| --------------------- | --------------------------------------------------------- |
| [`BSD`](bsd/)         | Syscalls for the BSD family.                              |
| [`Linux`](linux/)     | Linux syscalls, invoked directly, without libc.           |
| [`MacOS`](macos/)     | BSD-layer syscalls for macOS.                             |
| [`Windows`](windows/) | Win32 bindings, imported from `kernel32.dll` and friends. |

## Installation

Every package is added and installed the same way. [`rux add`](/cli/add) records the dependency in the [package manifest](/docs/packages/manifest), and [`rux install`](/cli/install) fetches it:

```sh
rux add Math
rux install
```

Then import what you need. A whole module, a single symbol, or a list of them:

```rux
import Math;                    // Math::Sqrt(2.0)
import Math::Sqrt;              // Sqrt(2.0)
import Memory::{ Alloc, Free }; // Alloc(1024)
```

The examples throughout this reference use the third form and call functions unqualified — `Alloc(1024)` rather than `Memory::Alloc(1024)` — so that the call reads the way it will in your own code.

## Platform Support

FreeBSD, Linux, macOS, and Windows are supported. The cross-platform packages run on all four; the platform-specific packages each target one.

| Package               | FreeBSD | Linux | macOS | Windows |
| --------------------- | ------- | ----- | ----- | ------- |
| [`C`](c/)             | ✓       | ✓     | ✓     | ✓       |
| [`Format`](format/)   | ✓       | ✓     | ✓     | ✓       |
| [`Io`](io/)           | ✓       | ✓     | ✓     | ✓       |
| [`Math`](math/)       | ✓       | ✓     | ✓     | ✓       |
| [`Memory`](memory/)   | ✓       | ✓     | ✓     | ✓       |
| [`Rux`](rux/)         | ✓       | ✓     | ✓     | ✓       |
| [`Text`](text/)       | ✓       | ✓     | ✓     | ✓       |
| [`BSD`](bsd/)         | ✓       | —     | —     | —       |
| [`Linux`](linux/)     | —       | ✓     | —     | —       |
| [`MacOS`](macos/)     | —       | —     | ✓     | —       |
| [`Windows`](windows/) | —       | —     | —     | ✓       |

The platform-dependent packages each build on exactly one platform by design — a `—` means the package does not apply there, not that support is missing. [`Math`](math/) is portable everywhere for a simple reason: it is pure computation, with no platform-specific code in it at all, so it has nothing to port.

## Reading This Reference

Each package has an overview page listing everything it contains, and each function gets a page of its own with the same sections in the same order:

- **Signature** — the declaration, including every overload.
- **Parameters** — one row per argument.
- **Returns** — the result and its edge cases. Functions that return nothing have **Remarks** in this slot instead.
- **Example** — a short snippet, with the interesting values in trailing comments.
- **See also** — the neighboring functions worth knowing about.

Edge cases are where a reference earns its keep, so they are stated on the page rather than left to the reader: which argument a NaN loses to in [`Max`](math/max), why [`Compare`](memory/compare) reports equality as the length rather than as `0`, and which block survives when [`Realloc`](memory/realloc) fails.

## Where to Go Next

- **Looking for a function?** Start from a package overview — [`Format`](format/), [`Io`](io/), [`Math`](math/), [`Memory`](memory/), or [`Text`](text/) — each of which lists its full contents in one table.
- **Working close to the metal?** The platform-dependent packages mirror their operating systems closely: [`Linux`](linux/), [`MacOS`](macos/), and [`Windows`](windows/).
- **Writing platform-specific code?** See [Conditional Compilation](/docs/comptime/conditional) and the [Foreign Function Interface](/docs/ffi/overview).
- **Learning the language?** The [Rux Language Reference](/docs/) covers the syntax and the type system these packages are built on.
