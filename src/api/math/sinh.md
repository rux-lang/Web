# `Sinh`

Returns the hyperbolic sine.

**Module:** `Math`

## Signature

```rux
func Sinh(x: float64) -> float64;
func Sinh(x: float32) -> float32;
```

## Parameters

| Name | Type                  | Description   |
| ---- | --------------------- | -------------- |
| `x`  | `float64` / `float32` | Any value.    |

## Returns

The hyperbolic sine of `x`. `Sinh(±0.0)` is `±0.0`, preserving the sign, and
`Sinh(±Inf)` is `±Inf`. `Sinh` overflows to `±Inf` for large `|x|`. A NaN
argument propagates.

## Example

```rux
import Math::Sinh;

let a = Sinh(0.0); // 0.0
let b = Sinh(1.0); // 1.1752011936438014
```

## See also

- [`Math`](/api/math/) — the module overview
- [`Cosh`](cosh) — hyperbolic cosine
- [`Tanh`](tanh) — hyperbolic tangent
- [`Exp`](exp) — the exponential `Sinh` is built on
