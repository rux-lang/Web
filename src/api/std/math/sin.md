# `Sin`

Returns the sine of an angle.

**Module:** `Std::Math`

## Signature

```rux
func Sin(x: float64) -> float64;
func Sin(x: float32) -> float32;
```

## Parameters

| Name | Type                  | Description                  |
| ---- | --------------------- | ---------------------------- |
| `x`  | `float64` / `float32` | The angle, in **radians**.   |

## Returns

The sine of `x`, in the range `[-1, 1]`, in the same precision as the argument.

## Example

```rux
import Std::Math;

let y = Math::Sin(Math::Pi / 2.0);   // 1.0
```

## See also

- [`Std::Math`](/api/std/math/) — the module overview
- [`Cos`](cos), [`Tan`](tan) — the other trigonometric functions
