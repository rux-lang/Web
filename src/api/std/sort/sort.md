# `Sort`

Sorts an array in ascending order using an adaptive strategy.

**Module:** `Std::Sort`

## Signature

```rux
func Sort(arr: *int, len: uint);
func SortUint64(arr: *uint64, len: uint);
```

## Parameters

| Name  | Type               | Description                   |
| ----- | ------------------ | ----------------------------- |
| `arr` | `*int` / `*uint64` | Pointer to the first element. |
| `len` | `uint`             | Number of elements to sort.   |

## Description

The recommended general-purpose sort. It picks the best underlying algorithm for
the input size: [`Quadsort`](quadsort) for small arrays (≤ 128 elements) and
[`Crumsort`](crumsort) for larger ones. Sorting happens in place.

::: warning
The `*int` form compares values as unsigned — negative numbers sort after
non-negative ones. See the [module overview](/api/std/sort/).
:::

## Example

```rux
import Rux::Sort;

var data: uint64[4] = { 30u64, 10u64, 20u64, 5u64 };
Sort::SortUint64(data.data, data.length);
// { 5, 10, 20, 30 }
```

## See also

- [`Std::Sort`](/api/std/sort/) — module overview
- [`Quadsort`](quadsort) — stable sort
- [`Crumsort`](crumsort) — large-input sort
