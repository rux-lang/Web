# `char128`

::: warning
`char128` is not implemented in the current release.
:::

| Property | Value |
| -------- | ----- |
| Size     | 16 bytes (128 bits) |
| Range    | 0 – 2<sup>128</sup>−1 |
| Coverage | no defined Unicode semantics |

`char128` is a 16-byte extended-width character unit with no defined Unicode semantics. Like all Rux character types it is an unsigned, non-nullable value type that holds a single code point or raw code unit, and is type-distinct from both integers and strings. It behaves as an unsigned integer for comparison; reserve it for raw code units, custom symbol tables, or oversized ABI character units, and use the default [`char`](./char) for Unicode text.

## Literals

A character literal is written with single quotes, but extended types are more often built from a raw integer cast:

```rux
let unit: char128 = 'A';       // stored as a 128-bit code unit
let raw = 0x1F600 as char128;  // raw value via explicit cast
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

- Oversized character units defined by external ABIs
- Alignment-friendly padding in packed structures

## Comparison

Character types are comparable for both equality and ordering. For extended types, ordering follows the plain numeric value of the underlying code unit.

| Operator       | Description     | Result |
| -------------- | --------------- | ------ |
| `==`           | Equal           | `bool` |
| `!=`           | Not equal       | `bool` |
| `<` `<=` `>` `>=` | Numeric ordering | `bool` |

```rux
let a: char128 = 'a';
let b: char128 = 'b';

let eq = a == b;  // false
let lt = a < b;   // true
```

## Conversion

`char128` widens implicitly to a wider char type and narrows with a checked `as` (use `as?` for `null` on overflow). Because it has no Unicode semantics, it converts to and from its backing unsigned integer with `as`, but never implicitly:

```rux
let raw = 0x1F600 as char128;  // integer → character — explicit
let n = raw as uint128;        // character → integer — explicit
let wide: char256 = raw;       // widening — implicit
```

Char types have no arithmetic operators; cast to the integer type to compute, then cast back. Unlike the Unicode char types, extended types may hold surrogate values (U+D800–U+DFFF) as raw integers, but these carry no Unicode meaning.

## See Also

- [`char`](./char) — the default character type
- [`char64`](./char64) — the next width down
- [`char256`](./char256) — the next width up
