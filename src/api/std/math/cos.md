# `Cos`

Returns the cosine of an angle.

**Module:** `Std::Math`

## Signature

```rux
func Cos(x: float64) -> float64;
func Cos(x: float32) -> float32;
```

## Parameters

| Name | Type                  | Description                  |
| ---- | --------------------- | ---------------------------- |
| `x`  | `float64` / `float32` | The angle, in **radians**.   |

## Returns

The cosine of `x`, in the range `[-1, 1]`, in the same precision as the argument.

## Example

```rux
import Std::Math;

let y = Math::Cos(0.0);              // 1.0
```

## See also

- [`Std::Math`](/api/std/math/) — the module overview
- [`Sin`](sin), [`Tan`](tan) — the other trigonometric functions
