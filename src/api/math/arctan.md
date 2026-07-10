# `ArcTan`

Returns the inverse tangent, in radians.

**Module:** `Math`

## Signature

```rux
func ArcTan(x: float64) -> float64;
func ArcTan(x: float32) -> float32;
```

## Parameters

| Name | Type                  | Description   |
| ---- | --------------------- | -------------- |
| `x`  | `float64` / `float32` | Any value.    |

## Returns

The angle in `(-HalfPi, HalfPi)` whose tangent is `x`, defined for every real
`x`. `ArcTan(±Inf)` is `±HalfPi`. A NaN argument propagates.

## Example

```rux
import Math;

let a = Math::ArcTan(1.0);   // 0.7853981633974483 (QuarterPi)
let b = Math::ArcTan(0.0);   // 0.0
```

## See also

- [`Math`](/api/math/) — the module overview
- [`Tan`](tan) — the function `ArcTan` inverts
- [`ArcSin`](arcsin) / [`ArcCos`](arccos) — the other inverse trigonometric functions
- [`ArcCot`](arccot) — `HalfPi - ArcTan(x)`
