# `Abs`

Returns the absolute value.

**Module:** `Math`

## Signature

```rux
func Abs(x: float64) -> float64;
func Abs(x: float32) -> float32;
```

## Parameters

| Name | Type                  | Description        |
| ---- | --------------------- | ------------------- |
| `x`  | `float64` / `float32` | The value to measure. |

## Returns

The magnitude of `x`, in the same precision as the argument. The sign bit is
cleared directly, so `Abs(-0.0)` is `0.0` and `Abs(NaN)` is a NaN with the same
payload but a cleared sign.

## Example

```rux
import Math::Abs;

let a = Abs(-3.5); // 3.5
let b = Abs(-0.0); // 0.0
```

## See also

- [`Math`](/api/math/) — the module overview
- [`Min`](min) / [`Max`](max) — pick the smaller or larger of two values
