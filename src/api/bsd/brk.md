# `Brk`

Changes the process program break.

**Package:** `Bsd`

## Signature

```rux
func Brk(addr: *opaque) -> int64;
```

## Parameters

| Name   | Type      | Description                  |
| ------ | --------- | ---------------------------- |
| `addr` | `*opaque` | Requested new program break. |

## Returns

`int64` - `0` on success, or a negative errno value on failure.

::: danger
`Brk` changes memory traditionally managed by process allocators. Calling it
independently of the runtime allocator can corrupt the heap. Prefer
[`Memory`](/api/memory/) or [`Mmap`](mmap) for application allocations.
:::

## See also

- [`Bsd`](/api/bsd/) — the package overview
