# `Quadsort`

Sorts an array with a stable merge-based algorithm.

**Module:** `Std::Sort`

## Signature

```rux
func Quadsort(arr: *int, len: uint);
func QuadsortUint64(arr: *uint64, len: uint);
```

## Parameters

| Name  | Type               | Description                   |
| ----- | ------------------ | ----------------------------- |
| `arr` | `*int` / `*uint64` | Pointer to the first element. |
| `len` | `uint`             | Number of elements to sort.   |

## Description

A stable, adaptive merge sort: equal elements keep their original relative order,
and nearly-sorted inputs are handled quickly. It allocates a temporary buffer
during the sort. Choose `Quadsort` when stability matters or the data is already
partially ordered; otherwise [`Sort`](sort) selects a good algorithm
automatically.

::: warning
The `*int` form compares values as unsigned — see the
[module overview](/api/std/sort/).
:::

## Example

```rux
import Rux::Sort;

Sort::Quadsort(items.data, items.length);
```

## See also

- [`Std::Sort`](/api/std/sort/) — module overview
- [`Sort`](sort) — adaptive default
- [`Crumsort`](crumsort) — non-stable, in-place alternative
