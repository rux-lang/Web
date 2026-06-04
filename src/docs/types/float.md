# Floating-Point Types

::: tip
`float8`, `float16`, `float80`, `float128`, `float256`, and `float512` are not implemented in the current release.
:::

## Overview

Rux provides a comprehensive set of [IEEE 754](https://en.wikipedia.org/wiki/IEEE_754)-compliant floating-point primitive types, spanning from compact 8-bit representations to extended 512-bit precision. All float types are value types stored on the stack by default; heap allocation occurs only when boxed or placed inside a reference type.

Floating-point arithmetic in Rux follows **IEEE 754-2019** semantics unless explicitly configured otherwise via compiler flags. This means results are deterministic, rounding modes are well-defined, and special values (`Inf`, `-Inf`, `NaN`) are natively supported across all float widths.

```rux
let x: float32 = 3.14;
let y: float64 = 2.718281828459045;
let z: float   = 1.0;  // defaults to float64
```

## Float Types

Rux defines eight distinct float types. Each type maps to a fixed-width IEEE 754 (or extended) format:

| Type       | Size     | Approximate range                                       | Decimal precision |
| ---------- | -------- | ------------------------------------------------------- | ----------------- |
| `float8`   | 1 byte   | ±1.0 × 10<sup>-2</sup> to ±2.5 × 10<sup>1</sup>         | ~1-2 digit        |
| `float16`  | 2 bytes  | ±6.1 × 10<sup>-5</sup> to ±6.5 × 10<sup>4</sup>         | ~3-4 digits       |
| `float32`  | 4 bytes  | ±1.2 × 10<sup>-38</sup> to ±3.4 × 10<sup>38</sup>       | ~7 digits         |
| `float64`  | 8 bytes  | ±2.2 × 10<sup>-308</sup> to ±1.8 × 10<sup>308</sup>     | ~15–16 digits     |
| `float80`  | 10 bytes | ±3.4 × 10<sup>-308</sup> to ±1.8 × 10<sup>308</sup>     | ~18–19 digits     |
| `float128` | 16 bytes | ±3.4 × 10<sup>-4932</sup> to ±1.2 × 10<sup>4932</sup>   | ~33-34 digits     |
| `float256` | 32 bytes | ±1.1 × 10<sup>-78913</sup> to ±1.6 × 10<sup>78913</sup> | ~71-72 digits     |
| `float512` | 64 bytes | ±1.7 × 10<sup>-78913</sup> to ±1.3 × 10<sup>78913</sup> | ~148-150 digits   |

### `float8`

Minimal precision; intended for machine-learning weight storage, lookup tables, and other scenarios where memory density outweighs accuracy requirements. Not suitable for general arithmetic.

```rux
let w: float8 = 1.5;
```

> ⚠️ `float8` arithmetic is subject to heavy quantization error. Avoid in numerical algorithms.

### `float16`

Half-precision. Commonly used in GPU compute kernels, graphics pipelines, and ML inference. Arithmetic operations may be emulated in software on CPU targets that lack native FP16 instructions.

```rux
let half: float16 = 0.0625;
```

### `float32`

Single-precision. The standard type for graphics, game physics, signal processing, and any domain where ~7 significant digits are sufficient.

```rux
let pi: float32 = 3.1415927;
```

### `float64`

Double-precision. The default float type in Rux. Suitable for scientific computing, financial calculations, and most general-purpose work where precision matters.

```rux
let e: float64 = 2.718281828459045;
```

### `float80`

Extended-precision, matching the x87 FPU 80-bit format. Provides extra guard bits during intermediate calculations. Available only on targets that support it; will fall back to `float128` on unsupported architectures.

```rux
let precise: float80 = 1.234567890123456789;
```

### `float128`

Quadruple-precision according to IEEE 754. Useful for compensated summation, high-accuracy numerical integration, and as a reference implementation when validating lower-precision algorithms. Software-emulated on most hardware.

```rux
let quad: float128 = 1.0f128;  // suffix denotes float128 literal
```

### `float256`

Octuple-precision. Intended for symbolic mathematics, cryptographic applications, and extreme-precision scientific work. Always software-emulated; expect significant performance overhead.

```rux
let ultra: float256 = 1.0f256;  // suffix denotes float256 literal
```

### `float512`

Maximum-precision float in Rux. Reserved for specialized research, arbitrary-precision scaffolding, and long-running simulations where error accumulation must be tightly bounded. Always software-emulated; not recommended for hot paths.

```rux
let ext: float512 = 1.0e512  // explicit type annotation required
```

## Default Float Type

When a floating-point literal is written without an explicit type annotation, Rux infers `float64`:

```rux
let a = 1.0;         // float64
let b = 3.14;        // float64
let c: float = 0.5;  // float is an alias for float64
```

`float` is a built-in type alias:

```rux
type float = float64;  // compiler intrinsic alias
```

To select a different default, use an explicit annotation or a literal suffix:

```rux
let a: float32 = 1.0;
let b = 1.0f32;   // float32 via suffix
let c = 1.0f16;   // float16 via suffix
let d = 1.0f128;  // float128 via suffix
```

## Float Literals

### Decimal Literals

```rux
let a = 1.0;
let b = -0.5;
let c = 3.141592653589793;
```

### Scientific Notation

```rux
let avogadro = 6.022e23;   // 6.022 × 10²³
let planck   = 6.626e-34;  // 6.626 × 10⁻³⁴
let big      = 1.5E+10;
```

### Literal Suffixes

| Suffix   | Type       |
| -------- | ---------- |
| `f8`     | `float8`   |
| `f16`    | `float16`  |
| `f32`    | `float32`  |
| `f64`    | `float64`  |
| `f80`    | `float80`  |
| `f128`   | `float128` |
| `f256`   | `float256` |
| _(none)_ | `float64`  |

```rux
let a = 1.0f32;   // float32
let b = 1.0f16;   // float16
let c = 1.0f128;  // float128
```

## Type Conversion

### Implicit Widening

Rux allows implicit widening conversions where no precision is lost:

```rux
let a: float32 = 1.5;
let b: float64 = a;   // OK — widening, implicit
let c: float128 = b;  // OK — widening, implicit
```

Widening order: `float8` → `float16` → `float32` → `float64` → `float80` → `float128` → `float256` → `float512`

### Explicit Narrowing

Narrowing conversions must be explicit to prevent silent precision loss:

```rux
let a: float64 = 3.141592653589793;
let b: float32 = a as float32;  // explicit cast required
let c: float16 = a as float16;  // explicit cast required
```

Casting to a narrower type rounds to nearest (ties to even) by default.

### Conversion Between Float and Integer Types

```rux
let f: float64 = 42.9;
let i: int32   = f as int32;   // truncates toward zero → 42

let n: int64  = 100;
let g: float64 = n as float64;  // widening int→float, implicit
```

> ⚠️ Casting `NaN` or `Inf` to an integer type produces **implementation-defined behavior** and will trigger a runtime panic in debug builds.

## Arithmetic Operations

All standard arithmetic operators are defined for float types. Mixed-type expressions require explicit casts.

### Operators

| Operator | Description        | Example       |
| -------- | ------------------ | ------------- |
| `+`      | Addition           | `1.0 + 2.0`   |
| `-`      | Subtraction        | `5.0 - 3.0`   |
| `*`      | Multiplication     | `2.0 * 3.0`   |
| `/`      | Division           | `10.0 / 4.0`  |
| `%`      | Floating remainder | `5.5 % 2.0`   |
| `-`      | Unary negation     | `-x`          |
| `**`     | Exponentiation     | `2.0 ** 10.0` |

```rux
let a: float64 = 10.0;
let b: float64 = 3.0;

let sum  = a + b;   // 13.0
let diff = a - b;   // 7.0
let prod = a * b;   // 30.0
let quot = a / b;   // 3.333...
let rem  = a % b;   // 1.0
let pow  = a ** b;  // 1000.0
```

### Division Behavior

```rux
1.0 / 0.0   // → +Inf (positive infinity)
-1.0 / 0.0  // → -Inf (negative infinity)
0.0 / 0.0   // → NaN
```

> Division by zero does **not** throw exception; it produces `Inf` or `NaN` per IEEE 754.

### Compound Assignment

```rux
var x: float64 = 10.0;
x += 5.0;   // 15.0
x -= 3.0;   // 12.0
x *= 2.0;   // 24.0
x /= 4.0;   // 6.0
x **= 2.0;  // 36.0
```

## Comparison Operations

### Standard Comparisons

```rux
let a: float64 = 1.0;
let b: float64 = 2.0;

a == b  // false
a != b  // true
a <  b  // true
a <= b  // true
a >  b  // false
a >= b  // false
```

### NaN Comparison Rules

All comparisons involving `NaN` return `false` — including equality with itself:

```rux
let n = Float.NaN;

n == n    // false  ← NaN is never equal to itself
n != n    // true
n <  1.0  // false
n >  1.0  // false
```

Always use `IsNaN()` to check for `NaN`:

```rux
if IsNaN(value)
{
    // Handle NaN case
}
```

## Best Practices, Common Pitfalls & Recommendations

### ✅ Choose the Right Precision

- Use **`float32`** for graphics, physics simulations, and ML model weights where memory bandwidth matters.
- Use **`float64`** (the default) for general-purpose numeric code, scientific work, and financial totals.
- Reserve **`float128`+** for reference implementations, symbolic math, or when validating lower-precision algorithms.
- Avoid **`float8`** and **`float16`** outside of hardware-accelerated contexts (GPU, neural accelerators).

### ✅ Never Use `==` on Computed Floats

```rux
// ❌ Unreliable
let value = 0.1 + 0.2;
if (value == 0.3) {

}

// ✅ Reliable
let value = 0.1 + 0.2;
if (Abs(value - 0.3) < epsilon) {

}
```

### ✅ Always Handle NaN Explicitly

```rux
// ❌ Silently wrong — NaN comparisons always return false
if (result < threshold) {

}

// ✅ Explicit
if (Float.IsNaN(result)) {
    HandleError()
} else if (result < threshold) {

}
```

### ✅ Prefer `Math.Fma()` for Precision-Critical Multiply-Add

```rux
// ❌ Two rounding errors
let r = a * b + c;

// ✅ One rounding error (fused multiply-add)
let r = Math.Fma(a, b, c);
```

### ✅ Be Aware of Catastrophic Cancellation

Subtracting two nearly equal numbers can cause massive relative error:

```rux
let a: float64 = 1.000000001;
let b: float64 = 1.000000000;
let diff = a - b;  // only 1 significant bit remains accurate
```

Use compensated summation (Kahan) or higher-precision intermediates when needed.

### ✅ Use Literal Suffixes for Clarity

```rux
// ❌ Ambiguous — requires reading the annotation
let x = 1.0;

// ✅ Self-documenting
let x = 1.0f32;
```

### ✅ Avoid Mixed-Width Arithmetic Without Intent

Mixed expressions silently widen:

```rux
let a: float32 = 1.0f32;
let b: float64 = 2.0;

// a is widened to float64 before addition
let c = a + b;  // float64
```

Be explicit when mixing types to document intent.

### ⚠️ Infinity Propagates

```rux
let inf = 1.0 / 0.0;
inf + 1.0     // Inf
inf * -1.0    // -Inf
inf - inf     // NaN, be careful
inf * 0.0     // NaN, be careful
```

### ⚠️ Performance of Wide Floats

`float128`, `float256`, and `float512` are software-emulated on virtually all current hardware. Expect 10–100× slowdowns compared to `float64`. Profile before committing to wide floats in hot paths.

## Notes

### IEEE 754 Compliance

- `float16` through `float128` are fully IEEE 754-2019 compliant.
- `float80` follows the Intel 80-bit extended format (not a standard IEEE 754 binary format).
- `float8` follows the **E4M3** variant (4 exponent bits, 3 mantissa bits) common in ML frameworks; behavior at the boundary differs slightly from standard IEEE 754 subnormals.
- `float256` and `float512` are Rux extensions beyond the IEEE 754-2019 standard; they use the same structural rules (sign, biased exponent, significant) but are not standardized externally.
