# `RadToDeg`

Converts an angle from radians to degrees.

**Module:** `Math`

## Signature

```rux
func RadToDeg(x: float64) -> float64;
func RadToDeg(x: float32) -> float32;
```

## Parameters

| Name | Type                  | Description             |
| ---- | --------------------- | -------------------------- |
| `x`  | `float64` / `float32` | An angle, in radians.   |

## Returns

`x` scaled by `180/Pi`. The conversion is faithful enough that round numbers
come out exact: `RadToDeg(Pi)` is `180.0`. Infinities, NaN, and the sign of a
zero all fall out of the multiplication unchanged.

## Example

```rux
import Math::{ HalfPi, Pi, RadToDeg };

let degrees = RadToDeg(Pi);    // 180.0
let ninety = RadToDeg(HalfPi); // 90.0
```

## See also

- [`Math`](/api/math/) — the module overview
- [`DegToRad`](degtorad) — the inverse conversion
- [`Sin`](sin) / [`Cos`](cos) / [`Tan`](tan) — trigonometric functions that return radians
- `DegPerRad` — the constant this function multiplies by
