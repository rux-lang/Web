# `Init`

Initializes a hash map for use.

**Module:** `Std::HashMap`

## Signature

```rux
func Init(mapPtr: *HashMap);
func InitWithCap(mapPtr: *HashMap, capacity: uint);
```

## Parameters

| Name       | Type       | Description                                                        |
| ---------- | ---------- | ------------------------------------------------------------------ |
| `mapPtr`   | `*HashMap` | Pointer to the map to initialize.                                  |
| `capacity` | `uint`     | Initial slot count (`InitWithCap`). Rounded up to a minimum of 16. |

## Description

Allocates the map's backing storage and resets its count to zero. Call this once
on a fresh `HashMap` before any other operation. `Init` starts at a default
capacity of 16 slots; `InitWithCap` lets you pre-size the map to avoid early
growth when you know roughly how many entries you'll store.

These are module-level functions that take a pointer to the map, so call them as
`Init(&map)` rather than as methods.

::: warning
Always pair initialization with [`Free`](free) to release the map's memory.
:::

## Example

```rux
import Rux::HashMap::*;

var a: HashMap;
Init(&a);                    // default capacity

var b: HashMap;
InitWithCap(&b, 1024u);      // pre-sized for ~1000 entries
```

## See also

- [`Std::HashMap`](/api/std/hashmap/) — the type
- [`Free`](free) — release the map
- [`Set`](set) — add entries
