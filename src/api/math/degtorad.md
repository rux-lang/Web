# `DegToRad`

Converts an angle from degrees to radians.

**Module:** `Math`

## Signature

```rux
func DegToRad(x: float64) -> float64;
func DegToRad(x: float32) -> float32;
```

## Parameters

| Name | Type                  | Description             |
| ---- | --------------------- | -------------------------- |
| `x`  | `float64` / `float32` | An angle, in degrees.   |

## Returns

`x` scaled by `Pi/180`. The conversion is faithful enough that round numbers
come out exact: `DegToRad(180.0)` is `Pi`. Infinities, NaN, and the sign of a
zero all fall out of the multiplication unchanged.

## Example

```rux
import Math;

let radians = Math::DegToRad(180.0);   // 3.141592653589793 (Pi)
let quarter = Math::DegToRad(90.0);    // 1.5707963267948966 (HalfPi)
```

## See also

- [`Math`](/api/math/) — the module overview
- [`RadToDeg`](radtodeg) — the inverse conversion
- [`Sin`](sin) / [`Cos`](cos) / [`Tan`](tan) — trigonometric functions that expect radians
- `RadPerDeg` — the constant this function multiplies by
