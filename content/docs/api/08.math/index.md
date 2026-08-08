---
navigation:
  title: Overview
---

# Math Package

::warning
**Unstable API**\
The package is under active development and its API is **not yet stable**. Names, signatures, and behavior may change between releases, and this documentation will be updated to match.
::

The package provides mathematical constants and floating-point functions.

**Package:** `Math`

**Source:** [github.com/rux-lang/Rux/tree/main/Packages/Math](https://github.com/rux-lang/Rux/tree/main/Packages/Math)

Every function is provided for both `float64` and `float32`. Pass `float64` arguments to get a `float64` result, or `float32` for a `float32` result — each overload rounds only once, so the `float32` result is as accurate as the `float64` computation allows.

```rux
import Math::{ Pi, Pow, Sin, Sqrt };
import Io::PrintLine;

func Main() -> int {
    PrintLine(Sqrt(2.0));      // 1.4142135623730951
    PrintLine(Pow(2.0, 10.0)); // 1024
    PrintLine(Sin(Pi / 2.0));  // 1
    return 0;
}
```

## Installation

```sh
rux add Math
rux install
```

## Constants

| Name        | Type      | Value     | Description                                        |
| ----------- | --------- | --------- | -------------------------------------------------- |
| `Pi`        | `float64` | 3.14159…  | Ratio of a circle's circumference to its diameter. |
| `Tau`       | `float64` | 6.28318…  | 2 × `Pi`, a full turn in radians.                  |
| `HalfPi`    | `float64` | 1.57079…  | `Pi` / 2.                                          |
| `QuarterPi` | `float64` | 0.78539…  | `Pi` / 4.                                          |
| `InvPi`     | `float64` | 0.31830…  | 1 / `Pi`.                                          |
| `InvTau`    | `float64` | 0.15915…  | 1 / `Tau`.                                         |
| `E`         | `float64` | 2.71828…  | Euler's number, the base of the natural logarithm. |
| `Log2E`     | `float64` | 1.44269…  | log₂(e).                                           |
| `Log10E`    | `float64` | 0.43429…  | log₁₀(e).                                          |
| `Ln2`       | `float64` | 0.69314…  | ln(2).                                             |
| `Ln10`      | `float64` | 2.30258…  | ln(10).                                            |
| `Sqrt2`     | `float64` | 1.41421…  | √2.                                                |
| `InvSqrt2`  | `float64` | 0.70710…  | 1 / √2.                                            |
| `RadPerDeg` | `float64` | 0.01745…  | `Pi` / 180, radians per degree.                    |
| `DegPerRad` | `float64` | 57.29577… | 180 / `Pi`, degrees per radian.                    |

```rux
import Math::Pi;

let circumference = 2.0 * Pi * radius;
```

## Functions

### Elementary operations

| Function                        | Description                                         |
| ------------------------------- | --------------------------------------------------- |
| [`Abs`](/docs/api/math/abs)     | Absolute value.                                     |
| [`Min`](/docs/api/math/min)     | The smaller of two values.                          |
| [`Max`](/docs/api/math/max)     | The larger of two values.                           |
| [`Mod`](/docs/api/math/mod)     | Floating-point remainder, signed like the dividend. |
| [`Pow`](/docs/api/math/pow)     | Raise a base to an exponent.                        |
| [`Sqrt`](/docs/api/math/sqrt)   | Square root.                                        |
| [`Cbrt`](/docs/api/math/cbrt)   | Cube root, defined for negative arguments too.      |
| [`Hypot`](/docs/api/math/hypot) | √(x² + y²), without spurious overflow or underflow. |

### Rounding

| Function                        | Description                                        |
| ------------------------------- | -------------------------------------------------- |
| [`Floor`](/docs/api/math/floor) | Round down to the nearest integer value.           |
| [`Ceil`](/docs/api/math/ceil)   | Round up to the nearest integer value.             |
| [`Round`](/docs/api/math/round) | Round to the nearest integer, ties away from zero. |
| [`Trunc`](/docs/api/math/trunc) | Round toward zero.                                 |

### Exponential and logarithmic

| Function                        | Description          |
| ------------------------------- | -------------------- |
| [`Exp`](/docs/api/math/exp)     | e raised to a power. |
| [`Exp2`](/docs/api/math/exp2)   | 2 raised to a power. |
| [`Log`](/docs/api/math/log)     | Natural logarithm.   |
| [`Log2`](/docs/api/math/log2)   | Base-2 logarithm.    |
| [`Log10`](/docs/api/math/log10) | Base-10 logarithm.   |

### Trigonometry

| Function                          | Description                       |
| --------------------------------- | --------------------------------- |
| [`Sin`](/docs/api/math/sin)       | Sine of an angle in radians.      |
| [`Cos`](/docs/api/math/cos)       | Cosine of an angle in radians.    |
| [`Tan`](/docs/api/math/tan)       | Tangent of an angle in radians.   |
| [`Cotan`](/docs/api/math/cotan)   | Cotangent of an angle in radians. |
| [`ArcSin`](/docs/api/math/arcsin) | Inverse sine, in radians.         |
| [`ArcCos`](/docs/api/math/arccos) | Inverse cosine, in radians.       |
| [`ArcTan`](/docs/api/math/arctan) | Inverse tangent, in radians.      |
| [`ArcCot`](/docs/api/math/arccot) | Inverse cotangent, in radians.    |

### Hyperbolic

| Function                          | Description           |
| --------------------------------- | --------------------- |
| [`Sinh`](/docs/api/math/sinh)     | Hyperbolic sine.      |
| [`Cosh`](/docs/api/math/cosh)     | Hyperbolic cosine.    |
| [`Tanh`](/docs/api/math/tanh)     | Hyperbolic tangent.   |
| [`Cotanh`](/docs/api/math/cotanh) | Hyperbolic cotangent. |

### Angle conversion

| Function                              | Description                 |
| ------------------------------------- | --------------------------- |
| [`DegToRad`](/docs/api/math/degtorad) | Convert degrees to radians. |
| [`RadToDeg`](/docs/api/math/radtodeg) | Convert radians to degrees. |
