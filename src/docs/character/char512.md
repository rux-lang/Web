# `char512`

::: warning
`char512` is not implemented in the current release.
:::

| Property | Value |
| -------- | ----- |
| Size     | 64 bytes (512 bits) |
| Range    | 0 – 2<sup>512</sup>−1 |
| Coverage | no defined Unicode semantics |

`char512` is the widest character type in Rux (64 bytes), with no defined Unicode semantics. Like all Rux character types it is an unsigned, non-nullable value type that holds a single code point or raw code unit, and is type-distinct from both integers and strings. It behaves as an unsigned integer for comparison; reserve it for raw code units, custom symbol tables, or oversized ABI character units, and use the default [`char`](./char) for Unicode text.

## Literals

A character literal is written with single quotes, but extended types are more often built from a raw integer cast:

```rux
let unit: char512 = 'A';       // stored as a 512-bit code unit
let raw = 0x1F600 as char512;  // raw value via explicit cast
```

The compiler may warn when a plain integer literal is assigned without an explicit cast, since that is rarely intentional.

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

The `\u{...}` escape takes 1–6 hexadecimal digits (braces mandatory).

## Typical Use Cases

- Experimental and research encodings

## Comparison

Character types are comparable for both equality and ordering. For extended types, ordering follows the plain numeric value of the underlying code unit.

| Operator       | Description     | Result |
| -------------- | --------------- | ------ |
| `==`           | Equal           | `bool` |
| `!=`           | Not equal       | `bool` |
| `<` `<=` `>` `>=` | Numeric ordering | `bool` |

```rux
let a: char512 = 'a';
let b: char512 = 'b';

let eq = a == b;  // false
let lt = a < b;   // true
```

## Conversion

`char512` is the widest character type, so there is no wider type to widen into; every other width narrows back down from it with a checked `as` (use `as?` for `null` on overflow). Because it has no Unicode semantics, it converts to and from its backing unsigned integer with `as`, but never implicitly:

```rux
let raw = 0x1F600 as char512;  // integer → character — explicit
let n = raw as uint512;        // character → integer — explicit
let narrow: char32? = raw as? char32;  // checked narrowing — null on overflow
```

Char types have no arithmetic operators; cast to the integer type to compute, then cast back. Unlike the Unicode char types, extended types may hold surrogate values (U+D800–U+DFFF) as raw integers, but these carry no Unicode meaning.

## See Also

- [`char`](./char) — the default character type
- [`char256`](./char256) — the next width down
