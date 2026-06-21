# `char8`

| Property | Value |
| -------- | ----- |
| Size     | 1 byte (8 bits) |
| Range    | U+0000 – U+00FF |
| Coverage | ASCII and the Latin-1 supplement |

`char8` is a single-byte character for ASCII and the Latin-1 supplement (U+0000–U+00FF). Like all Rux character types it is an unsigned, non-nullable value type that holds a single code point or raw code unit, and is type-distinct from both integers and strings. Use it only for strict ASCII or Latin-1 data where the 1-byte constraint is a useful invariant; otherwise prefer the default [`char`](./char).

## Literals

A character literal is written with single quotes:

```rux
let a: char8 = 'A';     // U+0041
let yen: char8 = '¥';   // U+00A5
let euro: char8 = '€';  // U+20AC — compile error: out of range for char8
```

Code points above U+00FF cannot be represented and produce a compile-time error.

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

- ASCII protocol parsing
- Latin-1 text buffers
- Byte-oriented tokenizers

## Comparison

Character types are comparable for both equality and ordering. Ordering follows the numeric value of the underlying code point (code-point order, not locale-aware collation).

| Operator       | Description         | Result |
| -------------- | ------------------- | ------ |
| `==`           | Equal               | `bool` |
| `!=`           | Not equal           | `bool` |
| `<` `<=` `>` `>=` | Code-point ordering | `bool` |

```rux
let a: char8 = 'a';
let b: char8 = 'b';

let eq = a == b;  // false
let lt = a < b;   // true  (U+0061 < U+0062)
```

## Conversion

Character types are not integers, but they convert explicitly with `as`.

**Widening** to a wider char type is implicit and always safe:

```rux
let c: char8 = 'Z';
let wide: char16 = c;   // widening — always valid
```

**Narrowing** to a smaller char type is checked at runtime: a value that does not fit triggers a fatal error, so prefer the `as?` form, which returns `null` instead:

```rux
let wide: char32 = '🔥';            // U+1F525
let narrow = wide as char8;         // fatal error: value > U+00FF
let safe: char8? = wide as? char8;  // null instead
```

Conversions to and from the backing integer type are also explicit:

```rux
let c: char8 = 'A';
let n = c as uint32;     // 0x00000041
let back = n as char8;   // 'A'
```

Char types have no arithmetic operators — cast to the integer type to compute offsets, then cast back:

```rux
let c: char8 = 'a';
let next = (c as uint32 + 1) as char8;  // 'b'
```

## String Interop

A single character converts to a one-character `String` with `String::From()` or interpolation, and `String` indexing returns a `char` by code-point position (not byte offset):

```rux
let c: char8 = 'A';
let s = String::From(c);        // "A"
let t = "{c}";                 // "A"  (interpolation)
let first: char = "Hello"[0];  // 'H'
```

Source files are UTF-8; in memory a char is a little-endian unsigned integer of its declared width.

## See Also

- [`char`](./char) — the default character type
- [`char16`](./char16) — the next width up
