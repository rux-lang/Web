# `Std::Math`

Mathematical constants and floating-point functions.

**Module:** `Std::Math`

Every function is provided for both `float64` and `float32`. Pass `float64`
arguments to get a `float64` result, or `float32` for a `float32` result.

```rux
import Math;
import Io::PrintLine;

func Main() -> int {
    PrintLine(Math::Sqrt(2.0));          // 1.4142135623730951
    PrintLine(Math::Pow(2.0, 10.0));     // 1024
    return 0;
}
```

## Constants

| Name | Type      | Value                  |
| ---- | --------- | ---------------------- |
| `Pi` | `float64` | 3.14159265358979323846 |
| `E`  | `float64` | 2.71828182845904523536 |

```rux
let circumference = 2.0 * Math::Pi * radius;
```

## Functions

### Trigonometry

| Function     | Description                     |
| ------------ | ------------------------------- |
| [`Sin`](sin) | Sine of an angle in radians.    |
| [`Cos`](cos) | Cosine of an angle in radians.  |
| [`Tan`](tan) | Tangent of an angle in radians. |

### Powers and roots

| Function       | Description                  |
| -------------- | ---------------------------- |
| [`Sqrt`](sqrt) | Square root.                 |
| [`Pow`](pow)   | Raise a base to an exponent. |

### Rounding and sign

| Function         | Description                         |
| ---------------- | ----------------------------------- |
| [`Abs`](abs)     | Absolute value.                     |
| [`Floor`](floor) | Round down to an integer value.     |
| [`Ceil`](ceil)   | Round up to an integer value.       |
| [`Round`](round) | Round to the nearest integer value. |

### Integer

| Function     | Description                            |
| ------------ | -------------------------------------- |
| [`Add`](add) | Integer addition (primarily internal). |
