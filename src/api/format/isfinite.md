# `IsFinite`

Reports whether a value is an ordinary number.

**Module:** `Format`

## Signature

```rux
func IsFinite(value: float64) -> bool;
func IsFinite(value: float32) -> bool;
```

## Parameters

| Name    | Type                  | Description        |
| ------- | --------------------- | ------------------ |
| `value` | `float64` / `float32` | The value to test. |

## Returns

`true` when the value is neither a NaN nor an infinity: every real number the type can hold, from the largest finite value down through the subnormals to zero, and the negative of each.

This is exactly the negation of [`IsNan`](isnan) or [`IsInfinite`](isinfinite) — the three partition the values, and every value answers `true` to precisely one of them. A NaN is not finite: the test is a pair of comparisons against the range of the type, and every comparison against a NaN is false.

As with [`IsInfinite`](isinfinite), the width matters, and the overload is chosen by the argument. A `float32` is measured against the `float32` range.

## Example

```rux
import Format::IsFinite;

IsFinite(0.0);                    // true
IsFinite(-1.5e300);               // true
IsFinite(5.0e-324);               // true -- the smallest subnormal is still a number
IsFinite(1.0 / 0.0);              // false
IsFinite(0.0 / 0.0);              // false

IsFinite(3.4028235e38f32);        // true  -- the largest finite float32
IsFinite(1.0e300);                // true  -- as a float64
```

## See also

- [`Format`](/api/format/) — the module overview
- [`IsNan`](isnan) — whether the value is a NaN
- [`IsInfinite`](isinfinite) — whether the value is one of the two infinities
- [`ToString`](tostring) — what each of the three classes prints as
