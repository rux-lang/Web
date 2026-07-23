# `Cotanh`

Returns the hyperbolic cotangent.

**Package:** `Math`

## Signature

```rux
func Cotanh(x: float64) -> float64;
func Cotanh(x: float32) -> float32;
```

## Parameters

| Name | Type                  | Description   |
| ---- | --------------------- | -------------- |
| `x`  | `float64` / `float32` | Any value.    |

## Returns

The hyperbolic cotangent of `x`. `Cotanh(0.0)` is `+Inf` and `Cotanh(-0.0)`
is `-Inf`, carrying the pole at zero with the right sign. `Cotanh` saturates
to `±1.0` once `|x|` is large enough that the distinction is no longer
representable. A NaN argument propagates.

## Example

```rux
import Math::Cotanh;

func Main() -> int {
    let a = Cotanh(1.0); // 1.3130352854993312
    return 0;
}
```

## See also

- [`Math`](/api/math/) — the package overview
- [`Tanh`](tanh) — hyperbolic tangent
- [`Sinh`](sinh) / [`Cosh`](cosh) — hyperbolic sine and cosine
