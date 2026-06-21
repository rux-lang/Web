# `uint16`

| Property         | Value                                |
| ---------------- | ------------------------------------ |
| Size             | 2 bytes (16 bits)                    |
| Minimum value    | 0                                    |
| Maximum value    | 2<sup>16</sup>−1 = 65,535            |
| Literal suffix   | `u16`                                |
| Representation   | Binary, wraps modulo 2<sup>16</sup>  |
| Hardware support | Native on all supported targets      |

`uint16` is a compact unsigned integer for 16-bit units — a fixed-width type whose size is identical on every target platform. It stores non-negative values in plain binary and wraps modulo 2<sup>16</sup> on overflow.

## Literals

```rux
let a: uint16 = 65535;  // explicit annotation
let b = 8080u16;        // type suffix
```

If a literal value does not fit in `uint16`, the compiler emits an error at compile time. See [Literals](/docs/lexical/literals) for decimal, hexadecimal, octal, and binary forms.

## Typical Use Cases

- UTF-16 code units
- TCP/UDP port numbers
- Small counters and 16-bit bitmasks

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
let a: uint16 = 10;
let b: uint16 = 3;

let sum  = a + b;   // 13
let quot = a / b;   // 3   truncates toward zero
let rem  = a % b;   // 1   always non-negative
```

Division truncates toward zero. Because unsigned values are never negative, both the quotient and the remainder are always non-negative.

**Overflow.** Unsigned arithmetic wraps modulo 2<sup>16</sup> in **both** debug and release builds — it never triggers a fatal error. Subtracting past zero wraps to a large value rather than going negative (`0 - 1` yields `65535`), so prefer a signed type for any value that can legitimately fall below zero.

## Comparison

| Operator | Description           | Result |
| -------- | --------------------- | ------ |
| `==`     | Equal                 | `bool` |
| `!=`     | Not equal             | `bool` |
| `<`      | Less than             | `bool` |
| `<=`     | Less than or equal    | `bool` |
| `>`      | Greater than          | `bool` |
| `>=`     | Greater than or equal | `bool` |

Both operands must have the same type. Comparing `uint16` with another integer type — or with a signed type such as `int16` — is a compile-time error; cast one operand explicitly first.

## Shift and Bitwise

Right shift on an unsigned value is **logical**: the vacated high bits are filled with zeros, never a sign bit. Left shift likewise fills the vacated low bits with zeros.

```rux
let u: uint16 = 20;  // 0b00010100
let l = u << 2;      // 80   logical left shift
let r = u >> 2;      //  5   logical right shift, zero-filled
```

Unsigned types are the natural home for bit manipulation; the operators `&` (AND), `|` (OR), `^` (XOR), and `~` (NOT) are all defined.

```rux
let a: uint16 = 0b1100;  // 12
let b: uint16 = 0b1010;  // 10
let and = a & b;         // 0b1000 = 8
let or  = a | b;         // 0b1110 = 14
let xor = a ^ b;         // 0b0110 = 6
```

## Conversion

Rux performs no implicit numeric conversions — every conversion uses the [`as`](/docs/operations/type-cast) operator. Widening zero-extends, preserving the value; narrowing keeps only the low-order bits; a same-width unsigned↔signed cast reinterprets the bit pattern.

```rux
let x: uint16 = 65535;
let wide = x as uint32;  // 65535  zero-extended, value preserved
let byte = x as uint8;   // 255    narrowed, low 8 bits kept
let s    = x as int16;   // -1     same width, bits reinterpreted
```

## See Also

- [`int16`](/docs/signed/int16) — signed counterpart of the same width
- [Signed Integer Types](/docs/signed/int) — the signed integer family
