# Primitive Data Types

A consolidated summary of every built-in primitive type in Rux, grouped by family. These names are **predefined identifiers** — some are compiler-provided aliases — not [keywords](/docs/lexical/keywords); they live in the type namespace. Each entry links to its full page.

In the **Status** column, ✓ marks types available in the current release; **Planned** marks types that are specified but not yet implemented.

## Signed Integers

| Type                            | Size         | Range                                | Suffix | Status  |
| ------------------------------- | ------------ | ------------------------------------ | ------ | ------- |
| [`int`](/docs/signed/int)       | 4 or 8 bytes | target-dependent (`int32` / `int64`) | `i`    | ✓       |
| [`int8`](/docs/signed/int8)     | 1 byte       | −128 … 127                           | `i8`   | ✓       |
| [`int16`](/docs/signed/int16)   | 2 bytes      | −32,768 … 32,767                     | `i16`  | ✓       |
| [`int32`](/docs/signed/int32)   | 4 bytes      | −2,147,483,648 … 2,147,483,647       | `i32`  | ✓       |
| [`int64`](/docs/signed/int64)   | 8 bytes      | ±9.22 × 10<sup>18</sup>              | `i64`  | ✓       |
| [`int128`](/docs/signed/int128) | 16 bytes     | ±1.70 × 10<sup>38</sup>              | `i128` | Planned |
| [`int256`](/docs/signed/int256) | 32 bytes     | ±5.79 × 10<sup>76</sup>              | `i256` | Planned |
| [`int512`](/docs/signed/int512) | 64 bytes     | ±6.70 × 10<sup>153</sup>             | `i512` | Planned |

## Unsigned Integers

| Type                                | Size         | Range                                  | Suffix | Status  |
| ----------------------------------- | ------------ | -------------------------------------- | ------ | ------- |
| [`uint`](/docs/unsigned/uint)       | 4 or 8 bytes | target-dependent (`uint32` / `uint64`) | `u`    | ✓       |
| [`uint8`](/docs/unsigned/uint8)     | 1 byte       | 0 … 255                                | `u8`   | ✓       |
| [`uint16`](/docs/unsigned/uint16)   | 2 bytes      | 0 … 65,535                             | `u16`  | ✓       |
| [`uint32`](/docs/unsigned/uint32)   | 4 bytes      | 0 … 4,294,967,295                      | `u32`  | ✓       |
| [`uint64`](/docs/unsigned/uint64)   | 8 bytes      | 0 … 1.84 × 10<sup>19</sup>             | `u64`  | ✓       |
| [`uint128`](/docs/unsigned/uint128) | 16 bytes     | 0 … 3.40 × 10<sup>38</sup>             | `u128` | Planned |
| [`uint256`](/docs/unsigned/uint256) | 32 bytes     | 0 … 1.16 × 10<sup>77</sup>             | `u256` | Planned |
| [`uint512`](/docs/unsigned/uint512) | 64 bytes     | 0 … 1.34 × 10<sup>154</sup>            | `u512` | Planned |

## Floating-Point

| Type                                  | Size     | Format             | Approx. magnitude           | Suffix | Status  |
| ------------------------------------- | -------- | ------------------ | --------------------------- | ------ | ------- |
| [`float`](/docs/floating/float)       | 8 bytes  | alias of `float64` | ±1.8 × 10<sup>308</sup>     | —      | ✓       |
| [`float8`](/docs/floating/float8)     | 1 byte   | E4M3               | ±4.5 × 10<sup>2</sup>       | `f8`   | Planned |
| [`float16`](/docs/floating/float16)   | 2 bytes  | IEEE 754 binary16  | ±6.5 × 10<sup>4</sup>       | `f16`  | Planned |
| [`float32`](/docs/floating/float32)   | 4 bytes  | IEEE 754 binary32  | ±3.4 × 10<sup>38</sup>      | `f32`  | ✓       |
| [`float64`](/docs/floating/float64)   | 8 bytes  | IEEE 754 binary64  | ±1.8 × 10<sup>308</sup>     | `f64`  | ✓       |
| [`float80`](/docs/floating/float80)   | 10 bytes | x87 extended       | ±1.2 × 10<sup>4932</sup>    | `f80`  | Planned |
| [`float128`](/docs/floating/float128) | 16 bytes | IEEE 754 binary128 | ±1.2 × 10<sup>4932</sup>    | `f128` | Planned |
| [`float256`](/docs/floating/float256) | 32 bytes | Rux extension      | ±1.6 × 10<sup>78913</sup>   | `f256` | Planned |
| [`float512`](/docs/floating/float512) | 64 bytes | Rux extension      | ±2.0 × 10<sup>1262611</sup> | `f512` | Planned |

## Boolean

| Type                               | Size     | Values           | Status  |
| ---------------------------------- | -------- | ---------------- | ------- |
| [`bool`](/docs/boolean/bool)       | 1 byte   | alias of `bool8` | ✓       |
| [`bool8`](/docs/boolean/bool8)     | 1 byte   | `false` / `true` | ✓       |
| [`bool16`](/docs/boolean/bool16)   | 2 bytes  | `false` / `true` | ✓       |
| [`bool32`](/docs/boolean/bool32)   | 4 bytes  | `false` / `true` | ✓       |
| [`bool64`](/docs/boolean/bool64)   | 8 bytes  | `false` / `true` | Planned |
| [`bool128`](/docs/boolean/bool128) | 16 bytes | `false` / `true` | Planned |
| [`bool256`](/docs/boolean/bool256) | 32 bytes | `false` / `true` | Planned |
| [`bool512`](/docs/boolean/bool512) | 64 bytes | `false` / `true` | Planned |

## Character

| Type                                 | Size     | Range / Coverage                   | Status  |
| ------------------------------------ | -------- | ---------------------------------- | ------- |
| [`char`](/docs/character/char)       | 4 bytes  | alias of `char32`                  | ✓       |
| [`char8`](/docs/character/char8)     | 1 byte   | U+0000 – U+00FF (ASCII / Latin-1)  | ✓       |
| [`char16`](/docs/character/char16)   | 2 bytes  | U+0000 – U+FFFF (BMP)              | ✓       |
| [`char32`](/docs/character/char32)   | 4 bytes  | U+0000 – U+10FFFF (all Unicode)    | ✓       |
| [`char64`](/docs/character/char64)   | 8 bytes  | 0 – 2<sup>64</sup>−1 (no Unicode)  | Planned |
| [`char128`](/docs/character/char128) | 16 bytes | 0 – 2<sup>128</sup>−1 (no Unicode) | Planned |
| [`char256`](/docs/character/char256) | 32 bytes | 0 – 2<sup>256</sup>−1 (no Unicode) | Planned |
| [`char512`](/docs/character/char512) | 64 bytes | 0 – 2<sup>512</sup>−1 (no Unicode) | Planned |

## Defaults and Aliases

- An unsuffixed integer literal is inferred as [`int`](/docs/signed/int); an unsuffixed floating-point literal is inferred as [`float64`](/docs/floating/float64).
- [`int`](/docs/signed/int) and [`uint`](/docs/unsigned/uint) track the target's pointer width — `int32`/`uint32` on 32-bit targets, `int64`/`uint64` on 64-bit targets.
- [`float`](/docs/floating/float) → `float64`, [`bool`](/docs/boolean/bool) → `bool8`, and [`char`](/docs/character/char) → `char32` are compiler-provided aliases (see [Built-in Aliases](/docs/aliases/builtin)).
- [`byte`](/docs/unsigned/uint8) is a compiler-provided alias for [`uint8`](/docs/unsigned/uint8) — a clearer spelling for raw 8-bit byte values.
- Rux performs no implicit numeric conversions; every cross-type conversion uses the [`as`](/docs/operations/type-cast) operator.
