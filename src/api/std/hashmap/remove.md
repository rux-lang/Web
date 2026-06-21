# `Remove`

Deletes a key from the map.

**Module:** `Std::HashMap`

## Signature

```rux
func Remove(self, key: int) -> bool;
```

## Parameters

| Name  | Type  | Description        |
| ----- | ----- | ------------------ |
| `key` | `int` | The key to remove. |

## Returns

`bool` — `true` if the key was present and removed, `false` if it was not found.

## Description

Removes the entry for `key` and repairs the probe sequence so later lookups stay
correct. The value pointer is simply dropped from the map — any memory it
referenced is the caller's to free.

## Example

```rux
import Std::HashMap::*;

if map.Remove(42) {
    // entry existed and is now gone
}
```

## See also

- [`Std::HashMap`](/api/std/hashmap/) — the type
- [`Clear`](clear) — remove everything at once
