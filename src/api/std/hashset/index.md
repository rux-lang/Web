# `Std::HashSet`

An open-addressing hash set of integers.

**Module:** `Std::HashSet`

## Struct

```rux
struct HashSet {
    data:  *uint8;
    cap:   uint;
    count: uint;
}
```

`HashSet` stores a collection of unique `int` keys with fast membership tests. It
uses open addressing with linear probing and grows automatically as it fills.
It's the value-less companion to [`HashMap`](../hashmap/).

A set must be initialized with [`Init`](init) before use and released with
[`Free`](free) when done.

## Lifecycle

| Function                | Description                                  |
| ----------------------- | -------------------------------------------- |
| [`Init`](init)          | Initialize a set (optionally with capacity). |
| [`Free`](free)          | Release the set's memory.                     |
| [`Clear`](clear)        | Remove all keys, keep the allocation.        |

## Membership

| Method                  | Description                                  |
| ----------------------- | -------------------------------------------- |
| [`Insert`](insert)      | Add a key.                                   |
| [`Contains`](contains)  | Test whether a key is present.               |
| [`Remove`](remove)      | Delete a key.                                |

## Inspection

| Method              | Description                                  |
| ------------------- | -------------------------------------------- |
| [`Len`](len)        | Number of keys.                              |
| [`Cap`](cap)        | Number of slots currently allocated.         |
| [`Keys`](keys)      | Allocate an array of all keys.               |

## Example

```rux
import Std::HashSet::*;
import Std::Io::PrintLine;

func Main() -> int {
    var seen: HashSet;
    Init(&seen);

    seen.Insert(10);
    seen.Insert(20);
    seen.Insert(10);             // duplicate ignored

    PrintLine(seen.Len());       // 2
    PrintLine(seen.Contains(20));// true

    seen.Free();
    return 0;
}
```
