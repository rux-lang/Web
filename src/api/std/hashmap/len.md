# `Len`

Returns the number of entries.

**Module:** `Std::HashMap`

## Signature

```rux
func Len(self) -> uint;
```

## Returns

`uint` — how many key/value pairs the map currently holds.

## Example

```rux
import Rux::HashMap::*;

if map.Len() == 0u {
    // map is empty
}
```

## See also

- [`Std::HashMap`](/api/std/hashmap/) — the type
- [`Cap`](cap) — allocated slot count
