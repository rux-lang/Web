# `Clear`

Removes all entries, keeping the allocation.

**Module:** `Std::HashMap`

## Signature

```rux
func Clear(self);
```

## Description

Empties the map by resetting every slot and setting the count to `0`, but keeps
the backing buffer so the map can be refilled without reallocating. The capacity
is unchanged. To also release the memory, use [`Free`](free).

## Example

```rux
import Rux::HashMap::*;

map.Clear();                 // count is now 0, capacity unchanged
```

## See also

- [`Std::HashMap`](/api/std/hashmap/) — the type
- [`Free`](free) — also release the memory
- [`Remove`](remove) — delete a single key
