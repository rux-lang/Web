# `Piposort`

Sorts an array with a memory-efficient merge sort variant.

**Module:** `Std::Sort`

## Signature

```rux
func Piposort(arr: *int, len: uint);
func PiposortUint64(arr: *uint64, len: uint);
```

## Parameters

| Name  | Type               | Description                   |
| ----- | ------------------ | ----------------------------- |
| `arr` | `*int` / `*uint64` | Pointer to the first element. |
| `len` | `uint`             | Number of elements to sort.   |

## Description

A variant of [`Quadsort`](quadsort) that uses less auxiliary memory (about half
the array size) while keeping good performance. If its temporary allocation
fails, it falls back to `Quadsort`. Useful when memory is tight; for most code,
[`Sort`](sort) is the simpler choice.

::: warning
The `*int` form compares values as unsigned — see the
[module overview](/api/std/sort/).
:::

## Example

```rux
import Rux::Sort;

Sort::Piposort(items.data, items.length);
```

## See also

- [`Std::Sort`](/api/std/sort/) — module overview
- [`Quadsort`](quadsort) — the algorithm it's based on
- [`Sort`](sort) — adaptive default
