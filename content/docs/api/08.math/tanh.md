# Tanh

Returns the hyperbolic tangent.

**Package:** `Math`

## Signature

```rux
func Tanh(x: float64) -> float64;
func Tanh(x: float32) -> float32;
```

## Parameters

| Name | Type                  | Description |
| ---- | --------------------- | ----------- |
| `x`  | `float64` / `float32` | Any value.  |

## Returns

The hyperbolic tangent of `x`, in the range `(-1, 1)`. `Tanh(±0.0)` is
`±0.0`, preserving the sign, and `Tanh` saturates to `±1.0` once `|x|` is
large enough that the distinction is no longer representable. A NaN argument
propagates.

## Example

```rux
import Math::Tanh;

func Main() -> int {
    let a = Tanh(0.0); // 0.0
    let b = Tanh(1.0); // 0.7615941559557649
    return 0;
}
```

## See also

- [`Math`](/docs/api/math) — the package overview
- [`Sinh`](/docs/api/math/sinh) / [`Cosh`](/docs/api/math/cosh) — hyperbolic sine and cosine
- [`Cotanh`](/docs/api/math/cotanh) — the reciprocal function, with a pole at zero
