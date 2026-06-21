# `char16`

| Property | Value |
| -------- | ----- |
| Size     | 2 bytes (16 bits) |
| Range    | U+0000 – U+FFFF |
| Coverage | the full Basic Multilingual Plane |

`char16` is a two-byte character covering the entire Basic Multilingual Plane (U+0000–U+FFFF) — Latin, Cyrillic, CJK, Arabic, Hebrew, and most common symbols. Like all Rux character types it is an unsigned, non-nullable value type that holds a single code point or raw code unit, and is type-distinct from both integers and strings. Use it when interoperating with UTF-16 APIs; otherwise prefer the default [`char`](./char).

## Literals

A character literal is written with single quotes:

```rux
let kanji: char16 = '字';  // U+5B57
let star: char16 = '★';   // U+2605
let fire: char16 = '🔥';   // U+1F525 — compile error: out of range for char16
```

Code points above U+FFFF cannot be represented and produce a compile-time error.

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

The `\u{...}` escape takes 1–6 hexadecimal digits (braces mandatory); values outside the type's range are rejected at compile time.

## Typical Use Cases

- UTF-16 code units
- Interop with Java / C# / Windows wide strings

## Comparison

Character types are comparable for both equality and ordering. Ordering follows the numeric value of the underlying code point (code-point order, not locale-aware collation).

| Operator       | Description         | Result |
| -------------- | ------------------- | ------ |
| `==`           | Equal               | `bool` |
| `!=`           | Not equal           | `bool` |
| `<` `<=` `>` `>=` | Code-point ordering | `bool` |

```rux
let a: char16 = 'a';
let b: char16 = 'b';

let eq = a == b;  // false
let lt = a < b;   // true  (U+0061 < U+0062)
```

## Conversion

Character types are not integers, but they convert explicitly with `as`.

**Widening** to a wider char type is implicit and always safe:

```rux
let c: char16 = '字';
let wide: char32 = c;   // widening — always valid
```

**Narrowing** to a smaller char type is checked at runtime: a value that does not fit triggers a fatal error, so prefer the `as?` form, which returns `null` instead:

```rux
let wide: char32 = '🔥';              // U+1F525
let narrow = wide as char16;          // fatal error: value > U+FFFF
let safe: char16? = wide as? char16;  // null instead
```

Conversions to and from the backing integer type are also explicit:

```rux
let c: char16 = '★';
let n = c as uint32;      // 0x00002605
let back = n as char16;   // '★'
```

Char types have no arithmetic operators — cast to the integer type to compute offsets, then cast back:

```rux
let c: char16 = 'a';
let next = (c as uint32 + 1) as char16;  // 'b'
```

## String Interop

A single character converts to a one-character `String` with `String::From()` or interpolation, and `String` indexing returns a `char` by code-point position (not byte offset):

```rux
let c: char16 = '★';
let s = String::From(c);        // "★"
let t = "{c}";                 // "★"  (interpolation)
let first: char = "Hello"[0];  // 'H'
```

Source files are UTF-8; in memory a char is a little-endian unsigned integer of its declared width.

## See Also

- [`char`](./char) — the default character type
- [`char8`](./char8) — the next width down
- [`char32`](./char32) — the next width up
