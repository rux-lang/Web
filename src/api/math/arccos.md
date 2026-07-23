# `ArcCos`

Returns the inverse cosine, in radians.

**Package:** `Math`

## Signature

```rux
func ArcCos(x: float64) -> float64;
func ArcCos(x: float32) -> float32;
```

## Parameters

| Name | Type                  | Description                  |
| ---- | --------------------- | ------------------------------ |
| `x`  | `float64` / `float32` | A value in `[-1, 1]`.        |

## Returns

The angle in `[0, Pi]` whose cosine is `x`. `ArcCos(1.0)` is `0.0` and
`ArcCos(-1.0)` is `Pi`. For `|x| > 1.0` the result is a NaN, since no real
angle has that cosine; a NaN argument also propagates.

## Example

```rux
import Math::ArcCos;

func Main() -> int {
    let a = ArcCos(1.0);  // 0.0
    let b = ArcCos(-1.0); // 3.141592653589793 (Pi)
    return 0;
}
```

## See also

- [`Math`](/api/math/) — the package overview
- [`Cos`](cos) — the function `ArcCos` inverts
- [`ArcSin`](arcsin) / [`ArcTan`](arctan) — the other inverse trigonometric functions
