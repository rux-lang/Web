# `Brk`

Changes the process program break.

**Module:** `Illumos`

## Signature

```rux
func Brk(addr: *opaque) -> int64;
```

## Parameters

| Name   | Type      | Description                  |
| ------ | --------- | ---------------------------- |
| `addr` | `*opaque` | Requested new program break. |

## Returns

`int64` - the raw Illumos syscall result.

::: danger
`Brk` changes the memory region traditionally used by process allocators.
Calling it independently of the runtime allocator can corrupt the heap. Prefer
`Std::Memory` or [`Mmap`](mmap) for application allocations.
:::

## See also

- [`Memory`](memory) - memory API overview
