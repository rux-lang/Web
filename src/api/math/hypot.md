# `Hypot`

Returns the length of the hypotenuse of a right triangle with legs `x` and `y`.

**Package:** `Math`

## Signature

```rux
func Hypot(x: float64, y: float64) -> float64;
func Hypot(x: float32, y: float32) -> float32;
```

## Parameters

| Name | Type                  | Description         |
| ---- | --------------------- | --------------------- |
| `x`  | `float64` / `float32` | One leg of the triangle. |
| `y`  | `float64` / `float32` | The other leg.       |

## Returns

`√(x² + y²)`, computed without the overflow that squaring a large argument
would cause, without the underflow that squaring a small one would, and
without the extra rounding of forming `x*x + y*y` directly. `Hypot` is
infinite if either argument is infinite, even when the other is a NaN;
otherwise a NaN in either argument produces a NaN.

## Example

```rux
import Math::Hypot;

func Main() -> int {
    let a = Hypot(3.0, 4.0); // 5.0
    return 0;
}
```

## See also

- [`Math`](/api/math/) — the package overview
- [`Sqrt`](sqrt) — the square root `Hypot` is built on
- [`Abs`](abs) — magnitude of a single value
