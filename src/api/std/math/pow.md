# `Pow`

Raises a base to an exponent.

**Module:** `Std::Math`

## Signature

```rux
func Pow(base: float64, exponent: float64) -> float64;
func Pow(base: float32, exponent: float32) -> float32;
```

## Parameters

| Name       | Type                  | Description              |
| ---------- | --------------------- | ----------------------- |
| `base`     | `float64` / `float32` | The base value.         |
| `exponent` | `float64` / `float32` | The power to raise it to. |

## Returns

`base` raised to `exponent`, in the same precision as the arguments.

## Example

```rux
import Std::Math;

let a = Math::Pow(2.0, 10.0);        // 1024.0
let b = Math::Pow(9.0, 0.5);         // 3.0 (square root)
```

## See also

- [`Std::Math`](/api/std/math/) — the module overview
- [`Sqrt`](sqrt) — the common square-root case
