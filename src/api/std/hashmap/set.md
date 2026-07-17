# `Set`

Inserts or updates the value for a key.

**Module:** `Std::HashMap`

## Signature

```rux
func Set(self, key: int, value: *opaque);
```

## Parameters

| Name    | Type      | Description                             |
| ------- | --------- | --------------------------------------- |
| `key`   | `int`     | The key to insert or update.            |
| `value` | `*opaque` | The pointer value to associate with it. |

## Description

Associates `value` with `key`. If the key already exists, its value is replaced;
otherwise a new entry is added. The map grows automatically when it gets full, so
inserts are amortized O(1).

## Example

```rux
import Rux::HashMap::*;

var map: HashMap;
Init(&map);
map.Set(42, payload);        // insert
map.Set(42, newPayload);     // update existing key
map.Free();
```

## See also

- [`Std::HashMap`](/api/std/hashmap/) — the type
- [`Get`](get) — read a value back
- [`Remove`](remove) — delete a key
