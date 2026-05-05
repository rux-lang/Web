# Integer Types

## Overview

Integers are the most fundamental numeric type in Rux. All integer types represent exact whole numbers with no fractional component, stored in [binary](https://en.wikipedia.org/wiki/Binary_number) using a fixed number of bits.

Rux provides two families of integers:

- **Fixed-width types** — `int8` through `int512` and `uint8` through `uint512` — whose size is always the same regardless of the target platform. Use these when the exact bit width matters: data serialisation, hardware registers, cryptography, or protocol implementations.
- **Platform-dependent types** — `int` and `uint` — whose size matches the native word size of the target (32-bit or 64-bit). Use these for general-purpose counting, loop indices, and sizes where portability across widths is acceptable.

All signed integer types use [two's complement](https://en.wikipedia.org/wiki/Two%27s_complement) representation. Unsigned integer types wrap around modulo 2<sup>n</sup> on overflow, where n is the bit width.

## Signed Integer Types

Signed integers can represent both negative and positive values. The most significant bit is the sign bit; the remaining bits encode the magnitude in two's complement form.

| Type     | Size     | Minimum value                                   | Maximum value                                   |
| -------- | -------- | ----------------------------------------------- | ----------------------------------------------- |
| `int8`   | 1 byte   | −2<sup>7</sup> = −128                           | 2<sup>7</sup>−1 = 127                           |
| `int16`  | 2 bytes  | −2<sup>15</sup> = −32,768                       | 2<sup>15</sup>−1 = 32,767                       |
| `int32`  | 4 bytes  | −2<sup>31</sup> = −2,147,483,648                | 2<sup>31</sup>−1 = 2,147,483,647                |
| `int64`  | 8 bytes  | −2<sup>63</sup> ≈ −9.223372 × 10<sup>18</sup>   | 2<sup>63</sup>−1 ≈ 9.223372 × 10<sup>18</sup>   |
| `int128` | 16 bytes | −2<sup>127</sup> ≈ −1.701411 × 10<sup>38</sup>  | 2<sup>127</sup>−1 ≈ 1.701411 × 10<sup>38</sup>  |
| `int256` | 32 bytes | −2<sup>255</sup> ≈ −5.789604 × 10<sup>76</sup>  | 2<sup>255</sup>−1 ≈ 5.789604 × 10<sup>76</sup>  |
| `int512` | 64 bytes | −2<sup>511</sup> ≈ −6.703904 × 10<sup>153</sup> | 2<sup>511</sup>−1 ≈ 6.703904 × 10<sup>153</sup> |

`int8`, `int16`, `int32` and `int64` map directly to native hardware integer instructions on all supported targets. `int128`, `int256` and `int512` are emulated in software on targets that lack native support, so arithmetic on these types may be significantly **slower**.

**Typical use cases:**

- `int8` — small enumeration values, compact storage of byte-ranged quantities.
- `int16` — audio samples, 16-bit packed data formats.
- `int32` — general-purpose integer arithmetic, file offsets on 32-bit systems.
- `int64` — timestamps (nanoseconds since epoch), memory offsets on 64-bit systems.
- `int128` — extended-precision intermediate results, [UUID](https://en.wikipedia.org/wiki/Universally_unique_identifier) arithmetic.
- `int256` / `int512` — cryptographic big-integer arithmetic, elliptic-curve field elements.

## Unsigned Integer Types

Unsigned integers represent non-negative values only. They wrap modulo 2<sup>n</sup> on overflow.

| Type      | Size     | Minimum value | Maximum value                                   |
| --------- | -------- | ------------- | ----------------------------------------------- |
| `uint8`   | 1 byte   | 0             | 2<sup>8</sup>−1 = 255                           |
| `uint16`  | 2 bytes  | 0             | 2<sup>16</sup>−1 = 65,535                       |
| `uint32`  | 4 bytes  | 0             | 2<sup>32</sup>−1 = 4,294,967,295                |
| `uint64`  | 8 bytes  | 0             | 2<sup>64</sup>−1 ≈ 1.844674 × 10<sup>19</sup>   |
| `uint128` | 16 bytes | 0             | 2<sup>128</sup>−1 ≈ 3.402824 × 10<sup>38</sup>  |
| `uint256` | 32 bytes | 0             | 2<sup>256</sup>−1 ≈ 1.157921 × 10<sup>77</sup>  |
| `uint512` | 64 bytes | 0             | 2<sup>512</sup>−1 ≈ 1.340781 × 10<sup>154</sup> |

**Typical use cases:**

- `uint8` — raw byte values, pixel colour channels, binary protocol fields.
- `uint16` — Unicode code units [UTF-16](https://en.wikipedia.org/wiki/UTF-16), port numbers, small counters.
- `uint32` — IPv4 addresses,[CRC32](https://en.wikipedia.org/wiki/Cyclic_redundancy_check) checksums, 32-bit bitmasks.
- `uint64` — memory addresses, 64-bit bitmasks, large file sizes.
- `uint128` — [IPv6](https://en.wikipedia.org/wiki/IPv6) addresses, [GUIDs](https://en.wikipedia.org/wiki/Universally_unique_identifier), 128-bit hash values.
- `uint256` — cryptographic hashes ([SHA-256](https://en.wikipedia.org/wiki/SHA-2) output), Ethereum addresses.
- `uint512` — [SHA-512](https://en.wikipedia.org/wiki/SHA-2) output, large-integer cryptographic primitives.

## Platform-Dependent Types

| Type   | Signed | Size on 32-bit target | Size on 64-bit target |
| ------ | ------ | --------------------- | --------------------- |
| `int`  | Yes    | 4 bytes as `int32`    | 8 bytes as `int64`    |
| `uint` | No     | 4 bytes as `uint32`   | 8 bytes as `uint64`   |

`int` and `uint` match the native pointer width of the compilation target. They are the idiomatic choice for loop indices and counters, collection lengths and indices (the standard library uses `int` for lengths), and pointer-sized offsets and arithmetic.

**Portability note:** Code that assumes a specific width for `int` or `uint` will behave differently on 32-bit and 64-bit targets. When the bit width must be exact — for serialised data, hardware registers, or cross-platform binary protocols — use a fixed-width type instead.

## Default Integer Type

When an integer literal is written without an explicit type annotation, Rux infers its type as `int`:

```rux
let x = 42;            // x : int
let y = -7;            // y : int
const MaxRetries = 5;  // MaxRetries : int
```

`int` is the default because it maps to the most efficient native integer on the target platform and is the type expected by most standard library functions. Override the default with an explicit type annotation or a type suffix on the literal:

```rux
let a: int32 = 42;    // explicit annotation — int32
let b = 42i32;        // type suffix         — int32, same effect
let c: uint8 = 255;   // explicit annotation — uint8
let d = 255u8;        // type suffix         — uint8, same effect
```

If a literal value does not fit in the annotated type, the compiler emits an error at compile time.

## Integer Literals

### Decimal

Standard base-10 notation with no prefix.

```rux
let a = 0;
let b = 42;
let c = 1000000;
let d = -17;
```

### Hexadecimal

Prefix `0x`. Digits `a`, `b`, `c`, `d`, `e`, `f` are accepted in both upper and lower case.

```rux
let color = 0xFF8800;
let mask  = 0x0000FFFF;
let max8  = 0x00ef;
let addr  = 0x0080a3ef;
```

### Octal

Prefix `0o`. Digits `0`–`7` are valid.

```rux
let perms = 0o755;
let mask  = 0o077;
```

### Binary

Prefix `0b`. Only digits `0` and `1` are valid.

```rux
let flags  = 0b10100011;
let enable = 0b1;
let byte   = 0b11111111;
```

<!-- ### Digit Separators

An underscore `_` may appear anywhere inside a numeric literal — after the prefix or between any two digits — to improve readability. Underscores have no effect on the value.

```rux
let million = 1_000_000;
let ipv4    = 0xC0_A8_00_01;    // 192.168.0.1
let bitmask = 0b0000_1111_0000_1111;
let big     = 9_223_372_036_854_775_807;
```
-->

### Type Suffixes

A type suffix attached directly to a numeric literal fixes its type at the call site without requiring a separate annotation. The suffix is written immediately after the last digit (or digit separator) with no whitespace.

**Signed suffixes:**

| Suffix | Type     |
| ------ | -------- |
| `i8`   | `int8`   |
| `i16`  | `int16`  |
| `i32`  | `int32`  |
| `i64`  | `int64`  |
| `i128` | `int128` |
| `i256` | `int256` |
| `i512` | `int512` |
| `i`    | `int`    |

**Unsigned suffixes:**

| Suffix | Type      |
| ------ | --------- |
| `u8`   | `uint8`   |
| `u16`  | `uint16`  |
| `u32`  | `uint32`  |
| `u64`  | `uint64`  |
| `u128` | `uint128` |
| `u256` | `uint256` |
| `u512` | `uint512` |
| `u`    | `uint`    |

```rux
let a = 255u8;          // uint8  — pixel channel value
let b = 1_000i32;       // int32
let c = 0xDEADBEEFu32;  // uint32 — hex with suffix
let d = 0b10101010u8;   // uint8  — binary with suffix
let e = 0o755u16;       // uint16 — octal with suffix
let f = 9223372036854775807i64;  // int64 maximum
let g = 42i;            // int    — explicit platform-dependent signed
let h = 42u;            // uint   — explicit platform-dependent unsigned
```

<!--
Digit separators and suffixes may be combined freely:

```rux
let mask = 0xFF_00_FF_00u32;   // 4 278 255 360
```
-->

If the literal value does not fit in the suffixed type, the compiler emits an error:

```rux
let bad = 256u8;    // error: value 256 does not fit in uint8 (range 0–255)
let ok  = 255u8;    // fine
```

A suffixed literal and an explicit type annotation must agree. Providing both when they conflict is a compile-time error:

```rux
let x: uint16 = 100u8;    // error: suffix type uint8 conflicts with annotation uint16
let y: uint8  = 100u8;    // fine — suffix and annotation agree
let z: uint8  = 100;      // fine — unsuffixed literal, annotation wins
```

## Type Conversion

Rux is strongly typed. There are no implicit numeric conversions — every conversion between integer types must be written explicitly using the `as` keyword.

### Widening (always safe)

Converting to a wider type preserves the value exactly. Signed-to-signed widens using sign extension; unsigned-to-unsigned widens using zero extension.

```rux
let a = 100i8;
let b = a as int32;    // 100  — sign-extended from int8 to int32
let c = b as int64;    // 100  — sign-extended from int32 to int64

let x = 200u8;
let y = x as uint32;   // 200  — zero-extended from uint8 to uint32
```

### Narrowing (truncating)

Converting to a narrower type keeps only the low-order bits of the target width. No panic is raised; the resulting value may differ from the original.

```rux
let big   = 300i32;
let small = big as int8;    // 300 & 0xFF = 44

let wide  = 0xDEADBEEFu32;
let byte  = wide as uint8;  // 0xEF = 239
```

### Conversion Between Signed and Unsigned

Casting between signed and unsigned types of the same width reinterprets the bit pattern without truncation. Positive values that fit in both types are preserved. Negative signed values become large unsigned values and vice versa.

```rux
let s = -1i8;
let u = s as uint8;  // 255  (0xFF reinterpreted as unsigned)

let v = 200u8;
let w = v as int8;   // -56  (0xC8 reinterpreted as two's complement)
```

### Combined widening and sign-family change

When both widening and a sign-family change are needed, a single `as` cast handles both steps: the value is first sign- or zero-extended to the target width, then reinterpreted.

```rux
let s: int8   = -1;
let u: uint32 = s as uint32;  // 0xFFFFFFFF = 4294967295
```

## Arithmetic Operations

| Operator | Description    | Compound assignment |
| -------- | -------------- | ------------------- |
| `+`      | Addition       | `+=`                |
| `-`      | Subtraction    | `-=`                |
| `*`      | Multiplication | `*=`                |
| `/`      | Division       | `/=`                |
| `%`      | Remainder      | `%=`                |
| `**`     | Exponentiation | n/a                 |

```rux
let a = 10;
let b = 3;

let sum  = a + b;   // 13
let diff = a - b;   // 7
let prod = a * b;   // 30
let quot = a / b;   // 3   (truncates toward zero)
let rem  = a % b;   // 1
let pow  = a ** b;  // 1000

var x = 10;
x += 5;  // 15
x -= 3;  // 12
x *= 2;  // 24
x /= 4;  // 6
x %= 4;  // 2
```

**Division and remainder** truncate toward zero. The remainder `a % b` carries the sign of the dividend `a`.

```rux
let q1 =  7 /  2;  //  3
let q2 = -7 /  2;  // -3
let r1 =  7 %  2;  //  1
let r2 = -7 %  2;  // -1
```

**Overflow behaviour:** In debug builds, integer overflow causes a runtime panic. In release builds, both signed and unsigned integers wrap around in two's complement fashion (modulo 2<sup>n</sup>). Write overflow-sensitive code defensively and test it in debug mode before shipping a release build.

## Comparison Operations

| Operator | Description           | Result |
| -------- | --------------------- | ------ |
| `==`     | Equal                 | `bool` |
| `!=`     | Not equal             | `bool` |
| `<`      | Less than             | `bool` |
| `<=`     | Less than or equal    | `bool` |
| `>`      | Greater than          | `bool` |
| `>=`     | Greater than or equal | `bool` |

All comparison operators return a `bool`. Both operands must have the same integer type; comparing integers of different types is a compile-time error and requires an explicit `as` cast.

```rux
let a = 10;
let b = 20;

let eq  = a == b;  // false
let neq = a != b;  // true
let lt  = a < b;   // true
let lte = a <= b;  // true
let gt  = a > b;   // false
let gte = a >= b;  // false
```

**Comparing signed and unsigned types:** Mixing a signed and an unsigned type in the same comparison is a compile-time error. Cast one operand explicitly and consider which semantics are correct for values near the type boundaries.

```rux
let s: int32  = -1;
let u: uint32 = 1;
let bad = s < u;  // error: type mismatch
let ok  = (s as int64) < (u as int64); // safe widening comparison
```

## Bitwise Operations

| Operator | Description | Compound assignment |
| -------- | ----------- | ------------------- |
| `&`      | Bitwise AND | `&=`                |
| `\|`     | Bitwise OR  | `\|=`               |
| `^`      | Bitwise XOR | `^=`                |
| `~`      | Bitwise NOT | n/a                 |

```rux
let a = 0b11001010u8;  // uint8 = 202
let b = 0b10101100u8;  // uint8 = 172

let and_val = a & b;    // 0b1000_1000 = 136
let or_val  = a | b;    // 0b1110_1110 = 238
let xor_val = a ^ b;    // 0b0110_0110 = 102
let not_val = ~a;       // 0b0011_0101 =  53
```

**Bitwise NOT on signed types:** `~` flips every bit. For a signed integer in two's complement this equals `-(x + 1)`.

```rux
let x: int8 = 5;
let y = ~x;  // -6
```

**Common bit-manipulation patterns:**

```rux
var flags: uint32 = 0;
flags |= 1 << 3;     // set bit 3
flags &= ~(1 << 3);  // clear bit 3
flags ^= 1 << 2;     // toggle bit 2
let is_set    = (flags & (1 << 3)) != 0;  // test bit 3
let low_nibble = flags & 0x0F;            // mask low 4 bits
```

## Shift Operations

| Operator | Description | Compound assignment |
| -------- | ----------- | ------------------- |
| `<<`     | Left shift  | `<<=`               |
| `>>`     | Right shift | `>>=`               |

Left shift fills vacated bits on the right with zeros. For unsigned types, right shift fills vacated bits on the left with zeros (**logical shift**). For signed types, right shift fills vacated bits with the sign bit (**arithmetic shift**), preserving the sign of the value.

```rux
let u: uint8 = 0b00010100;  // 20
let s: int8  = -8;          // 0b11111000
let ul = u << 2;  // 0b01010000 = 80 (left shift)
let ur = u >> 2;  // 0b00000101 =  5 (logical right shift — zero-filled)
let sr = s >> 2;  // 0b11111110 = -2 (arithmetic right shift — sign-filled)
```

**Shift amount rules:** The shift amount must be a non-negative integer. A shift amount of zero is a no-op. Shifting by an amount greater than or equal to the bit width of the type is a compile-time or runtime error; it does not silently produce zero.

```rux
let x: uint32 = 1;
let a = x << 31;  // 0x80000000 — valid
let b = x << 32;  // error: shift amount >= bit width
```

**Left shift as fast multiplication, right shift as fast division** (powers of two).

```rux
let val  = 5;
let mul8 = val << 3;  // 40 (5 × 8)
let div4 = val >> 2;  //  1 (5 ÷ 4, truncated)
```

## Recommendations

**Choose fixed-width types for data interchange.** When reading or writing binary data — network packets, file formats, hardware registers — always use explicitly sized types (`uint32`, `int64`, etc.) so the layout is unambiguous regardless of the target platform.

**Use `int` and `uint` for internal indices and counts.** Loop counters, slice indices, and lengths that never leave the program do not need a fixed width. Using `int` gives the compiler the freedom to choose the most efficient representation.

**Never mix signed and unsigned in comparisons or arithmetic without a cast.** The compiler enforces this, but the right fix is to choose a consistent signedness for related variables rather than inserting mechanical casts throughout the code.

**Prefer the narrowest type that communicates your intent.** A `uint8` parameter named `red` tells the reader the valid range is 0–255. This is about expressing meaning, not about saving memory.

**Treat overflow as a bug, not a feature.** Rely on debug-build panics to catch overflow during development. If wraparound arithmetic is intentional (ring counters, checksums), document it with a comment.

**Avoid `int128` and wider in hot loops.** On x86-64 and AArch64, arithmetic on types wider than 64 bits is emulated in software and is typically several times slower than native 64-bit operations. Reserve these types for cryptographic and big-integer code where the precision is genuinely required.

**Use unsigned types for bit manipulation.** Right-shifting a signed negative value performs arithmetic (sign-extending) shift, which is rarely the desired behaviour for bitmask work. Prefer `uint8`, `uint32`, or `uint64` when working with bits.

## Notes

**Two's complement is the only representation.** Rux does not support one's complement or sign-magnitude integers. The minimum value of a signed type has no corresponding positive value of the same type — for example, `int8` minimum is −128 while its maximum is only 127.

**`int128` / `uint128` on common 64-bit targets.** On x86-64 and AArch64, the compiler lowers 128-bit arithmetic to pairs of 64-bit instructions. Operations are correct but roughly 2–4× slower than native 64-bit arithmetic. On 32-bit targets the overhead is larger.

**`int256`, `int512`, and their unsigned counterparts are software-emulated everywhere.** No current mainstream CPU has native 256-bit or 512-bit integer arithmetic. These types are emitted as multi-word software routines and are intended for cryptographic use cases where correctness and portability matter more than raw throughput.

**Overflow behaviour summary:**

| Build mode | Signed overflow                                | Unsigned overflow            |
| ---------- | ---------------------------------------------- | ---------------------------- |
| Debug      | Runtime exception                              | Wraps (modulo 2<sup>n</sup>) |
| Release    | Wraps (modulo 2<sup>n</sup>, two's complement) | Wraps (modulo 2<sup>n</sup>) |

Signed wraparound in release mode is well-defined in Rux (unlike in C/C++), but code that relies on it is almost always a logic error.
