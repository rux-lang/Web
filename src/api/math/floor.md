# `Floor`

Rounds down to the nearest integer value.

**Module:** `Math`

## Signature

```rux
func Floor(x: float64) -> float64;
func Floor(x: float32) -> float32;
```

## Parameters

| Name | Type                  | Description   |
| ---- | --------------------- | -------------- |
| `x`  | `float64` / `float32` | The value to round. |

## Returns

The largest integer value at or below `x`, still represented as a
floating-point number. `Floor(-0.0)` is `-0.0` and `Floor(-Inf)` is `-Inf`;
a NaN passes through unchanged.

## Example

```rux
import Math;

let a = Math::Floor(3.7);    // 3.0
let b = Math::Floor(-3.2);   // -4.0
```

## See also

- [`Math`](/api/math/) — the module overview
- [`Ceil`](ceil) — round up
- [`Round`](round) — round to the nearest integer
- [`Trunc`](trunc) — round toward zero
