# `Tanh`

Returns the hyperbolic tangent.

**Module:** `Math`

## Signature

```rux
func Tanh(x: float64) -> float64;
func Tanh(x: float32) -> float32;
```

## Parameters

| Name | Type                  | Description   |
| ---- | --------------------- | -------------- |
| `x`  | `float64` / `float32` | Any value.    |

## Returns

The hyperbolic tangent of `x`, in the range `(-1, 1)`. `Tanh(±0.0)` is
`±0.0`, preserving the sign, and `Tanh` saturates to `±1.0` once `|x|` is
large enough that the distinction is no longer representable. A NaN argument
propagates.

## Example

```rux
import Math::Tanh;

let a = Tanh(0.0); // 0.0
let b = Tanh(1.0); // 0.7615941559557649
```

## See also

- [`Math`](/api/math/) — the module overview
- [`Sinh`](sinh) / [`Cosh`](cosh) — hyperbolic sine and cosine
- [`Cotanh`](cotanh) — the reciprocal function, with a pole at zero
