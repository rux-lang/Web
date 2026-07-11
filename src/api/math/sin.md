# `Sin`

Returns the sine of an angle in radians.

**Module:** `Math`

## Signature

```rux
func Sin(x: float64) -> float64;
func Sin(x: float32) -> float32;
```

## Parameters

| Name | Type                  | Description            |
| ---- | --------------------- | ------------------------ |
| `x`  | `float64` / `float32` | An angle, in radians. |

## Returns

The sine of `x`, in the range `[-1, 1]`. `Sin(±0.0)` is `±0.0`, preserving
the sign. Sine has no limit at infinity, so `Sin(±Inf)` is a NaN; a NaN
argument also propagates.

## Example

```rux
import Math::{ HalfPi, Sin };

let a = Sin(HalfPi); // 1.0
let b = Sin(0.0);    // 0.0
```

## See also

- [`Math`](/api/math/) — the module overview
- [`Cos`](cos) — cosine
- [`Tan`](tan) — tangent
- [`ArcSin`](arcsin) — the inverse of `Sin`
- [`DegToRad`](degtorad) — convert a degree value to radians first
