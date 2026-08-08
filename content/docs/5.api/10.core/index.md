---
navigation:
  title: Overview
---

# Core Package

::warning
**Unstable API**\
The package is under active development and its API is **not yet stable**. Names, signatures, and behavior may change between releases, and this documentation will be updated to match.
::

The core language package: the fundamental types and the compiler intrinsics every program can rely on.

**Package:** `Core`

**Source:** [github.com/rux-lang/Rux/tree/main/Packages/Core](https://github.com/rux-lang/Rux/tree/main/Packages/Core)

`Core` is the root of the package graph — every other package depends on it. It defines the primitive types, the fundamental generic types ([`Result`](/docs/api/core/result), [`Slice`](/docs/api/core/slice), the [ranges](/docs/api/core/ranges)), and the compiler intrinsics for diagnostics and for reading the build, compiler, target, and source context at compile time. Its symbols are available without an explicit dependency line.

## Installation

`Core` is an implicit dependency of every package, so it needs no `rux add`. Import the symbols you use:

```rux
import Core::{ Result, Slice };
import Core::{ #target, #Error };
```

## Types

| Type                              | Description                                      |
| --------------------------------- | ------------------------------------------------ |
| [`Result`](/docs/api/core/result) | The return type of an operation that can fail.   |
| [`Slice`](/docs/api/core/slice)   | A view over a contiguous sequence of elements.   |
| [`Ranges`](/docs/api/core/ranges) | The range types produced by the range operators. |

The package also defines the primitive types — the [signed](/docs/lang/signed/int) and [unsigned](/docs/lang/unsigned/uint) integers, [floating-point](/docs/lang/floating/float), [boolean](/docs/lang/boolean/bool), and [character](/docs/lang/character/char) families — which are covered in the language reference.

## Diagnostics

| Function                          | Description                                          |
| --------------------------------- | ---------------------------------------------------- |
| [`Assert`](/docs/api/core/assert) | Check a condition at run time, aborting if it fails. |
| [`Panic`](/docs/api/core/panic)   | Terminate the program immediately with a message.    |
| [`#Error`](/docs/api/core/error)  | Emit a compilation error.                            |
| [`#Warn`](/docs/api/core/warn)    | Emit a compilation warning.                          |

## Compile-time context

| Value                                  | Description                                           |
| -------------------------------------- | ----------------------------------------------------- |
| [`#target`](/docs/api/core/target)     | Information about the compilation target.             |
| [`#build`](/docs/api/core/build)       | Information about the active build.                   |
| [`#compiler`](/docs/api/core/compiler) | Information about the compiler performing the build.  |
| [`#config`](/docs/api/core/config)     | User-defined values from the manifest and `--define`. |
| [`#source`](/docs/api/core/source)     | Location of the expression that reads it.             |

## See also

- [Conditional Compilation](/docs/lang/comptime/conditional) — using the compile-time context in `when`
- [The `Result` Type](/docs/lang/error/result) — the recoverable-error model
- [Slices](/docs/lang/slices/overview) and [Ranges](/docs/lang/ranges/overview) — the language-reference treatment
