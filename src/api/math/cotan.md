# `Cotan`

Returns the cotangent of an angle in radians.

**Module:** `Math`

## Signature

```rux
func Cotan(x: float64) -> float64;
func Cotan(x: float32) -> float32;
```

## Parameters

| Name | Type                  | Description            |
| ---- | --------------------- | ------------------------ |
| `x`  | `float64` / `float32` | An angle, in radians. |

## Returns

The cotangent of `x`, computed directly rather than as `1 / Tan(x)` so the
result near a pole keeps the bits a second rounding would lose. `Cotan(0.0)`
is `+Inf` and `Cotan(-0.0)` is `-Inf`, carrying the pole at zero with the
right sign. The cotangent has no limit at infinity, so `Cotan(±Inf)` is a
NaN; a NaN argument also propagates.

## Example

```rux
import Math::{ Cotan, QuarterPi };

let a = Cotan(QuarterPi); // 1.0
```

## See also

- [`Math`](/api/math/) — the module overview
- [`Tan`](tan) — tangent
- [`ArcCot`](arccot) — the inverse of `Cotan`
