# `Sqrt`

Returns the square root.

**Module:** `Std::Math`

## Signature

```rux
func Sqrt(x: float64) -> float64;
func Sqrt(x: float32) -> float32;
```

## Parameters

| Name | Type                  | Description                  |
| ---- | --------------------- | ---------------------------- |
| `x`  | `float64` / `float32` | A non-negative value.        |

## Returns

The non-negative square root of `x`, in the same precision as the argument. For
a negative `x`, the result is NaN — test it with [`IsNan`](../float).

## Example

```rux
import Rux::Math;

let r = Math::Sqrt(144.0);           // 12.0
```

## See also

- [`Std::Math`](/api/std/math/) — the module overview
- [`Pow`](pow) — general exponentiation
- [`IsNan`](../float) — detect a NaN result
