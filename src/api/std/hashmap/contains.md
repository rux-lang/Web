# `Contains`

Reports whether a key is present.

**Module:** `Std::HashMap`

## Signature

```rux
func Contains(self, key: int) -> bool;
```

## Parameters

| Name  | Type  | Description      |
| ----- | ----- | ---------------- |
| `key` | `int` | The key to test. |

## Returns

`bool` — `true` if `key` has an entry in the map, otherwise `false`.

## Description

Unlike [`Get`](get), this distinguishes a missing key from a key whose value
happens to be `null`.

## Example

```rux
import Rux::HashMap::*;

if map.Contains(42) {
    // key exists, regardless of its value
}
```

## See also

- [`Std::HashMap`](/api/std/hashmap/) — the type
- [`Get`](get) — retrieve the value
