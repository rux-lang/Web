# `Crumsort`

Sorts an array with an in-place quicksort variant.

**Module:** `Std::Sort`

## Signature

```rux
func Crumsort(arr: *int, len: uint);
func CrumsortUint64(arr: *uint64, len: uint);
```

## Parameters

| Name  | Type               | Description                   |
| ----- | ------------------ | ----------------------------- |
| `arr` | `*int` / `*uint64` | Pointer to the first element. |
| `len` | `uint`             | Number of elements to sort.   |

## Description

An in-place, partition-based sort tuned for large inputs, falling back to
[`Quadsort`](quadsort) for small partitions. It is **not stable** — equal
elements may be reordered. For most code, [`Sort`](sort) already uses Crumsort
when the input is large enough to benefit.

::: warning
The `*int` form compares values as unsigned — see the
[module overview](/api/std/sort/).
:::

## Example

```rux
import Rux::Sort;

Sort::Crumsort(items.data, items.length);
```

## See also

- [`Std::Sort`](/api/std/sort/) — module overview
- [`Sort`](sort) — adaptive default
- [`Quadsort`](quadsort) — stable alternative
