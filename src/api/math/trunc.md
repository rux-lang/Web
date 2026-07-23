# `Trunc`

Rounds toward zero.

**Package:** `Math`

## Signature

```rux
func Trunc(x: float64) -> float64;
func Trunc(x: float32) -> float32;
```

## Parameters

| Name | Type                  | Description   |
| ---- | --------------------- | -------------- |
| `x`  | `float64` / `float32` | The value to round. |

## Returns

The integer part of `x`, discarding any fractional part, still represented
as a floating-point number. `Trunc(-0.4)` keeps its sign and is `-0.0`.
Infinities and NaNs pass through unchanged.

## Example

```rux
import Math::Trunc;

func Main() -> int {
    let a = Trunc(3.9);  // 3.0
    let b = Trunc(-3.9); // -3.0
    return 0;
}
```

## See also

- [`Math`](/api/math/) — the package overview
- [`Floor`](floor) — round down
- [`Ceil`](ceil) — round up
- [`Round`](round) — round to the nearest integer
- [`Mod`](mod) — the remainder built on this truncation
