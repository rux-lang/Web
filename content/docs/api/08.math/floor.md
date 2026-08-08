# Floor

Rounds down to the nearest integer value.

**Package:** `Math`

## Signature

```rux
func Floor(x: float64) -> float64;
func Floor(x: float32) -> float32;
```

## Parameters

| Name | Type                  | Description         |
| ---- | --------------------- | ------------------- |
| `x`  | `float64` / `float32` | The value to round. |

## Returns

The largest integer value at or below `x`, still represented as a
floating-point number. `Floor(-0.0)` is `-0.0` and `Floor(-Inf)` is `-Inf`;
a NaN passes through unchanged.

## Example

```rux
import Math::Floor;

func Main() -> int {
    let a = Floor(3.7);  // 3.0
    let b = Floor(-3.2); // -4.0
    return 0;
}
```

## See also

- [`Math`](/docs/api/math) — the package overview
- [`Ceil`](/docs/api/math/ceil) — round up
- [`Round`](/docs/api/math/round) — round to the nearest integer
- [`Trunc`](/docs/api/math/trunc) — round toward zero
