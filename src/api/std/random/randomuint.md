# `RandomUInt`

Returns a random unsigned integer in a half-open range.

**Module:** `Std::Random`

## Signature

One function per unsigned-integer width:

```rux
func RandomUInt8(min: uint8, max: uint8, seed: uint64) -> uint8;
func RandomUInt16(min: uint16, max: uint16, seed: uint64) -> uint16;
func RandomUInt32(min: uint32, max: uint32, seed: uint64) -> uint32;
func RandomUInt64(min: uint64, max: uint64, seed: uint64) -> uint64;
func RandomUInt(min: uint, max: uint, seed: uint64) -> uint;
```

## Parameters

| Name   | Type     | Description                             |
| ------ | -------- | --------------------------------------- |
| `min`  | unsigned | Inclusive lower bound.                  |
| `max`  | unsigned | Exclusive upper bound. Must be `> min`. |
| `seed` | `uint64` | Seed value that determines the result.  |

## Returns

A value in the half-open range `[min, max)` — `min` is possible, `max` is not.

::: warning
`min` must be strictly less than `max`, otherwise the call aborts via
[`Fatal`](../fatal).
:::

## Example

```rux
import Rux::Random;

let index = Random::RandomUInt(0u, count, seed);   // pick an array slot
```

## See also

- [`Std::Random`](/api/std/random/) — module overview and seeding guidance
- [`RandomInt`](randomint) — the signed counterpart
