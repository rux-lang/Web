# `uint`

| Property         | Value                                                                             |
| ---------------- | --------------------------------------------------------------------------------- |
| Size             | 4 bytes on 32-bit targets (as `uint32`); 8 bytes on 64-bit targets (as `uint64`)  |
| Signed           | No                                                                                |
| Literal suffix   | `u`                                                                               |
| Representation   | Binary, wraps modulo 2<sup>n</sup>                                                |
| Hardware support | Native on all supported targets                                                   |

`uint` is the platform-dependent unsigned integer: its width matches the native pointer width of the compilation target. Use it for sizes, masks, and addresses that are naturally non-negative and never leave the program. It stores values in plain binary and wraps modulo 2<sup>n</sup> on overflow, where _n_ is the target width; when the exact bit width matters, pick a fixed-width type instead.

## Literals

```rux
let a: uint = 42;  // explicit annotation
let b = 42u;       // type suffix
```

Unlike [`int`](/docs/signed/int), `uint` is never inferred: an unannotated, unsuffixed integer literal is always `int`, so request `uint` with an explicit annotation or the `u` suffix. See [Literals](/docs/lexical/literals) for decimal, hexadecimal, octal, and binary forms.

## Typical Use Cases

- Memory sizes and pointer-width arithmetic
- Word-sized bitmasks
- Interop with C `size_t`-style parameters

## Portability

Code that assumes a specific width for `uint` will behave differently on 32-bit and 64-bit targets. When the bit width must be exact — serialised data, hardware registers, cross-platform binary protocols — use a fixed-width type such as [`uint32`](./uint32) or [`uint64`](./uint64) instead.

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
let a: uint = 10;
let b: uint = 3;

let sum  = a + b;   // 13
let quot = a / b;   // 3   truncates toward zero
let rem  = a % b;   // 1   always non-negative
```

Division truncates toward zero. Because unsigned values are never negative, both the quotient and the remainder are always non-negative.

**Overflow.** Unsigned arithmetic wraps modulo 2<sup>n</sup> (where _n_ is the target width) in **both** debug and release builds — it never triggers a fatal error. Subtracting past zero wraps to a large value rather than going negative (`0 - 1` yields the maximum), so prefer a signed type for any value that can legitimately fall below zero.

## Comparison

| Operator | Description           | Result |
| -------- | --------------------- | ------ |
| `==`     | Equal                 | `bool` |
| `!=`     | Not equal             | `bool` |
| `<`      | Less than             | `bool` |
| `<=`     | Less than or equal    | `bool` |
| `>`      | Greater than          | `bool` |
| `>=`     | Greater than or equal | `bool` |

Both operands must have the same type. Comparing `uint` with a fixed-width type such as `uint32`, or with a signed type such as `int`, is a compile-time error; cast one operand explicitly first.

## Shift and Bitwise

Right shift on an unsigned value is **logical**: the vacated high bits are filled with zeros, never a sign bit. Left shift likewise fills the vacated low bits with zeros.

```rux
let u: uint = 20;  // 0b00010100
let l = u << 2;    // 80   logical left shift
let r = u >> 2;    //  5   logical right shift, zero-filled
```

Unsigned types are the natural home for bit manipulation; the operators `&` (AND), `|` (OR), `^` (XOR), and `~` (NOT) are all defined.

```rux
let a: uint = 0b1100;  // 12
let b: uint = 0b1010;  // 10
let and = a & b;       // 0b1000 = 8
let or  = a | b;       // 0b1110 = 14
let xor = a ^ b;       // 0b0110 = 6
```

## Conversion

Rux performs no implicit numeric conversions — every conversion uses the [`as`](/docs/operations/type-cast) operator. Because `uint` has a target-dependent width, always cast to a fixed-width type before serialising or comparing across platforms.

```rux
let n: uint = 1000;
let fixed = n as uint32;  // pin to a known width
let s     = n as int;     // same width, bits reinterpreted
```

## See Also

- [`int`](/docs/signed/int) — signed counterpart of the same width
- [`uint32`](./uint32) / [`uint64`](./uint64) — the fixed-width types `uint` maps to
