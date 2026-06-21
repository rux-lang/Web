# `Contains`

Reports whether a key is in the set.

**Module:** `Std::HashSet`

## Signature

```rux
func Contains(self, key: int) -> bool;
```

## Parameters

| Name  | Type  | Description           |
| ----- | ----- | --------------------- |
| `key` | `int` | The key to test.      |

## Returns

`bool` — `true` if `key` is in the set, otherwise `false`.

## Example

```rux
import Std::HashSet::*;

if set.Contains(7) {
    // 7 has been inserted
}
```

## See also

- [`Std::HashSet`](/api/std/hashset/) — the type
- [`Insert`](insert) — add a key
