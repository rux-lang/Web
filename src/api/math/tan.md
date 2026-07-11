# `Tan`

Returns the tangent of an angle in radians.

**Module:** `Math`

## Signature

```rux
func Tan(x: float64) -> float64;
func Tan(x: float32) -> float32;
```

## Parameters

| Name | Type                  | Description            |
| ---- | --------------------- | ------------------------ |
| `x`  | `float64` / `float32` | An angle, in radians. |

## Returns

The tangent of `x`. `Tan(±0.0)` is `±0.0`, preserving the sign. The tangent
has no limit at infinity, so `Tan(±Inf)` is a NaN; a NaN argument also
propagates. Near an odd multiple of `Pi/2` the result grows without bound, as
expected of a pole.

## Example

```rux
import Math::{ QuarterPi, Tan };

let a = Tan(0.0);       // 0.0
let b = Tan(QuarterPi); // 1.0
```

## See also

- [`Math`](/api/math/) — the module overview
- [`Sin`](sin) / [`Cos`](cos) — sine and cosine
- [`Cotan`](cotan) — the reciprocal function, computed directly rather than as `1 / Tan(x)`
- [`ArcTan`](arctan) — the inverse of `Tan`
