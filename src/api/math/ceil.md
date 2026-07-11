# `Ceil`

Rounds up to the nearest integer value.

**Module:** `Math`

## Signature

```rux
func Ceil(x: float64) -> float64;
func Ceil(x: float32) -> float32;
```

## Parameters

| Name | Type                  | Description   |
| ---- | --------------------- | -------------- |
| `x`  | `float64` / `float32` | The value to round. |

## Returns

The smallest integer value at or above `x`, still represented as a
floating-point number. `Ceil(-0.5)` is `-0.0` rather than `0.0` — truncation
carries the sign of `x` across, and IEEE-754 asks for that sign to survive. A
NaN passes through unchanged.

## Example

```rux
import Math::Ceil;

let a = Ceil(3.2);  // 4.0
let b = Ceil(-3.7); // -3.0
```

## See also

- [`Math`](/api/math/) — the module overview
- [`Floor`](floor) — round down
- [`Round`](round) — round to the nearest integer
- [`Trunc`](trunc) — round toward zero
