# `Keys`

Allocates an array of all keys.

**Module:** `Std::HashSet`

## Signature

```rux
func Keys(self) -> *int;
```

## Returns

`*int` — a newly allocated array of the set's [`Len`](len) keys, or `null` if the
set is empty. The order is unspecified.

## Description

Collects every key into a fresh array. The array is heap-allocated and **owned by
the caller** — release it with [`Free`](../memory/free) when done.

## Example

```rux
import Rux::HashSet::*;
import Memory::Free as FreeMem;

let keys = set.Keys();
if keys != null {
    var i: uint = 0u;
    while i < set.Len() {
        // use *(keys + i)
        i += 1u;
    }
    FreeMem(keys as *opaque);
}
```

## See also

- [`Std::HashSet`](/api/std/hashset/) — the type
- [`Len`](len) — number of keys to iterate
