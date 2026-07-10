# `Round`

Rounds to the nearest integer value.

**Module:** `Math`

## Signature

```rux
func Round(x: float64) -> float64;
func Round(x: float32) -> float32;
```

## Parameters

| Name | Type                  | Description   |
| ---- | --------------------- | -------------- |
| `x`  | `float64` / `float32` | The value to round. |

## Returns

The nearest integer value to `x`, still represented as a floating-point
number. A tie rounds away from zero: `Round(2.5)` is `3.0` and
`Round(-2.5)` is `-3.0`. Infinities and NaNs pass through unchanged.

## Example

```rux
import Math;

let a = Math::Round(2.5);    // 3.0
let b = Math::Round(-2.5);   // -3.0
let c = Math::Round(2.4);    // 2.0
```

## See also

- [`Math`](/api/math/) — the module overview
- [`Floor`](floor) — round down
- [`Ceil`](ceil) — round up
- [`Trunc`](trunc) — round toward zero
