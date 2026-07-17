# `Clear`

Removes all keys, keeping the allocation.

**Module:** `Std::HashSet`

## Signature

```rux
func Clear(self);
```

## Description

Empties the set by resetting every slot and setting the count to `0`, while
keeping the backing buffer so it can be refilled without reallocating. To also
release the memory, use [`Free`](free).

## Example

```rux
import Rux::HashSet::*;

set.Clear();                 // count is now 0, capacity unchanged
```

## See also

- [`Std::HashSet`](/api/std/hashset/) — the type
- [`Free`](free) — also release the memory
- [`Remove`](remove) — delete a single key
