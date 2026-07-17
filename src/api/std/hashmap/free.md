# `Free`

Releases the map's memory.

**Module:** `Std::HashMap`

## Signature

```rux
func Free(self);
```

## Description

Frees the map's backing buffer and resets it to an empty, uninitialized state
(`null` data, zero count and capacity). Call it when you're finished with the
map to avoid leaking its storage.

::: warning
`Free` releases only the map's own buffer, not whatever its value pointers refer
to. Free any owned values first (for example by iterating [`Values`](values)).
After `Free`, the map must be re-initialized with [`Init`](init) before reuse.
:::

## Example

```rux
import Rux::HashMap::*;

var map: HashMap;
Init(&map);
// ... use map ...
map.Free();
```

## See also

- [`Std::HashMap`](/api/std/hashmap/) — the type
- [`Init`](init) — initialize a map
- [`Clear`](clear) — empty without freeing
