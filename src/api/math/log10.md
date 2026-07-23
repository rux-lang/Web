# `Log10`

Returns the base-10 logarithm.

**Package:** `Math`

## Signature

```rux
func Log10(x: float64) -> float64;
func Log10(x: float32) -> float32;
```

## Parameters

| Name | Type                  | Description             |
| ---- | --------------------- | ------------------------- |
| `x`  | `float64` / `float32` | A non-negative value.   |

## Returns

`log₁₀(x)`, in the same precision as the argument. `Log10(±0.0)` is `-Inf`;
`Log10` of a negative value is a NaN; `Log10(+Inf)` is `+Inf`; a NaN
propagates.

## Example

```rux
import Math::Log10;

func Main() -> int {
    let a = Log10(1000.0); // 3.0
    let b = Log10(1.0);    // 0.0
    return 0;
}
```

## See also

- [`Math`](/api/math/) — the package overview
- [`Log`](log) — natural logarithm
- [`Log2`](log2) — base-2 logarithm
- [`Exp`](exp) — exponentiation with base e
