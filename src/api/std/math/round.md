# `Round`

Rounds to the nearest integer value.

**Module:** `Std::Math`

## Signature

```rux
func Round(x: float64) -> float64;
func Round(x: float32) -> float32;
```

## Parameters

| Name | Type                  | Description       |
| ---- | --------------------- | ----------------- |
| `x`  | `float64` / `float32` | Any value.        |

## Returns

`x` rounded to the nearest integer value, returned as a float in the same
precision. Halfway cases round away from zero (e.g. `Round(2.5)` is `3.0`).

## Example

```rux
import Std::Math;

let r = Math::Round(2.5);            // 3.0
let s = Math::Round(2.4);            // 2.0
```

## See also

- [`Std::Math`](/api/std/math/) — the module overview
- [`Floor`](floor), [`Ceil`](ceil) — directed rounding
