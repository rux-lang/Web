# Std Package

::: warning Unstable API
The package is under active development and its API is **not yet stable**. Names, signatures, and behavior may change between releases, and this documentation will be updated to match.
:::

**Module:** `Std`

**Source:** [github.com/rux-lang/Std](https://github.com/rux-lang/Std)

The **Std** package is the Rux standard library — the core set of types and
functions available to every program. It is organized into modules: a core
`Std` module of types and functions available everywhere, plus submodules such
as `Std::Io`, `Std::Memory`, and `Std::Math`.

## Installation

Add the standard library to your project, then install dependencies:

```sh
rux add Std
rux install
```

Import the modules, types, or functions you need:

```rux
import Std::Io::*;
import Std::Memory::*;
import Std::Math;
```

## Contents

### Module Std

Core types and functions available without a submodule prefix.

| Symbol                            | Description                                          |
| --------------------------------- | ---------------------------------------------------- |
| [`Assert`](assert)                | Abort the program if a condition is false.           |
| [`Display`](display)              | Interface for converting a value to a `String`.      |
| [`Exit`](exit)                    | Terminate the process with an exit code.             |
| [`Fatal`](fatal)                  | Report an unrecoverable error and terminate.         |
| [`Format`](format)                | Build a `String` from a format string and arguments. |
| [`String`](string/)               | A heap-allocated UTF-8 string.                       |
| [`StringBuilder`](stringbuilder/) | A growable buffer for building strings efficiently.  |
| [Floating-point helpers](float)   | `IsNan` and `IsInfinite` for `float64`.              |

### Module Std::Io

Console input and output.

| Function                    | Description                                              |
| --------------------------- | -------------------------------------------------------- |
| [`Print`](io/print)         | Write a value to standard output, without a newline.     |
| [`PrintLine`](io/printline) | Write a value to standard output, followed by a newline. |
| [`ReadLine`](io/readline)   | Read a line of text from standard input.                 |

### Module Std::Memory

Raw heap allocation and memory manipulation.

| Function                    | Description                                                    |
| --------------------------- | -------------------------------------------------------------- |
| [`Alloc`](memory/alloc)     | Allocate a block of uninitialized memory on the heap.          |
| [`Compare`](memory/compare) | Compare two blocks byte by byte.                               |
| [`Copy`](memory/copy)       | Copy bytes between non-overlapping blocks.                     |
| [`Free`](memory/free)       | Release a heap block previously returned by `Alloc`/`Realloc`. |
| [`Realloc`](memory/realloc) | Resize a previously allocated block, preserving its contents.  |
| [`Set`](memory/set)         | Fill a block with a byte value.                                |
| [`Zero`](memory/zero)       | Fill a block with zeros.                                       |

### Module Std::Math

Mathematical constants and floating-point functions.

| Topic                | Description                                          |
| -------------------- | ---------------------------------------------------- |
| [`Std::Math`](math/) | `Pi`/`E`, trigonometry, powers, roots, and rounding. |

### Module Std::Random

Seeded pseudo-random number generation.

| Topic                    | Description                                        |
| ------------------------ | -------------------------------------------------- |
| [`Std::Random`](random/) | Random integers, floats, and booleans from a seed. |

### Collections

| Module                     | Description                                   |
| -------------------------- | --------------------------------------------- |
| [`Std::HashMap`](hashmap/) | Hash map from integer keys to pointer values. |
| [`Std::HashSet`](hashset/) | Hash set of integers.                         |

### Encoding & hashing

| Module                   | Description                                 |
| ------------------------ | ------------------------------------------- |
| [`Std::Base64`](base64/) | Base64 encoding and decoding.               |
| [`Std::Hash`](hash/)     | BLAKE2/3, SHA-0/1/256/512, and MD5 digests. |
| [`Std::Hex`](hex/)       | Hexadecimal encoding and decoding.          |

### System

| Module               | Description                                      |
| -------------------- | ------------------------------------------------ |
| [`Std::Sort`](sort/) | In-place sorting of integer arrays.              |
| [`Std::Time`](time/) | Sleeping, monotonic timing, and wall-clock time. |
| [`Std::UUID`](uuid/) | Generate, format, and validate version-4 UUIDs.  |
