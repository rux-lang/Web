# `ArcCot`

Returns the inverse cotangent, in radians.

**Module:** `Math`

## Signature

```rux
func ArcCot(x: float64) -> float64;
func ArcCot(x: float32) -> float32;
```

## Parameters

| Name | Type                  | Description   |
| ---- | --------------------- | -------------- |
| `x`  | `float64` / `float32` | Any value.    |

## Returns

`HalfPi - ArcTan(x)`, the angle in `(0, Pi)` whose cotangent is `x`, defined
for every real `x` — including `0.0`, where `ArcCot(0.0)` is `HalfPi` rather
than a pole. A NaN argument propagates.

## Example

```rux
import Math;

let a = Math::ArcCot(0.0);   // 1.5707963267948966 (HalfPi)
let b = Math::ArcCot(1.0);   // 0.7853981633974483 (QuarterPi)
```

## See also

- [`Math`](/api/math/) — the module overview
- [`Cotan`](cotan) — the function `ArcCot` inverts
- [`ArcTan`](arctan) — `HalfPi - ArcCot(x)`
