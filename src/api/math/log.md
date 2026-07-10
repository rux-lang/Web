# `Log`

Returns the natural logarithm.

**Module:** `Math`

## Signature

```rux
func Log(x: float64) -> float64;
func Log(x: float32) -> float32;
```

## Parameters

| Name | Type                  | Description             |
| ---- | --------------------- | ------------------------- |
| `x`  | `float64` / `float32` | A non-negative value.   |

## Returns

`ln(x)`, in the same precision as the argument. `Log(±0.0)` is `-Inf`;
`Log` of a negative value is a NaN; `Log(+Inf)` is `+Inf`; a NaN propagates.

## Example

```rux
import Math;

let a = Math::Log(Math::E);   // 1.0
let b = Math::Log(1.0);       // 0.0
```

## See also

- [`Math`](/api/math/) — the module overview
- [`Log2`](log2) — base-2 logarithm
- [`Log10`](log10) — base-10 logarithm
- [`Exp`](exp) — the inverse of `Log`
