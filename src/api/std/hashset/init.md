# `Init`

Initializes a hash set for use.

**Module:** `Std::HashSet`

## Signature

```rux
func Init(setPtr: *HashSet);
func InitWithCap(setPtr: *HashSet, capacity: uint);
```

## Parameters

| Name       | Type        | Description                                            |
| ---------- | ----------- | ----------------------------------------------------- |
| `setPtr`   | `*HashSet`  | Pointer to the set to initialize.                     |
| `capacity` | `uint`      | Initial slot count (`InitWithCap`). Rounded up to a minimum of 16. |

## Description

Allocates the set's backing storage and resets its count to zero. Call this once
on a fresh `HashSet` before any other operation. `Init` starts at a default
capacity of 16; `InitWithCap` pre-sizes the set to avoid early growth.

These are module-level functions that take a pointer to the set, so call them as
`Init(&set)` rather than as methods.

::: warning
Always pair initialization with [`Free`](free) to release the set's memory.
:::

## Example

```rux
import Std::HashSet::*;

var a: HashSet;
Init(&a);

var b: HashSet;
InitWithCap(&b, 4096u);
```

## See also

- [`Std::HashSet`](/api/std/hashset/) — the type
- [`Free`](free) — release the set
- [`Insert`](insert) — add keys
