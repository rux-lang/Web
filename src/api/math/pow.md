# `Pow`

Raises a base to an exponent.

**Module:** `Math`

## Signature

```rux
func Pow(x: float64, y: float64) -> float64;
func Pow(x: float32, y: float32) -> float32;
```

## Parameters

| Name | Type                  | Description   |
| ---- | --------------------- | -------------- |
| `x`  | `float64` / `float32` | The base.     |
| `y`  | `float64` / `float32` | The exponent. |

## Returns

`x` raised to `y`, in the same precision as the arguments. `Pow` follows
IEEE-754's special cases, of which the ones most likely to be surprising are:

- `Pow(x, 0.0)` is `1.0` for every `x`, a NaN included.
- `Pow(1.0, y)` is `1.0` for every `y`, a NaN included.
- `Pow(x, y)` is a NaN when `x` is negative and `y` is not an integer — there
  is no real result.
- When `x` is negative and `y` is an odd integer, the result is negative;
  when `y` is an even integer, it is positive.
- `Pow(x, 2.0)` and `Pow(x, 0.5)` (for non-negative `x`) are recognized and
  computed directly, as `x * x` and [`Sqrt(x)`](sqrt).

## Example

```rux
import Math::Pow;

let a = Pow(2.0, 10.0);       // 1024.0
let b = Pow(9.0, 0.5);        // 3.0
let c = Pow(-8.0, 1.0 / 3.0); // NaN -- exponent is not an integer
```

## See also

- [`Math`](/api/math/) — the module overview
- [`Sqrt`](sqrt) — the common square-root case
- [`Cbrt`](cbrt) — real cube roots, including negative arguments
