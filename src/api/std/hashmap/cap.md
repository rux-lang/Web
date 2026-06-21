# `Cap`

Returns the number of allocated slots.

**Module:** `Std::HashMap`

## Signature

```rux
func Cap(self) -> uint;
```

## Returns

`uint` — the number of slots currently allocated. Always greater than
[`Len`](len); the map grows (doubling its capacity) before it fills up.

## Description

Capacity is an implementation detail of how the map is stored — most code only
needs [`Len`](len). It can be useful for diagnostics or for understanding growth
behavior.

## Example

```rux
import Std::HashMap::*;

// After Init, Cap() is the default of 16.
```

## See also

- [`Std::HashMap`](/api/std/hashmap/) — the type
- [`Len`](len) — number of live entries
- [`Init`](init) — pre-size with `InitWithCap`
