# `uint32`

| Property         | Value                                |
| ---------------- | ------------------------------------ |
| Size             | 4 bytes (32 bits)                    |
| Minimum value    | 0                                    |
| Maximum value    | 2<sup>32</sup>−1 = 4,294,967,295     |
| Literal suffix   | `u32`                                |
| Representation   | Binary, wraps modulo 2<sup>32</sup>  |
| Hardware support | Native on all supported targets      |

`uint32` is the standard unsigned integer for 32-bit values — a fixed-width type whose size is identical on every target platform. It stores non-negative values in plain binary and wraps modulo 2<sup>32</sup> on overflow.

## Literals

```rux
let a: uint32 = 4294967295;  // explicit annotation
let b = 0xDEADBEEFu32;       // type suffix, hex
```

If a literal value does not fit in `uint32`, the compiler emits an error at compile time. See [Literals](/docs/lexical/literals) for decimal, hexadecimal, octal, and binary forms.

## Typical Use Cases

- IPv4 addresses
- CRC32 checksums and 32-bit bitmasks
- Hash values and random seeds

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
let a: uint32 = 10;
let b: uint32 = 3;

let sum  = a + b;   // 13
let quot = a / b;   // 3   truncates toward zero
let rem  = a % b;   // 1   always non-negative
```

Division truncates toward zero. Because unsigned values are never negative, both the quotient and the remainder are always non-negative.

**Overflow.** Unsigned arithmetic wraps modulo 2<sup>32</sup> in **both** debug and release builds — it never triggers a fatal error. Subtracting past zero wraps to a large value rather than going negative (`0 - 1` yields `4294967295`), so prefer a signed type for any value that can legitimately fall below zero.

## Comparison

| Operator | Description           | Result |
| -------- | --------------------- | ------ |
| `==`     | Equal                 | `bool` |
| `!=`     | Not equal             | `bool` |
| `<`      | Less than             | `bool` |
| `<=`     | Less than or equal    | `bool` |
| `>`      | Greater than          | `bool` |
| `>=`     | Greater than or equal | `bool` |

Both operands must have the same type. Comparing `uint32` with another integer type — or with a signed type such as `int32` — is a compile-time error; cast one operand explicitly first.

## Shift and Bitwise

Right shift on an unsigned value is **logical**: the vacated high bits are filled with zeros, never a sign bit. Left shift likewise fills the vacated low bits with zeros.

```rux
let u: uint32 = 20;  // 0b00010100
let l = u << 2;      // 80   logical left shift
let r = u >> 2;      //  5   logical right shift, zero-filled
```

Unsigned types are the natural home for bit manipulation; the operators `&` (AND), `|` (OR), `^` (XOR), and `~` (NOT) are all defined.

```rux
let a: uint32 = 0b1100;  // 12
let b: uint32 = 0b1010;  // 10
let and = a & b;         // 0b1000 = 8
let or  = a | b;         // 0b1110 = 14
let xor = a ^ b;         // 0b0110 = 6
```

## Conversion

Rux performs no implicit numeric conversions — every conversion uses the [`as`](/docs/operations/type-cast) operator. Widening zero-extends, preserving the value; narrowing keeps only the low-order bits; a same-width unsigned↔signed cast reinterprets the bit pattern.

```rux
let x: uint32 = 0xDEADBEEF;
let wide = x as uint64;  // 0xDEADBEEF  zero-extended, value preserved
let byte = x as uint8;   // 0xEF = 239  narrowed, low 8 bits kept
let s    = x as int32;   // -559038737  same width, bits reinterpreted
```

## See Also

- [`int32`](/docs/signed/int32) — signed counterpart of the same width
- [Signed Integer Types](/docs/signed/int) — the signed integer family
