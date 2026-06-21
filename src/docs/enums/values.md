# Backing Type and Explicit Values

By default an enum's representation is chosen by the compiler. When the numeric value matters — for serialisation, file formats, or [interoperation with native code](/docs/pointers/extern) — declare an integer **backing type** after the enum name and assign an explicit value to each variant:

```rux
enum Color: uint8 {
    Black = 0,
    Red   = 1,
    Green = 2,
    Blue  = 3,
    White = 4
}
```

The backing type (`uint8` here) fixes both the storage size and how each variant is encoded. Any integer type may be used; pick the smallest one that holds every value.

## Why a Backing Type

Pinning the representation makes the enum's layout stable and predictable:

- **Serialisation** — write the numeric value to a file or network stream and read it back without ambiguity.
- **FFI** — match the integer type a C API expects when passing an enum across the boundary.
- **Compactness** — a `uint8`-backed enum occupies a single byte.

Without an explicit backing type, do not rely on the numeric value of a variant — treat the enum as an opaque set of names and use [`match`](/docs/statements/match) to branch on it.

## Referencing Backed Variants

A variant of a backed enum is referenced exactly like any other, with the `::` path separator:

```rux
let c = Color::Green;
```

The variant still behaves as a named value; the backing integer is its representation, not a substitute for it.

## Memory Layout

A backed enum is stored as exactly one value of its backing type, with the variant's assigned integer as the bit pattern. Its size and alignment are therefore those of the backing type:

```rux
enum Color: uint8 { Black = 0, Red = 1, /* … */ }

let c = Color::Red;   // 1 byte in memory, holding the value 1
```

Choosing a wider backing type (`uint16`, `uint32`, …) trades space for range; pick the smallest that holds every assigned value.

## See Also

- [Enumerations](/docs/enums/overview) — the enum overview
- [Variants with Data](/docs/enums/data) — carrying a payload instead of a fixed number
- [Pointers and `extern`](/docs/pointers/extern) — exchanging values with native code
