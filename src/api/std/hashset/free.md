# `Free`

Releases the set's memory.

**Module:** `Std::HashSet`

## Signature

```rux
func Free(self);
```

## Description

Frees the set's backing buffer and resets it to an empty, uninitialized state
(`null` data, zero count and capacity). Call it when you're finished with the set
to avoid leaking its storage.

::: warning
After `Free`, the set must be re-initialized with [`Init`](init) before reuse.
:::

## Example

```rux
import Std::HashSet::*;

var set: HashSet;
Init(&set);
// ... use set ...
set.Free();
```

## See also

- [`Std::HashSet`](/api/std/hashset/) — the type
- [`Init`](init) — initialize a set
- [`Clear`](clear) — empty without freeing
