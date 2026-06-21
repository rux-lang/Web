# `RandomFloat`

Returns a random floating-point value in a range.

**Module:** `Std::Random`

## Signature

```rux
func RandomFloat32(min: float32, max: float32, seed: uint64) -> float32;
func RandomFloat64(min: float64, max: float64, seed: uint64) -> float64;
```

## Parameters

| Name   | Type                  | Description                            |
| ------ | --------------------- | -------------------------------------- |
| `min`  | `float32` / `float64` | Lower bound. Must be `< max`.          |
| `max`  | `float32` / `float64` | Upper bound.                           |
| `seed` | `uint64`              | Seed value that determines the result. |

## Returns

A value in the range `[min, max]`, in the requested precision. The seed is scaled
to a fraction of the full range and interpolated between the bounds.

::: warning
`min` must be strictly less than `max`, otherwise the call aborts via
[`Fatal`](../fatal).
:::

## Example

```rux
import Std::Random;

let t = Random::RandomFloat64(0.0, 1.0, seed);     // unit interval
```

## See also

- [`Std::Random`](/api/std/random/) — module overview and seeding guidance
- [`RandomInt`](randomint) — random integers
