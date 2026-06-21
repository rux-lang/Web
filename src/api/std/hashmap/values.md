# `Values`

Allocates an array of all values.

**Module:** `Std::HashMap`

## Signature

```rux
func Values(self) -> **opaque;
```

## Returns

`**opaque` — a newly allocated array of the map's [`Len`](len) value pointers, or
`null` if the map is empty. The order is unspecified.

## Description

Collects every value pointer into a fresh array. The array is heap-allocated and
**owned by the caller** — release it with [`Free`](../memory/free) when done.
Pairs positionally with [`Keys`](keys) as long as the map is not modified between
the two calls.

## Example

```rux
import Std::HashMap::*;

let values = map.Values();
if values != null {
    // *(values + i) is the i-th value pointer
}
```

## See also

- [`Std::HashMap`](/api/std/hashmap/) — the type
- [`Keys`](keys) — the matching keys
- [`Len`](len) — number of entries
