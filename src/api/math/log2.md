# `Log2`

Returns the base-2 logarithm.

**Module:** `Math`

## Signature

```rux
func Log2(x: float64) -> float64;
func Log2(x: float32) -> float32;
```

## Parameters

| Name | Type                  | Description             |
| ---- | --------------------- | ------------------------- |
| `x`  | `float64` / `float32` | A non-negative value.   |

## Returns

`log₂(x)`, in the same precision as the argument. `Log2(±0.0)` is `-Inf`;
`Log2` of a negative value is a NaN; `Log2(+Inf)` is `+Inf`; a NaN
propagates.

## Example

```rux
import Math;

let a = Math::Log2(8.0);    // 3.0
let b = Math::Log2(1.0);    // 0.0
```

## See also

- [`Math`](/api/math/) — the module overview
- [`Log`](log) — natural logarithm
- [`Log10`](log10) — base-10 logarithm
- [`Exp2`](exp2) — the inverse of `Log2`
