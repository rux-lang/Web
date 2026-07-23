# `Round`

Rounds to the nearest integer value.

**Package:** `Math`

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
import Math::Round;

func Main() -> int {
    let a = Round(2.5);  // 3.0
    let b = Round(-2.5); // -3.0
    let c = Round(2.4);  // 2.0
    return 0;
}
```

## See also

- [`Math`](/api/math/) — the package overview
- [`Floor`](floor) — round down
- [`Ceil`](ceil) — round up
- [`Trunc`](trunc) — round toward zero
