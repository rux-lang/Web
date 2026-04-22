# Char Types

Rux provides a family of fixed-width character types designed to represent Unicode code points and
arbitrary-width text units with explicit, predictable storage sizes. Unlike many languages that
offer a single character type, Rux exposes the full spectrum from narrow ASCII-range characters
up to extended private-use and future [Unicode](https://en.wikipedia.org/wiki/Unicode) planes.

## Overview

A character value in Rux is an integer-backed scalar that holds a single Unicode code point (or
raw code unit, depending on the type). All char types are **unsigned**, **non-nullable**, and
**value types** — they are stored inline, not on the heap.

Character types are distinct from string types. A `char` holds one code point;
a string is a sequence of code units. Mixing them requires an explicit conversion.

## Char Types

| Type      | Size     | Range                 | Fits Unicode?         |
| --------- | -------- | --------------------- | --------------------- |
| `char8`   | 1 byte   | U+0000 – U+00FF       | BMP Latin block only  |
| `char16`  | 2 bytes  | U+0000 – U+FFFF       | Full BMP              |
| `char32`  | 4 bytes  | U+0000 – U+10FFFF     | All Unicode + extras  |
| `char64`  | 8 bytes  | 0 – 2<sup>64</sup>−1  | Extended / custom use |
| `char128` | 16 bytes | 0 – 2<sup>128</sup>−1 | Extended / custom use |
| `char256` | 32 bytes | 0 – 2<sup>256</sup>−1 | Extended / custom use |
| `char512` | 64 bytes | 0 – 2<sup>512</sup>−1 | Extended / custom use |

### `char8`

A single byte character. Suitable for [ASCII](https://en.wikipedia.org/wiki/ASCII) and the Latin-1
supplement (U+0000–U+00FF). Code points above U+00FF cannot be represented and will produce
a compile-time error if a literal or conversion exceeds this range.

```rux
let a: char8 = 'A'       // U+0041  ✓
let yen: char8 = '¥'     // U+00A5  ✓
// let euro: char8 = '€' // U+20AC  ✗  compile error: out of range for char8
```

### `char16`

A two-byte character covering the entire Basic Multilingual Plane (BMP, U+0000–U+FFFF). This
encompasses the vast majority of characters used in modern scripts including Latin, Cyrillic,
CJK Unified Ideographs, Arabic, Hebrew, and most emoji in common use.

```rux
let kanji: char16 = '字'   // U+5B57  ✓
let emoji: char16 = '★'   // U+2605  ✓
```

### `char32`

The standard Unicode character type. Covers all 1,114,112 code points defined by Unicode
(U+0000–U+10FFFF), including supplementary planes (emoji, historic scripts, musical notation,
math alphanumeric symbols, etc.). This is the recommended type for general Unicode text
processing.

```rux
let flag: char32 = '🏴'    // U+1F3F4  ✓
let math: char32 = '𝕳'    // U+1D573  ✓
```

### `char64`, `char128`, `char256`, `char512`

Extended-width character types with no defined Unicode semantics. Their primary uses are:

- Holding raw code units from non-Unicode encodings with wide code spaces.
- Domain-specific symbol tables (e.g., custom glyph IDs, protocol tokens).
- Alignment-friendly padding in packed structures.
- Interfacing with external ABIs that define oversized character units.

These types behave as unsigned integers for arithmetic and comparison but are **type-distinct**
from integer types — implicit conversion to `u64`, `u128`, etc. is not permitted.

```rux
let raw: char64 = 0x0001_F600 as char64
```

> **Note:** The compiler may emit a warning when assigning a plain integer literal to
> `char64`–`char512` without an explicit cast, as these assignments are rarely intentional.

## Default Char Type

The unqualified keyword `char` is an alias for `char32`.

```rux
let c: char = 'Ω'   // equivalent to char32
```

This choice ensures that `char` can represent any valid Unicode scalar value without truncation.
Code that explicitly needs a narrower or wider representation should always use the qualified type
names (`char8`, `char16`, etc.) to make intent clear.

## Char Literals

A character literal is written with **single quotes**:

```rux
'A'         // ASCII letter
'ñ'         // non-ASCII BMP character
'🔥'        // supplementary plane emoji (requires char32 or wider)
'\n'        // escape sequence — newline
'\t'        // escape sequence — horizontal tab
'\\'        // escape sequence — backslash
'\''        // escape sequence — single quote
'\"'        // escape sequence — double quote (allowed inside char literals)
'\0'        // escape sequence — null character (U+0000)
'\u{1F600}' // Unicode escape — U+1F600 😀
```

### Escape Sequences

| Sequence     | Character                  |
| ------------ | -------------------------- |
| `\n`         | Newline (U+000A)           |
| `\r`         | Carriage return (U+000D)   |
| `\t`         | Horizontal tab (U+0009)    |
| `\\`         | Backslash (U+005C)         |
| `\'`         | Single quote (U+0027)      |
| `\"`         | Double quote (U+0022)      |
| `\0`         | Null (U+0000)              |
| `\u{XXXXXX}` | Unicode scalar value (hex) |

The `\u{...}` escape accepts 1–6 hexadecimal digits and produces the corresponding Unicode scalar
value. Values above U+10FFFF are rejected at compile time. The braces are mandatory.

### Literal Width Inference

The compiler infers the minimum char type that can hold a given literal, but widens to the
annotated type when one is present:

```rux
let a          = 'A'    // inferred: char8  (U+0041 fits in one byte)
let b          = '字'   // inferred: char16 (U+5B57 fits in two bytes)
let c          = '🔥'   // inferred: char32 (U+1F525 requires four bytes)
let d: char32  = 'A'    // explicit: char32, no truncation concern
let e: char16  = '🔥'   // compile error: U+1F525 > U+FFFF
```

## Type Conversion

### Widening (always safe, implicit)

A narrower char type widens implicitly to any wider char type:

```rux
let c8:  char8  = 'Z'
let c16: char16 = c8   // implicit widening — always valid
let c32: char32 = c16  // implicit widening — always valid
```

### Narrowing (checked, requires `as`)

Narrowing conversions require an explicit `as` cast. A runtime check validates that the value fits
the target type; if it does not, the program panics (unless the `as?` checked form is used):

```rux
let wide: char32 = '🔥'            // U+1F525
let narrow: char16 = wide as char16 // panic at runtime: value > U+FFFF

let safe: char16? = wide as? char16 // returns null instead of panicking
```

### Conversion to/from Integer Types

Char types are **not** integers, but explicit conversions between char types and their
backing integer type are supported via `as`:

```rux
let c: char32 = '★'
let n: u32    = c as u32     // 0x00002605
let back: char32 = n as char32
```

Converting an integer value that is not a valid Unicode scalar (e.g. a surrogate code point
U+D800–U+DFFF) to `char32` or smaller produces a compile-time error when the value is a
constant, or a runtime panic when it is dynamic. Use `as?` to get `null` instead of panicking.

### Conversion to/from String

A single character can be converted to a one-character `String` using `String.from()` or string
interpolation:

```rux
let c: char = '€'
let s: String = String.from(c)   // "€"
let t: String = "{c}"            // "€"  (interpolation)
```

Extracting a `char` from a string uses indexing by code-point position (not byte offset):

```rux
let s = "Hello"
let h: char = s[0]   // 'H'
```

## Encoding

Rux source files are always UTF-8. Character literals in source code are decoded as UTF-8 and
stored as the corresponding Unicode scalar value in the chosen char type.

At runtime, the in-memory representation of a char value is a plain unsigned integer of the
declared width stored in **little-endian** byte order on all platforms. There is no BOM, no
surrogate pair, and no multi-byte encoding — a `char32` holding U+1F525 is simply the four-byte
little-endian integer `0x0001F525`.

String types (`str`, `String`) use **UTF-8** encoding internally. Converting a `char32` to a
`String` always produces valid UTF-8; the compiler handles the encoding automatically.

### Surrogates

Unicode surrogate code points (U+D800–U+DFFF) are **not** valid `char` values in Rux. Attempting
to construct a `char32` (or any narrower type) with a surrogate value is an error. Wider types
(`char64` and above) may hold surrogate values as raw integers, but they carry no Unicode meaning
in that context.

## Common Pitfalls

### Confusing bytes, code units, and code points

`char8` holds a single **byte** value, not a UTF-8 code unit. A UTF-8 encoded character such as
`€` (U+20AC) occupies **three** bytes in a UTF-8 string, so it cannot be stored in a `char8` at
all. If you need to process raw UTF-8 bytes, use `u8` arrays, not `char8` slices.

### Off-by-one in string indexing

`s[i]` on a `String` indexes by **Unicode scalar position**, not byte position. The index of a
character can therefore differ significantly from its byte offset in the underlying UTF-8 buffer.
For byte-level access use `s.bytes[i]`.

### Assuming `char` == one glyph

A single `char32` value is one Unicode **scalar value**, which is not always one visible glyph
(grapheme cluster). Emoji such as 👨‍👩‍👧 are composed of multiple scalar values joined by
zero-width joiners. Counting `char` values in a string will not give the number of visible
characters. Use the standard library's grapheme-cluster iterators for that purpose.

### Implicit integer arithmetic

Char types do not support arithmetic operators directly. To compute character ranges or offsets,
cast to the backing integer type first:

```rux
let c: char = 'a'
// let next = c + 1        // compile error: operator '+' not defined for char
let next: char = (c as u32 + 1) as char   // 'b'
```

### Narrowing without checking

A silent `as` cast from a wide char to a narrow one will panic if the value is out of range.
Prefer `as?` and handle `null` explicitly in any code that processes untrusted input.

```rux
func ToChar8(c: char32) -> char8? {
    return c as? char8
}
```

## Recommendations

- **Use `char` (i.e. `char32`) by default** for any general-purpose Unicode text handling.
- **Use `char16`** when interoperating with APIs or file formats that use UTF-16 code units
  (Windows APIs, Java strings, JavaScript strings).
- **Use `char8`** only for strict ASCII or Latin-1 data where the 1-byte constraint is a useful
  invariant enforced by the type system.
- **Avoid `char64`–`char512`** unless you have a specific, well-documented reason; their
  semantics are not Unicode and they can confuse readers unfamiliar with your domain.
- **Prefer `as?` over `as`** for narrowing conversions in code that handles external data.
- **Do not use char types as integers.** Cast explicitly to the appropriate integer type when
  arithmetic is needed, and cast back explicitly. This keeps the intent visible in code review.

## Notes

- The `char` alias resolves to `char32` at the type-system level; there is no distinct
  `char` kind in the compiler's internal representation.
- All char types are **`Copy`** and **`Eq`** by default. Ordering (`Ord`) is defined as
  numeric order of the underlying scalar value (i.e. code-point order, not locale-aware
  collation).
- Future language versions may introduce a `Grapheme` type for grapheme-cluster-level
  abstraction; `char` will remain a scalar-value type.
- The `char` keyword is **reserved** and cannot be used as an identifier, even in contexts
  where it would not be ambiguous.
- In FFI (`extern`) contexts, `char8` maps to C's `unsigned char`, `char16` to `char16_t`,
  and `char32` to `char32_t` (from `<uchar.h>`). Wider types have no standard C equivalent
  and are passed by pointer in generated C interop headers.
