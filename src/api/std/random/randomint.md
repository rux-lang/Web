# `RandomInt`

Returns a random signed integer in a half-open range.

**Module:** `Std::Random`

## Signature

One function per signed-integer width:

```rux
func RandomInt8(min: int8, max: int8, seed: uint64) -> int8;
func RandomInt16(min: int16, max: int16, seed: uint64) -> int16;
func RandomInt32(min: int32, max: int32, seed: uint64) -> int32;
func RandomInt64(min: int64, max: int64, seed: uint64) -> int64;
func RandomInt(min: int, max: int, seed: uint64) -> int;
```

## Parameters

| Name   | Type     | Description                             |
| ------ | -------- | --------------------------------------- |
| `min`  | integer  | Inclusive lower bound.                  |
| `max`  | integer  | Exclusive upper bound. Must be `> min`. |
| `seed` | `uint64` | Seed value that determines the result.  |

## Returns

A value in the half-open range `[min, max)` — `min` is possible, `max` is not.

## Description

Picks a value by mixing `seed` and reducing it into the range. The result is
fully determined by `(min, max, seed)`; see the [module
overview](/api/std/random/) for how to vary the seed.

::: warning
`min` must be strictly less than `max`, otherwise the call aborts via
[`Fatal`](../fatal).
:::

## Example

```rux
import Std::Random;

let roll = Random::RandomInt(1, 7, seed);    // 1..6 inclusive
```

## See also

- [`Std::Random`](/api/std/random/) — module overview and seeding guidance
- [`RandomUInt`](randomuint) — the unsigned counterpart
