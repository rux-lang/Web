# `uint512`

::: warning
`uint512` is not implemented in the current release.
:::

| Property         | Value                                            |
| ---------------- | ------------------------------------------------ |
| Size             | 64 bytes (512 bits)                              |
| Minimum value    | 0                                                |
| Maximum value    | 2<sup>512</sup>−1 ≈ 1.340781 × 10<sup>154</sup>  |
| Literal suffix   | `u512`                                           |
| Representation   | Binary, wraps modulo 2<sup>512</sup>             |
| Hardware support | Software-emulated on all targets                 |

`uint512` is the widest unsigned integer in Rux — a fixed-width type whose size is identical on every target platform. It stores non-negative values in plain binary and wraps modulo 2<sup>512</sup> on overflow. No mainstream CPU has native 512-bit arithmetic, so every operation is software-emulated; reserve it for the few algorithms that genuinely need this much precision.

## Literals

```rux
let a: uint512 = 1;  // explicit annotation
let b = 42u512;      // type suffix
```

If a literal value does not fit in `uint512`, the compiler emits an error at compile time. See [Literals](/docs/lexical/literals) for decimal, hexadecimal, octal, and binary forms.

## Typical Use Cases

- SHA-512 output
- Large-integer cryptographic primitives

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
let a: uint512 = 10;
let b: uint512 = 3;

let sum  = a + b;   // 13
let quot = a / b;   // 3   truncates toward zero
let rem  = a % b;   // 1   always non-negative
```

Division truncates toward zero. Because unsigned values are never negative, both the quotient and the remainder are always non-negative.

**Overflow.** Unsigned arithmetic wraps modulo 2<sup>512</sup> in **both** debug and release builds — it never triggers a fatal error. Subtracting past zero wraps to a large value rather than going negative (`0 - 1` yields 2<sup>512</sup>−1), so prefer a signed type for any value that can legitimately fall below zero.

## Comparison

| Operator | Description           | Result |
| -------- | --------------------- | ------ |
| `==`     | Equal                 | `bool` |
| `!=`     | Not equal             | `bool` |
| `<`      | Less than             | `bool` |
| `<=`     | Less than or equal    | `bool` |
| `>`      | Greater than          | `bool` |
| `>=`     | Greater than or equal | `bool` |

Both operands must have the same type. Comparing `uint512` with another integer type — or with a signed type such as `int512` — is a compile-time error; cast one operand explicitly first.

## Shift and Bitwise

Right shift on an unsigned value is **logical**: the vacated high bits are filled with zeros, never a sign bit. Left shift likewise fills the vacated low bits with zeros.

```rux
let u: uint512 = 20;  // 0b00010100
let l = u << 2;       // 80   logical left shift
let r = u >> 2;       //  5   logical right shift, zero-filled
```

Unsigned types are the natural home for bit manipulation; the operators `&` (AND), `|` (OR), `^` (XOR), and `~` (NOT) are all defined.

```rux
let a: uint512 = 0b1100;  // 12
let b: uint512 = 0b1010;  // 10
let and = a & b;          // 0b1000 = 8
let or  = a | b;          // 0b1110 = 14
let xor = a ^ b;          // 0b0110 = 6
```

## Conversion

Rux performs no implicit numeric conversions — every conversion uses the [`as`](/docs/operations/type-cast) operator. Narrowing keeps only the low-order bits; a same-width unsigned↔signed cast reinterprets the bit pattern. `uint512` is the widest unsigned type, so there is no wider type to widen into.

```rux
let x: uint512 = 1;
let small = x as uint64;   // 1   narrowed, low 64 bits kept
let s     = x as int512;   // 1   same width, bits reinterpreted
```

## See Also

- [`int512`](/docs/signed/int512) — signed counterpart of the same width
- [Signed Integer Types](/docs/signed/int) — the signed integer family
