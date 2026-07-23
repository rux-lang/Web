# Rux Package

::: warning Unstable API
The package is under active development and its API is **not yet stable**. Names, signatures, and behavior may change between releases, and this documentation will be updated to match.
:::

The core language package: the fundamental types and the compiler intrinsics every program can rely on.

**Package:** `Rux`

**Source:** [github.com/rux-lang/Rux/tree/main/Packages/Rux](https://github.com/rux-lang/Rux/tree/main/Packages/Rux)

`Rux` is the root of the package graph — every other package depends on it. It defines the primitive types, the fundamental generic types ([`Result`](result), [`Slice`](slice), the [ranges](ranges)), and the compiler intrinsics for diagnostics and for reading the build, compiler, target, and source context at compile time. Its symbols are available without an explicit dependency line.

## Installation

`Rux` is an implicit dependency of every package, so it needs no `rux add`. Import the symbols you use:

```rux
import Rux::{ Result, Slice };
import Rux::{ #target, #Error };
```

## Types

| Type              | Description                                        |
| ----------------- | -------------------------------------------------- |
| [`Result`](result) | The return type of an operation that can fail.    |
| [`Slice`](slice)   | A view over a contiguous sequence of elements.    |
| [`Ranges`](ranges) | The range types produced by the range operators.  |

The package also defines the primitive types — the [signed](/docs/signed/int) and [unsigned](/docs/unsigned/uint) integers, [floating-point](/docs/floating/float), [boolean](/docs/boolean/bool), and [character](/docs/character/char) families — which are covered in the language reference.

## Diagnostics

| Function              | Description                                    |
| --------------------- | ---------------------------------------------- |
| [`Assert`](assert)    | Check a condition at run time, aborting if it fails. |
| [`Panic`](panic)      | Terminate the program immediately with a message. |
| [`#Error`](error)     | Emit a compilation error.                      |
| [`#Warn`](warn)       | Emit a compilation warning.                    |

## Compile-time context

| Value                  | Description                                       |
| ---------------------- | ------------------------------------------------- |
| [`#target`](target)    | Information about the compilation target.         |
| [`#build`](build)      | Information about the active build.               |
| [`#compiler`](compiler) | Information about the compiler performing the build. |
| [`#config`](config)    | User-defined values from the manifest and `--define`. |
| [`#source`](source)    | Location of the expression that reads it.         |

## See also

- [Conditional Compilation](/docs/comptime/conditional) — using the compile-time context in `when`
- [The `Result` Type](/docs/error/result) — the recoverable-error model
- [Slices](/docs/slices/overview) and [Ranges](/docs/ranges/overview) — the language-reference treatment
