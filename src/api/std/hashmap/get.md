# `Get`

Looks up the value for a key.

**Module:** `Std::HashMap`

## Signature

```rux
func Get(self, key: int) -> *opaque;
```

## Parameters

| Name  | Type  | Description         |
| ----- | ----- | ------------------- |
| `key` | `int` | The key to look up. |

## Returns

`*opaque` — the value stored for `key`, or `null` if the key is not present.

## Description

Returns the pointer previously stored with [`Set`](set).

::: tip
Because a stored value may itself be `null`, a `null` return is ambiguous. Use
[`Contains`](contains) when you need to distinguish "absent" from "present but
null".
:::

## Example

```rux
import Std::HashMap::*;

let value = map.Get(42);
if value != null {
    // use value
}
```

## See also

- [`Std::HashMap`](/api/std/hashmap/) — the type
- [`Contains`](contains) — presence test without the null ambiguity
- [`Set`](set) — store a value
