# `Ceil`

Rounds up to an integer value.

**Module:** `Std::Math`

## Signature

```rux
func Ceil(x: float64) -> float64;
func Ceil(x: float32) -> float32;
```

## Parameters

| Name | Type                  | Description       |
| ---- | --------------------- | ----------------- |
| `x`  | `float64` / `float32` | Any value.        |

## Returns

The smallest integer value not less than `x`, returned as a float in the same
precision (e.g. `Ceil(2.1)` is `3.0`, `Ceil(-2.9)` is `-2.0`).

## Example

```rux
import Rux::Math;

let c = Math::Ceil(2.1);             // 3.0
```

## See also

- [`Std::Math`](/api/std/math/) — the module overview
- [`Floor`](floor), [`Round`](round) — the other rounding modes
