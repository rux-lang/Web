# `Sqrt`

Returns the square root.

**Module:** `Math`

## Signature

```rux
func Sqrt(x: float64) -> float64;
func Sqrt(x: float32) -> float32;
```

## Parameters

| Name | Type                  | Description           |
| ---- | --------------------- | ----------------------- |
| `x`  | `float64` / `float32` | A non-negative value. |

## Returns

The non-negative square root of `x`, computed directly by the hardware square
root instruction and correctly rounded. `Sqrt(-0.0)` is `-0.0`; `Sqrt(x)` for
any other negative `x` is a NaN.

## Example

```rux
import Math::Sqrt;

let a = Sqrt(144.0); // 12.0
let b = Sqrt(-1.0);  // NaN
```

## See also

- [`Math`](/api/math/) — the module overview
- [`Cbrt`](cbrt) — cube root, defined for negative arguments
- [`Pow`](pow) — general exponentiation
- [`Hypot`](hypot) — √(x² + y²) without overflow
