# `IsInfinite`

Reports whether a value is one of the two infinities.

**Module:** `Format`

## Signature

```rux
func IsInfinite(value: float64) -> bool;
func IsInfinite(value: float32) -> bool;
```

## Parameters

| Name    | Type                  | Description        |
| ------- | --------------------- | ------------------ |
| `value` | `float64` / `float32` | The value to test. |

## Returns

`true` for the positive infinity and for the negative one, and `false` for every finite value. The sign is not reported — compare against zero for that.

The test is a comparison against the largest finite value of the type, so **the width matters**: the overload is chosen by the argument, and a `float32` infinity is measured against the `float32` range rather than being widened into the far larger `float64` one and found finite there.

A NaN answers `false`. Every comparison against a NaN is false, so it fails this test rather than being mistaken for an infinity.

## Example

```rux
import Format::IsInfinite;

let inf = 1.0 / 0.0;

IsInfinite(inf);                    // true
IsInfinite(-inf);                   // true
IsInfinite(0.0 / 0.0);              // false -- a NaN is not an infinity
IsInfinite(1.7976931348623157e308); // false -- the largest finite float64

if IsInfinite(inf) && inf < 0.0 {
    // the negative one
}
```

## See also

- [`Format`](/api/format/) — the module overview
- [`IsNan`](isnan) — whether the value is a NaN
- [`IsFinite`](isfinite) — whether the value is an ordinary number
- [`ToString`](tostring) — the infinities convert to the text `Inf` and `-Inf`
