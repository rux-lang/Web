# `Floor`

Rounds down to an integer value.

**Module:** `Std::Math`

## Signature

```rux
func Floor(x: float64) -> float64;
func Floor(x: float32) -> float32;
```

## Parameters

| Name | Type                  | Description       |
| ---- | --------------------- | ----------------- |
| `x`  | `float64` / `float32` | Any value.        |

## Returns

The largest integer value not greater than `x`, returned as a float in the same
precision (e.g. `Floor(2.9)` is `2.0`, `Floor(-2.1)` is `-3.0`).

## Example

```rux
import Rux::Math;

let f = Math::Floor(2.9);            // 2.0
```

## See also

- [`Std::Math`](/api/std/math/) — the module overview
- [`Ceil`](ceil), [`Round`](round) — the other rounding modes
