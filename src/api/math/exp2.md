# `Exp2`

Returns 2 raised to a power.

**Module:** `Math`

## Signature

```rux
func Exp2(x: float64) -> float64;
func Exp2(x: float32) -> float32;
```

## Parameters

| Name | Type                  | Description   |
| ---- | --------------------- | -------------- |
| `x`  | `float64` / `float32` | The exponent. |

## Returns

`2^x`, in the same precision as the argument. `Exp2` overflows to `+Inf` for
`x >= 1024.0` and underflows to `+0.0` for `x < -1075.0`. A NaN propagates.

## Example

```rux
import Math;

let a = Math::Exp2(10.0);   // 1024.0
let b = Math::Exp2(-1.0);   // 0.5
```

## See also

- [`Math`](/api/math/) — the module overview
- [`Exp`](exp) — e raised to a power
- [`Log2`](log2) — the inverse of `Exp2`
- [`Pow`](pow) — an arbitrary base raised to a power
