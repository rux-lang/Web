# `Insert`

Adds a key to the set.

**Module:** `Std::HashSet`

## Signature

```rux
func Insert(self, key: int);
```

## Parameters

| Name  | Type  | Description           |
| ----- | ----- | --------------------- |
| `key` | `int` | The key to add.       |

## Description

Adds `key` to the set. If the key is already present, the call has no effect, so
the set never holds duplicates. It grows automatically as it fills.

## Example

```rux
import Rux::HashSet::*;

var set: HashSet;
Init(&set);
set.Insert(7);
set.Insert(7);               // no-op; still one element
set.Free();
```

## See also

- [`Std::HashSet`](/api/std/hashset/) — the type
- [`Contains`](contains) — test membership
- [`Remove`](remove) — delete a key
