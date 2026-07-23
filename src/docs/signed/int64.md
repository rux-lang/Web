# `int64`

| Property         | Value                                          |
| ---------------- | ---------------------------------------------- |
| Size             | 8 bytes (64 bits)                              |
| Minimum value    | −2<sup>63</sup> ≈ −9.223372 × 10<sup>18</sup>  |
| Maximum value    | 2<sup>63</sup>−1 ≈ 9.223372 × 10<sup>18</sup>  |
| Literal suffix   | `i64`                                          |
| Representation   | Two's complement                               |
| Hardware support | Native on all supported targets                |

`int64` is a full-width signed integer matching the native word of 64-bit targets — a fixed-width type whose size is identical on every target platform. Like all signed types it uses [two's complement](https://en.wikipedia.org/wiki/Two%27s_complement): the most significant bit is the sign bit, and the range is asymmetric (the minimum has no positive counterpart).

## Literals

```rux
let a: int64 = -9000000000;  // explicit annotation
let b = 42i64;               // type suffix
```

If a literal value does not fit in `int64`, the compiler emits an error at compile time. See [Literals](/docs/lexical/literals) for decimal, hexadecimal, octal, and binary forms.

## Typical Use Cases

- Timestamps (nanoseconds since epoch)
- Memory offsets and sizes on 64-bit systems
- Database keys and large counters

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
let a: int64 = 10;
let b: int64 = 3;

let sum  = a + b;   // 13
let quot = a / b;   // 3   truncates toward zero
let rem  = a % b;   // 1   carries the sign of the dividend
```

Division and remainder truncate toward zero, so the remainder takes the sign of the dividend: `-7 % 2` is `-1`.

**Overflow.** In debug builds, signed overflow raises a fatal error. In release builds it wraps modulo 2<sup>64</sup> in two's-complement fashion. Wraparound is well-defined in Rux (unlike C/C++), but relying on it is almost always a logic error.

## Comparison

| Operator | Description           | Result |
| -------- | --------------------- | ------ |
| `==`     | Equal                 | `bool` |
| `!=`     | Not equal             | `bool` |
| `<`      | Less than             | `bool` |
| `<=`     | Less than or equal    | `bool` |
| `>`      | Greater than          | `bool` |
| `>=`     | Greater than or equal | `bool` |

Both operands must have the same type. Comparing `int64` with another integer type — or with an unsigned type such as `uint64` — is a compile-time error; cast one operand explicitly first.

## Shift and Bitwise

Right shift with `>>` on a signed value is **arithmetic**: vacated bits are filled with the sign bit, preserving the sign. To fill with zeros instead, use the logical right shift [`>>>`](/docs/operations/shift#logical-right-shift), which keeps the same signed type and width.

```rux
let s: int64 = -8;
let r = s >> 2;    // -2   sign-filled (arithmetic) right shift
```

The bitwise operators `&`, `|`, `^`, and `~` are also defined (`~x` equals `−(x + 1)`), but bitmask work usually reads more clearly on [unsigned types](/docs/unsigned/uint64).

## Conversion

Rux performs no implicit numeric conversions — every conversion uses the [`as`](/docs/operations/type-cast) operator. Widening to a wider signed type preserves the value through sign extension; narrowing keeps only the low-order bits; a same-width signed↔unsigned cast reinterprets the bit pattern.

```rux
let x: int64 = -1;
let small = x as int32;   // -1                    narrowed, low 32 bits kept
let u     = x as uint64;  // 18446744073709551615  same width, bits reinterpreted
```

## See Also

- [`uint64`](/docs/unsigned/uint64) — unsigned counterpart of the same width
- [Unsigned Integer Types](/docs/unsigned/uint) — the unsigned integer family
