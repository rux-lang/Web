# `Cap`

Returns the number of allocated slots.

**Module:** `Std::HashSet`

## Signature

```rux
func Cap(self) -> uint;
```

## Returns

`uint` — the number of slots currently allocated. Always greater than
[`Len`](len); the set grows (doubling its capacity) before it fills up.

## Example

```rux
import Rux::HashSet::*;

// After Init, Cap() is the default of 16.
```

## See also

- [`Std::HashSet`](/api/std/hashset/) — the type
- [`Len`](len) — number of live keys
- [`Init`](init) — pre-size with `InitWithCap`
