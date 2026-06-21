# `int16`

| Property         | Value                           |
| ---------------- | ------------------------------- |
| Size             | 2 bytes (16 bits)               |
| Minimum value    | −2<sup>15</sup> = −32,768       |
| Maximum value    | 2<sup>15</sup>−1 = 32,767       |
| Literal suffix   | `i16`                           |
| Representation   | Two's complement                |
| Hardware support | Native on all supported targets |

`int16` is a compact signed integer for 16-bit data — a fixed-width type whose size is identical on every target platform. Like all signed types it uses [two's complement](https://en.wikipedia.org/wiki/Two%27s_complement): the most significant bit is the sign bit, and the range is asymmetric (the minimum −32,768 has no positive counterpart).

## Literals

```rux
let a: int16 = -12345;  // explicit annotation
let b = 1000i16;        // type suffix
```

If a literal value does not fit in `int16`, the compiler emits an error at compile time. See [Literals](/docs/lexical/literals) for decimal, hexadecimal, octal, and binary forms.

## Typical Use Cases

- Audio samples (PCM-16)
- 16-bit packed data formats and file headers
- Coordinates and offsets in constrained ranges

## Arithmetic

| Operator | Description    | Compound |
| -------- | -------------- | -------- |
| `+`      | Addition       | `+=`     |
| `-`      | Subtraction    | `-=`     |
| `*`      | Multiplication | `*=`     |
| `/`      | Division       | `/=`     |
| `%`      | Remainder      | `%=`     |
| `**`     | Exponentiation | n/a      |

```rux
let a: int16 = 10;
let b: int16 = 3;

let sum  = a + b;   // 13
let quot = a / b;   // 3   truncates toward zero
let rem  = a % b;   // 1   carries the sign of the dividend
```

Division and remainder truncate toward zero, so the remainder takes the sign of the dividend: `-7 % 2` is `-1`.

**Overflow.** In debug builds, signed overflow raises a fatal error. In release builds it wraps modulo 2<sup>16</sup> in two's-complement fashion. Wraparound is well-defined in Rux (unlike C/C++), but relying on it is almost always a logic error.

## Comparison

| Operator | Description           | Result |
| -------- | --------------------- | ------ |
| `==`     | Equal                 | `bool` |
| `!=`     | Not equal             | `bool` |
| `<`      | Less than             | `bool` |
| `<=`     | Less than or equal    | `bool` |
| `>`      | Greater than          | `bool` |
| `>=`     | Greater than or equal | `bool` |

Both operands must have the same type. Comparing `int16` with another integer type — or with an unsigned type such as `uint16` — is a compile-time error; cast one operand explicitly first.

## Shift and Bitwise

Right shift on a signed value is **arithmetic**: vacated bits are filled with the sign bit, preserving the sign.

```rux
let s: int16 = -8;  // 0b1111111111111000
let r = s >> 2;     // -2
```

The bitwise operators `&`, `|`, `^`, and `~` are also defined (`~x` equals `−(x + 1)`), but bitmask work usually reads more clearly on [unsigned types](/docs/unsigned/uint16).

## Conversion

Rux performs no implicit numeric conversions — every conversion uses the [`as`](/docs/operations/type-cast) operator. Widening to a wider signed type preserves the value through sign extension; narrowing keeps only the low-order bits; a same-width signed↔unsigned cast reinterprets the bit pattern.

```rux
let x: int16 = -1;
let wide = x as int32;   // -1     sign-extended, value preserved
let byte = x as int8;    // -1     narrowed, low 8 bits kept
let u    = x as uint16;  // 65535  same width, bits reinterpreted
```

## See Also

- [`uint16`](/docs/unsigned/uint16) — unsigned counterpart of the same width
- [Unsigned Integer Types](/docs/unsigned/uint) — the unsigned integer family
