# `Mod`

Returns the floating-point remainder of `x / y`.

**Module:** `Math`

## Signature

```rux
func Mod(x: float64, y: float64) -> float64;
func Mod(x: float32, y: float32) -> float32;
```

## Parameters

| Name | Type                  | Description   |
| ---- | --------------------- | -------------- |
| `x`  | `float64` / `float32` | The dividend. |
| `y`  | `float64` / `float32` | The divisor.  |

## Returns

The exact remainder `x - n * y`, for the integer `n` that truncates `x / y`,
matching C's `fmod`. The result carries the sign of `x`; it is `x` unchanged
when `|x| < |y|`, and a zero signed like `x` when `|x| == |y|`.

The result is a NaN when `y` is zero, when `y` is a NaN, or when `x` is
infinite or a NaN.

## Example

```rux
import Math;

let a = Math::Mod(5.5, 2.0);    // 1.5
let b = Math::Mod(-5.5, 2.0);   // -1.5
```

## See also

- [`Math`](/api/math/) — the module overview
- [`Trunc`](trunc) — the truncation `Mod` reduces against
