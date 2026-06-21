# `Keys`

Allocates an array of all keys.

**Module:** `Std::HashMap`

## Signature

```rux
func Keys(self) -> *int;
```

## Returns

`*int` — a newly allocated array of the map's [`Len`](len) keys, or `null` if the
map is empty. The order is unspecified.

## Description

Collects every key into a fresh array. The array is heap-allocated and **owned by
the caller** — release it with [`Free`](../memory/free) when done. The keys
correspond positionally to [`Values`](values) only if the map is not modified
between the two calls.

## Example

```rux
import Std::HashMap::*;
import Std::Memory::Free as FreeMem;

let keys = map.Keys();
if keys != null {
    var i: uint = 0u;
    while i < map.Len() {
        // use *(keys + i)
        i += 1u;
    }
    FreeMem(keys as *opaque);
}
```

## See also

- [`Std::HashMap`](/api/std/hashmap/) — the type
- [`Values`](values) — the matching values
- [`Len`](len) — number of entries to iterate
