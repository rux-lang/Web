# `Max`

Returns the larger of two values.

**Package:** `Math`

## Signature

```rux
func Max(a: float64, b: float64) -> float64;
func Max(a: float32, b: float32) -> float32;
```

## Parameters

| Name | Type                  | Description        |
| ---- | --------------------- | ------------------- |
| `a`  | `float64` / `float32` | The first value.    |
| `b`  | `float64` / `float32` | The second value.   |

## Returns

The larger of `a` and `b`. A NaN loses to anything else — `Max(NaN, y)` is
`y` and `Max(x, NaN)` is `x` — and only two NaNs produce a NaN. When `a` and
`b` compare equal, the sign of a zero still decides: `Max(0.0, -0.0)` is
`0.0`.

## Example

```rux
import Math::Max;

func Main() -> int {
    let a = Max(3.0, 7.0);  // 7.0
    let b = Max(0.0, -0.0); // 0.0
    return 0;
}
```

## See also

- [`Math`](/api/math/) — the package overview
- [`Min`](min) — the larger value's counterpart
- [`Abs`](abs) — magnitude of a single value
