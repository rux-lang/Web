# `Len`

Returns the number of keys.

**Module:** `Std::HashSet`

## Signature

```rux
func Len(self) -> uint;
```

## Returns

`uint` — how many keys the set currently holds.

## Example

```rux
import Std::HashSet::*;

if set.Len() == 0u {
    // set is empty
}
```

## See also

- [`Std::HashSet`](/api/std/hashset/) — the type
- [`Cap`](cap) — allocated slot count
