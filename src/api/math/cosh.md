# `Cosh`

Returns the hyperbolic cosine.

**Package:** `Math`

## Signature

```rux
func Cosh(x: float64) -> float64;
func Cosh(x: float32) -> float32;
```

## Parameters

| Name | Type                  | Description   |
| ---- | --------------------- | -------------- |
| `x`  | `float64` / `float32` | Any value.    |

## Returns

The hyperbolic cosine of `x`, always at least `1.0`. `Cosh(±Inf)` is `+Inf`.
`Cosh` overflows to `+Inf` for large `|x|`. A NaN argument propagates.

## Example

```rux
import Math::Cosh;

func Main() -> int {
    let a = Cosh(0.0); // 1.0
    let b = Cosh(1.0); // 1.5430806348152437
    return 0;
}
```

## See also

- [`Math`](/api/math/) — the package overview
- [`Sinh`](sinh) — hyperbolic sine
- [`Tanh`](tanh) — hyperbolic tangent
- [`Exp`](exp) — the exponential `Cosh` is built on
