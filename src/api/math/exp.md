# `Exp`

Returns e raised to a power.

**Package:** `Math`

## Signature

```rux
func Exp(x: float64) -> float64;
func Exp(x: float32) -> float32;
```

## Parameters

| Name | Type                  | Description   |
| ---- | --------------------- | -------------- |
| `x`  | `float64` / `float32` | The exponent. |

## Returns

`e^x`, in the same precision as the argument. `Exp` overflows to `+Inf` for
large positive `x` and underflows to `+0.0` for large negative `x`.
`Exp(+Inf)` is `+Inf`, `Exp(-Inf)` is `+0.0`, and a NaN propagates.

## Example

```rux
import Math::Exp;

func Main() -> int {
    let a = Exp(1.0); // 2.718281828459045 (e)
    let b = Exp(0.0); // 1.0
    return 0;
}
```

## See also

- [`Math`](/api/math/) — the package overview
- [`Exp2`](exp2) — 2 raised to a power
- [`Log`](log) — the inverse of `Exp`
- [`Pow`](pow) — an arbitrary base raised to a power
