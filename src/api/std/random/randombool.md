# `RandomBool`

Returns a random boolean.

**Module:** `Std::Random`

## Signature

```rux
func RandomBool(seed: uint64) -> bool;
```

## Parameters

| Name   | Type     | Description                            |
| ------ | -------- | -------------------------------------- |
| `seed` | `uint64` | Seed value that determines the result. |

## Returns

`bool` — `true` or `false`, each with roughly equal probability, determined by
the low bit of the mixed seed.

## Example

```rux
import Rux::Random;

if Random::RandomBool(seed) {
    // heads
} else {
    // tails
}
```

## See also

- [`Std::Random`](/api/std/random/) — module overview and seeding guidance
- [`RandomInt`](randomint) — random integers
