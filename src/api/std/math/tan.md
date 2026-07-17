# `Tan`

Returns the tangent of an angle.

**Module:** `Std::Math`

## Signature

```rux
func Tan(x: float64) -> float64;
func Tan(x: float32) -> float32;
```

## Parameters

| Name | Type                  | Description                |
| ---- | --------------------- | -------------------------- |
| `x`  | `float64` / `float32` | The angle, in **radians**. |

## Returns

The tangent of `x`, in the same precision as the argument. The result grows
without bound near odd multiples of `Pi/2`.

## Example

```rux
import Rux::Math;

let y = Math::Tan(Math::Pi / 4.0);   // ~1.0
```

## See also

- [`Std::Math`](/api/std/math/) — the module overview
- [`Sin`](sin), [`Cos`](cos) — the other trigonometric functions
