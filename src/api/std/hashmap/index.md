# `Std::HashMap`

An open-addressing hash map from integer keys to pointer values.

**Module:** `Std::HashMap`

## Struct

```rux
struct HashMap {
    data:  *uint8;
    cap:   uint;
    count: uint;
}
```

`HashMap` maps `int` keys to `*opaque` values. It uses open addressing with
linear probing and grows automatically as it fills. Keys are 64-bit integers;
values are opaque pointers, so you can store a pointer to any data you manage
yourself.

A map must be initialized with [`Init`](init) (or [`InitWithCap`](init)) before
use, and released with [`Free`](free) when done.

::: warning
The map stores **pointers**, not the pointed-to data. It never copies or frees
what a value points to — managing that memory is the caller's responsibility.
Keys are limited to `int`; there is no built-in string-keyed map.
:::

## Lifecycle

| Function         | Description                                  |
| ---------------- | -------------------------------------------- |
| [`Init`](init)   | Initialize a map (optionally with capacity). |
| [`Free`](free)   | Release the map's memory.                    |
| [`Clear`](clear) | Remove all entries, keep the allocation.     |

## Entries

| Method                 | Description                     |
| ---------------------- | ------------------------------- |
| [`Set`](set)           | Insert or update a key's value. |
| [`Get`](get)           | Look up a value by key.         |
| [`Contains`](contains) | Test whether a key is present.  |
| [`Remove`](remove)     | Delete a key.                   |

## Inspection

| Method             | Description                          |
| ------------------ | ------------------------------------ |
| [`Len`](len)       | Number of entries.                   |
| [`Cap`](cap)       | Number of slots currently allocated. |
| [`Keys`](keys)     | Allocate an array of all keys.       |
| [`Values`](values) | Allocate an array of all values.     |

## Example

```rux
import Std::HashMap::*;
import Std::Io::PrintLine;

func Main() -> int {
    var scores: HashMap;
    Init(&scores);

    scores.Set(1, &"Alice");
    scores.Set(2, &"Bob");

    if scores.Contains(1) {
        PrintLine("player 1 is registered");
    }
    PrintLine(scores.Len());         // 2

    scores.Free();
    return 0;
}
```
