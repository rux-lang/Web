# `Remove`

Deletes a key from the set.

**Module:** `Std::HashSet`

## Signature

```rux
func Remove(self, key: int) -> bool;
```

## Parameters

| Name  | Type  | Description           |
| ----- | ----- | --------------------- |
| `key` | `int` | The key to remove.    |

## Returns

`bool` — `true` if the key was present and removed, `false` if it was not found.

## Description

Removes `key` and repairs the probe sequence so later lookups stay correct.

## Example

```rux
import Rux::HashSet::*;

if set.Remove(7) {
    // 7 was in the set and is now gone
}
```

## See also

- [`Std::HashSet`](/api/std/hashset/) — the type
- [`Clear`](clear) — remove everything at once
