# `int8`

| Property         | Value                           |
| ---------------- | ------------------------------- |
| Size             | 1 byte (8 bits)                 |
| Minimum value    | −2<sup>7</sup> = −128           |
| Maximum value    | 2<sup>7</sup>−1 = 127           |
| Literal suffix   | `i8`                            |
| Representation   | Two's complement                |
| Hardware support | Native on all supported targets |

`int8` is the narrowest signed integer in Rux — a fixed-width type whose size is identical on every target platform. Like all signed types it uses [two's complement](https://en.wikipedia.org/wiki/Two%27s_complement): the most significant bit is the sign bit. The range is asymmetric — the minimum (−128) has no positive counterpart, since the maximum is only 127.

## Literals

```rux
let a: int8 = -100;  // explicit annotation
let b = 42i8;        // type suffix
```

If a literal value does not fit in `int8`, the compiler emits an error at compile time. See [Literals](/docs/lexical/literals) for decimal, hexadecimal, octal, and binary forms.

## Typical Use Cases

- Small enumeration values and byte-ranged quantities
- Compact storage in large arrays and packed structures
- Delta values in compressed data formats

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
let a: int8 = 10;
let b: int8 = 3;

let sum  = a + b;   // 13
let quot = a / b;   // 3   truncates toward zero
let rem  = a % b;   // 1   carries the sign of the dividend
```

Division and remainder truncate toward zero, so the remainder takes the sign of the dividend: `-7 % 2` is `-1`.

**Overflow.** In debug builds, signed overflow raises a fatal error. In release builds it wraps modulo 2<sup>8</sup> in two's-complement fashion. Wraparound is well-defined in Rux (unlike C/C++), but relying on it is almost always a logic error.

## Comparison

| Operator | Description           | Result |
| -------- | --------------------- | ------ |
| `==`     | Equal                 | `bool` |
| `!=`     | Not equal             | `bool` |
| `<`      | Less than             | `bool` |
| `<=`     | Less than or equal    | `bool` |
| `>`      | Greater than          | `bool` |
| `>=`     | Greater than or equal | `bool` |

Both operands must have the same type. Comparing `int8` with another integer type — or with an unsigned type such as `uint8` — is a compile-time error; cast one operand explicitly first.

## Shift and Bitwise

Right shift on a signed value is **arithmetic**: vacated bits are filled with the sign bit, preserving the sign.

```rux
let s: int8 = -8;  // 0b11111000
let r = s >> 2;    // 0b11111110 = -2
```

The bitwise operators `&`, `|`, `^`, and `~` are also defined (`~x` equals `−(x + 1)`), but bitmask work usually reads more clearly on [unsigned types](/docs/unsigned/uint8).

## Conversion

Rux performs no implicit numeric conversions — every conversion uses the [`as`](/docs/operations/type-cast) operator. Widening to a wider signed type preserves the value through sign extension; a same-width signed↔unsigned cast reinterprets the bit pattern.

```rux
let x: int8 = -1;
let wide = x as int32;   // -1    sign-extended, value preserved
let u    = x as uint8;   // 255   same width, bits reinterpreted
```

## See Also

- [`uint8`](/docs/unsigned/uint8) — unsigned counterpart of the same width
- [Unsigned Integer Types](/docs/unsigned/uint) — the unsigned integer family
