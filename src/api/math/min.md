# `Min`

Returns the smaller of two values.

**Module:** `Math`

## Signature

```rux
func Min(a: float64, b: float64) -> float64;
func Min(a: float32, b: float32) -> float32;
```

## Parameters

| Name | Type                  | Description        |
| ---- | --------------------- | ------------------- |
| `a`  | `float64` / `float32` | The first value.    |
| `b`  | `float64` / `float32` | The second value.   |

## Returns

The smaller of `a` and `b`. A NaN loses to anything else — `Min(NaN, y)` is
`y` and `Min(x, NaN)` is `x` — and only two NaNs produce a NaN. When `a` and
`b` compare equal, the sign of a zero still decides: `Min(0.0, -0.0)` is
`-0.0`.

## Example

```rux
import Math;

let a = Math::Min(3.0, 7.0);    // 3.0
let b = Math::Min(0.0, -0.0);   // -0.0
```

## See also

- [`Math`](/api/math/) — the module overview
- [`Max`](max) — the smaller value's counterpart
- [`Abs`](abs) — magnitude of a single value
