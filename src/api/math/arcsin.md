# `ArcSin`

Returns the inverse sine, in radians.

**Module:** `Math`

## Signature

```rux
func ArcSin(x: float64) -> float64;
func ArcSin(x: float32) -> float32;
```

## Parameters

| Name | Type                  | Description                  |
| ---- | --------------------- | ------------------------------ |
| `x`  | `float64` / `float32` | A value in `[-1, 1]`.        |

## Returns

The angle in `[-HalfPi, HalfPi]` whose sine is `x`. `ArcSin(±1.0)` is
`±HalfPi`. For `|x| > 1.0` the result is a NaN, since no real angle has that
sine; a NaN argument also propagates.

## Example

```rux
import Math::ArcSin;

let a = ArcSin(1.0); // 1.5707963267948966 (HalfPi)
let b = ArcSin(0.0); // 0.0
```

## See also

- [`Math`](/api/math/) — the module overview
- [`Sin`](sin) — the function `ArcSin` inverts
- [`ArcCos`](arccos) / [`ArcTan`](arctan) — the other inverse trigonometric functions
