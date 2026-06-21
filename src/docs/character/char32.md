# `char32`

| Property | Value |
| -------- | ----- |
| Size     | 4 bytes (32 bits) |
| Range    | U+0000 – U+10FFFF |
| Coverage | all Unicode planes (the plain `char` default) |

`char32` is the standard Unicode character type, covering all 1,114,112 code points (U+0000–U+10FFFF) including emoji and the supplementary planes. The plain [`char`](./char) keyword is an alias for it. Like all Rux character types it is an unsigned, non-nullable value type that holds a single code point or raw code unit, and is type-distinct from both integers and strings. It is the recommended type for general-purpose Unicode text.

## Literals

A character literal is written with single quotes:

```rux
let octopus: char32 = '🐙';      // U+1F419
let math: char32 = '𝕳';          // U+1D573
let emoji: char32 = '\u{1F600}'; // U+1F600 😀 — Unicode escape
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

The `\u{...}` escape takes 1–6 hexadecimal digits (braces mandatory); values above U+10FFFF are rejected at compile time.

## Typical Use Cases

- General Unicode text processing
- Code-point iteration over strings

## Comparison

Character types are comparable for both equality and ordering. Ordering follows the numeric value of the underlying code point (code-point order, not locale-aware collation).

| Operator       | Description         | Result |
| -------------- | ------------------- | ------ |
| `==`           | Equal               | `bool` |
| `!=`           | Not equal           | `bool` |
| `<` `<=` `>` `>=` | Code-point ordering | `bool` |

```rux
let a: char32 = 'a';
let b: char32 = 'b';

let eq = a == b;  // false
let lt = a < b;   // true  (U+0061 < U+0062)
```

## Conversion

Character types are not integers, but they convert explicitly with `as`.

**Widening** to a wider char type is implicit and always safe:

```rux
let c: char32 = '★';
let wide: char64 = c;   // widening — always valid
```

**Narrowing** to a smaller char type is checked at runtime: a value that does not fit triggers a fatal error, so prefer the `as?` form, which returns `null` instead:

```rux
let wide: char32 = '🔥';              // U+1F525
let narrow = wide as char16;          // fatal error: value > U+FFFF
let safe: char16? = wide as? char16;  // null instead
```

Conversions to and from the backing integer type are also explicit:

```rux
let c: char32 = '★';
let n = c as uint32;      // 0x00002605
let back = n as char32;   // '★'
```

Integer values that are not valid Unicode scalars (surrogates U+D800–U+DFFF, or anything above U+10FFFF) cannot be converted to `char32` or narrower — use `as?` to get `null`. Char types also have no arithmetic operators; cast to the integer type to compute offsets, then cast back:

```rux
let c: char32 = 'a';
let next = (c as uint32 + 1) as char32;  // 'b'
```

## String Interop

A single character converts to a one-character `String` with `String::From()` or interpolation, and `String` indexing returns a `char` by code-point position (not byte offset):

```rux
let c: char32 = '€';
let s = String::From(c);       // "€"
let t = "{c}";                 // "€"  (interpolation)
let first: char = "Hello"[0];  // 'H'
```

Source files are UTF-8; in memory a char is a little-endian unsigned integer of its declared width. A single `char32` is one Unicode scalar value, which is not always one visible glyph — emoji such as 👨‍👩‍👧 are several scalar values joined by zero-width joiners, so counting characters is not the same as counting glyphs.

## See Also

- [`char`](./char) — the alias keyword for this type
- [`char16`](./char16) — the next width down
- [`char64`](./char64) — the next width up
