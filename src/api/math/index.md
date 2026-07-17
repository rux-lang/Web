# Math Package

::: warning Unstable API
The package is under active development and its API is **not yet stable**. Names, signatures, and behavior may change between releases, and this documentation will be updated to match.
:::

The package provides mathematical constants and floating-point functions.

**Module:** `Math`

**Source:** [github.com/rux-lang/Math](https://github.com/rux-lang/Math)

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

| Name        | Type      | Value                  | Description                                        |
| ----------- | --------- | ---------------------- | -------------------------------------------------- |
| `Pi`        | `float64` | 3.14159265358979323846 | Ratio of a circle's circumference to its diameter. |
| `Tau`       | `float64` | 6.28318530717958647693 | 2 × `Pi`, a full turn in radians.                  |
| `HalfPi`    | `float64` | 1.57079632679489661923 | `Pi` / 2.                                          |
| `QuarterPi` | `float64` | 0.78539816339744830962 | `Pi` / 4.                                          |
| `InvPi`     | `float64` | 0.31830988618379067154 | 1 / `Pi`.                                          |
| `InvTau`    | `float64` | 0.15915494309189533577 | 1 / `Tau`.                                         |
| `E`         | `float64` | 2.71828182845904523536 | Euler's number, the base of the natural logarithm. |
| `Log2E`     | `float64` | 1.44269504088896340736 | log₂(e).                                           |
| `Log10E`    | `float64` | 0.43429448190325182765 | log₁₀(e).                                          |
| `Ln2`       | `float64` | 0.69314718055994530942 | ln(2).                                             |
| `Ln10`      | `float64` | 2.30258509299404568402 | ln(10).                                            |
| `Sqrt2`     | `float64` | 1.41421356237309504880 | √2.                                                |
| `InvSqrt2`  | `float64` | 0.70710678118654752440 | 1 / √2.                                            |
| `RadPerDeg` | `float64` | 0.01745329251994329577 | `Pi` / 180, radians per degree.                    |
| `DegPerRad` | `float64` | 57.2957795130823208768 | 180 / `Pi`, degrees per radian.                    |

```rux
import Math::Pi;

let circumference = 2.0 * Pi * radius;
```

## Functions

### Elementary operations

| Function         | Description                                         |
| ---------------- | --------------------------------------------------- |
| [`Abs`](abs)     | Absolute value.                                     |
| [`Min`](min)     | The smaller of two values.                          |
| [`Max`](max)     | The larger of two values.                           |
| [`Mod`](mod)     | Floating-point remainder, signed like the dividend. |
| [`Pow`](pow)     | Raise a base to an exponent.                        |
| [`Sqrt`](sqrt)   | Square root.                                        |
| [`Cbrt`](cbrt)   | Cube root, defined for negative arguments too.      |
| [`Hypot`](hypot) | √(x² + y²), without spurious overflow or underflow. |

### Rounding

| Function         | Description                                        |
| ---------------- | -------------------------------------------------- |
| [`Floor`](floor) | Round down to the nearest integer value.           |
| [`Ceil`](ceil)   | Round up to the nearest integer value.             |
| [`Round`](round) | Round to the nearest integer, ties away from zero. |
| [`Trunc`](trunc) | Round toward zero.                                 |

### Exponential and logarithmic

| Function         | Description          |
| ---------------- | -------------------- |
| [`Exp`](exp)     | e raised to a power. |
| [`Exp2`](exp2)   | 2 raised to a power. |
| [`Log`](log)     | Natural logarithm.   |
| [`Log2`](log2)   | Base-2 logarithm.    |
| [`Log10`](log10) | Base-10 logarithm.   |

### Trigonometry

| Function           | Description                       |
| ------------------ | --------------------------------- |
| [`Sin`](sin)       | Sine of an angle in radians.      |
| [`Cos`](cos)       | Cosine of an angle in radians.    |
| [`Tan`](tan)       | Tangent of an angle in radians.   |
| [`Cotan`](cotan)   | Cotangent of an angle in radians. |
| [`ArcSin`](arcsin) | Inverse sine, in radians.         |
| [`ArcCos`](arccos) | Inverse cosine, in radians.       |
| [`ArcTan`](arctan) | Inverse tangent, in radians.      |
| [`ArcCot`](arccot) | Inverse cotangent, in radians.    |

### Hyperbolic

| Function           | Description           |
| ------------------ | --------------------- |
| [`Sinh`](sinh)     | Hyperbolic sine.      |
| [`Cosh`](cosh)     | Hyperbolic cosine.    |
| [`Tanh`](tanh)     | Hyperbolic tangent.   |
| [`Cotanh`](cotanh) | Hyperbolic cotangent. |

### Angle conversion

| Function               | Description                 |
| ---------------------- | --------------------------- |
| [`DegToRad`](degtorad) | Convert degrees to radians. |
| [`RadToDeg`](radtodeg) | Convert radians to degrees. |
