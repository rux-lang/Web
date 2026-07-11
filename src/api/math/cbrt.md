# `Cbrt`

Returns the cube root.

**Module:** `Math`

## Signature

```rux
func Cbrt(x: float64) -> float64;
func Cbrt(x: float32) -> float32;
```

## Parameters

| Name | Type                  | Description   |
| ---- | --------------------- | -------------- |
| `x`  | `float64` / `float32` | Any value.    |

## Returns

The real cube root of `x`. Unlike [`Sqrt`](sqrt), the result is defined for a
negative `x`: `Cbrt(-8.0)` is `-2.0`. `Cbrt(NaN)` and `Cbrt(±Inf)` are
themselves, and `Cbrt(±0.0)` preserves the sign of the zero.

## Example

```rux
import Math::Cbrt;

let a = Cbrt(27.0); // 3.0
let b = Cbrt(-8.0); // -2.0
```

## See also

- [`Math`](/api/math/) — the module overview
- [`Sqrt`](sqrt) — square root
- [`Pow`](pow) — general exponentiation (`Pow(x, 1.0 / 3.0)` is not equivalent for negative `x`)
