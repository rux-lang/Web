# `uint128`

::: warning
`uint128` is not implemented in the current release.
:::

| Property         | Value                                                                       |
| ---------------- | --------------------------------------------------------------------------- |
| Size             | 16 bytes (128 bits)                                                         |
| Minimum value    | 0                                                                           |
| Maximum value    | 2<sup>128</sup>−1 ≈ 3.402824 × 10<sup>38</sup>                             |
| Literal suffix   | `u128`                                                                      |
| Representation   | Binary, wraps modulo 2<sup>128</sup>                                        |
| Hardware support | Emulated as pairs of 64-bit instructions on x86-64 / AArch64 (≈2–4× slower) |

`uint128` is an extended-precision unsigned integer — a fixed-width type whose size is identical on every target platform. It stores non-negative values in plain binary and wraps modulo 2<sup>128</sup> on overflow. No mainstream CPU has native 128-bit arithmetic, so operations are lowered to pairs of 64-bit instructions and run several times slower than native types — reserve `uint128` for code that genuinely needs the extra range.

## Literals

```rux
let a: uint128 = 340282366920938463463374607431768211455;
let b = 42u128;  // type suffix
```

If a literal value does not fit in `uint128`, the compiler emits an error at compile time. See [Literals](/docs/lexical/literals) for decimal, hexadecimal, octal, and binary forms.

## Typical Use Cases

- IPv6 addresses
- GUIDs / UUIDs
- 128-bit hash values

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
let a: uint128 = 10;
let b: uint128 = 3;

let sum  = a + b;   // 13
let quot = a / b;   // 3   truncates toward zero
let rem  = a % b;   // 1   always non-negative
```

Division truncates toward zero. Because unsigned values are never negative, both the quotient and the remainder are always non-negative.

**Overflow.** Unsigned arithmetic wraps modulo 2<sup>128</sup> in **both** debug and release builds — it never triggers a fatal error. Subtracting past zero wraps to a large value rather than going negative (`0 - 1` yields 2<sup>128</sup>−1), so prefer a signed type for any value that can legitimately fall below zero.

## Comparison

| Operator | Description           | Result |
| -------- | --------------------- | ------ |
| `==`     | Equal                 | `bool` |
| `!=`     | Not equal             | `bool` |
| `<`      | Less than             | `bool` |
| `<=`     | Less than or equal    | `bool` |
| `>`      | Greater than          | `bool` |
| `>=`     | Greater than or equal | `bool` |

Both operands must have the same type. Comparing `uint128` with another integer type — or with a signed type such as `int128` — is a compile-time error; cast one operand explicitly first.

## Shift and Bitwise

Right shift on an unsigned value is **logical**: the vacated high bits are filled with zeros, never a sign bit. Left shift likewise fills the vacated low bits with zeros.

```rux
let u: uint128 = 20;  // 0b00010100
let l = u << 2;       // 80   logical left shift
let r = u >> 2;       //  5   logical right shift, zero-filled
```

Unsigned types are the natural home for bit manipulation; the operators `&` (AND), `|` (OR), `^` (XOR), and `~` (NOT) are all defined.

```rux
let a: uint128 = 0b1100;  // 12
let b: uint128 = 0b1010;  // 10
let and = a & b;          // 0b1000 = 8
let or  = a | b;          // 0b1110 = 14
let xor = a ^ b;          // 0b0110 = 6
```

## Conversion

Rux performs no implicit numeric conversions — every conversion uses the [`as`](/docs/operations/type-cast) operator. Widening zero-extends, preserving the value; narrowing keeps only the low-order bits; a same-width unsigned↔signed cast reinterprets the bit pattern.

```rux
let x: uint128 = 1;
let wide  = x as uint256;  // 1   zero-extended, value preserved
let small = x as uint64;   // 1   narrowed, low 64 bits kept
let s     = x as int128;   // 1   same width, bits reinterpreted
```

## See Also

- [`int128`](/docs/signed/int128) — signed counterpart of the same width
- [Signed Integer Types](/docs/signed/int) — the signed integer family
