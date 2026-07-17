# `Abs`

Returns the absolute value.

**Module:** `Std::Math`

## Signature

```rux
func Abs(x: float64) -> float64;
func Abs(x: float32) -> float32;
```

## Parameters

| Name | Type                  | Description       |
| ---- | --------------------- | ----------------- |
| `x`  | `float64` / `float32` | Any value.        |

## Returns

The magnitude of `x` (its value with the sign removed), in the same precision as
the argument.

## Example

```rux
import Rux::Math;

let d = Math::Abs(-3.5);             // 3.5
```

## See also

- [`Std::Math`](/api/std/math/) — the module overview
