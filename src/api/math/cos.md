# `Cos`

Returns the cosine of an angle in radians.

**Package:** `Math`

## Signature

```rux
func Cos(x: float64) -> float64;
func Cos(x: float32) -> float32;
```

## Parameters

| Name | Type                  | Description            |
| ---- | --------------------- | ------------------------ |
| `x`  | `float64` / `float32` | An angle, in radians. |

## Returns

The cosine of `x`, in the range `[-1, 1]`. Cosine has no limit at infinity,
so `Cos(±Inf)` is a NaN; a NaN argument also propagates.

## Example

```rux
import Math::{ Cos, Pi };

func Main() -> int {
    let a = Cos(0.0); // 1.0
    let b = Cos(Pi);  // -1.0
    return 0;
}
```

## See also

- [`Math`](/api/math/) — the package overview
- [`Sin`](sin) — sine
- [`Tan`](tan) — tangent
- [`ArcCos`](arccos) — the inverse of `Cos`
- [`DegToRad`](degtorad) — convert a degree value to radians first
