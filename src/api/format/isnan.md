# `IsNan`

Reports whether a value is a NaN.

**Module:** `Format`

## Signature

```rux
func IsNan(value: float64) -> bool;
func IsNan(value: float32) -> bool;
```

## Parameters

| Name    | Type                  | Description        |
| ------- | --------------------- | ------------------ |
| `value` | `float64` / `float32` | The value to test. |

## Returns

`true` when the value is a NaN — the result of `0.0 / 0.0`, of an infinity minus an infinity, and of every arithmetic operation that has no answer at all.

A NaN is the only value that is not equal to itself, which is the whole test: no bit pattern is read, and every NaN answers `true` regardless of its payload or its sign.

Because every comparison against a NaN is false, a NaN is not infinite and not finite either — [`IsInfinite`](isinfinite) and [`IsFinite`](isfinite) both answer `false` for one, so the three functions partition the values rather than overlapping.

## Example

```rux
import Format::IsNan;

let nan = 0.0 / 0.0;

IsNan(nan);       // true
IsNan(1.0);       // false
IsNan(1.0 / 0.0); // false -- an infinity is a value, just not a finite one

nan == nan;       // false -- a NaN is the only value not equal to itself
```

## See also

- [`Format`](/api/format/) — the module overview
- [`IsInfinite`](isinfinite) — whether the value is one of the two infinities
- [`IsFinite`](isfinite) — whether the value is an ordinary number
- [`ToString`](tostring) — a NaN converts to the text `NaN`
