# `int32`

| Property         | Value                            |
| ---------------- | -------------------------------- |
| Size             | 4 bytes (32 bits)                |
| Minimum value    | −2<sup>31</sup> = −2,147,483,648 |
| Maximum value    | 2<sup>31</sup>−1 = 2,147,483,647 |
| Literal suffix   | `i32`                            |
| Representation   | Two's complement                 |
| Hardware support | Native on all supported targets  |

`int32` is the workhorse signed integer for general arithmetic — a fixed-width type whose size is identical on every target platform. Like all signed types it uses [two's complement](https://en.wikipedia.org/wiki/Two%27s_complement): the most significant bit is the sign bit, and the range is asymmetric (the minimum −2,147,483,648 has no positive counterpart).

## Literals

```rux
let a: int32 = -2000000;  // explicit annotation
let b = 42i32;            // type suffix
```

If a literal value does not fit in `int32`, the compiler emits an error at compile time. See [Literals](/docs/lexical/literals) for decimal, hexadecimal, octal, and binary forms.

## Typical Use Cases

- General-purpose integer arithmetic
- File offsets on 32-bit systems
- Interop with C `int` in FFI signatures

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
let a: int32 = 10;
let b: int32 = 3;

let sum  = a + b;   // 13
let quot = a / b;   // 3   truncates toward zero
let rem  = a % b;   // 1   carries the sign of the dividend
```

Division and remainder truncate toward zero, so the remainder takes the sign of the dividend: `-7 % 2` is `-1`.

**Overflow.** In debug builds, signed overflow raises a fatal error. In release builds it wraps modulo 2<sup>32</sup> in two's-complement fashion. Wraparound is well-defined in Rux (unlike C/C++), but relying on it is almost always a logic error.

## Comparison

| Operator | Description           | Result |
| -------- | --------------------- | ------ |
| `==`     | Equal                 | `bool` |
| `!=`     | Not equal             | `bool` |
| `<`      | Less than             | `bool` |
| `<=`     | Less than or equal    | `bool` |
| `>`      | Greater than          | `bool` |
| `>=`     | Greater than or equal | `bool` |

Both operands must have the same type. Comparing `int32` with another integer type — or with an unsigned type such as `uint32` — is a compile-time error; cast one operand explicitly first.

## Shift and Bitwise

Right shift on a signed value is **arithmetic**: vacated bits are filled with the sign bit, preserving the sign.

```rux
let s: int32 = -8;
let r = s >> 2;    // -2   sign-filled (arithmetic) right shift
```

The bitwise operators `&`, `|`, `^`, and `~` are also defined (`~x` equals `−(x + 1)`), but bitmask work usually reads more clearly on [unsigned types](/docs/unsigned/uint32).

## Conversion

Rux performs no implicit numeric conversions — every conversion uses the [`as`](/docs/operations/type-cast) operator. Widening to a wider signed type preserves the value through sign extension; narrowing keeps only the low-order bits; a same-width signed↔unsigned cast reinterprets the bit pattern.

```rux
let x: int32 = -1;
let wide = x as int64;   // -1          sign-extended, value preserved
let byte = x as int8;    // -1          narrowed, low 8 bits kept
let u    = x as uint32;  // 4294967295  same width, bits reinterpreted
```

## See Also

- [`uint32`](/docs/unsigned/uint32) — unsigned counterpart of the same width
- [Unsigned Integer Types](/docs/unsigned/uint) — the unsigned integer family
