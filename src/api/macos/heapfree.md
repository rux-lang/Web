# `HeapFree`

Reports success without releasing the allocation.

**Module:** `MacOS`

## Signature

```rux
func HeapFree(heap: *opaque, flags: uint32, mem: *opaque) -> bool32;
```

## Parameters

| Name    | Type      | Description                         |
| ------- | --------- | ----------------------------------- |
| `heap`  | `*opaque` | Compatibility token; ignored.       |
| `flags` | `uint32`  | Compatibility flags; ignored.       |
| `mem`   | `*opaque` | Allocation pointer; currently ignored. |

## Returns

`bool32` — always nonzero in the current implementation.

## Description

`HeapFree` exists for compatibility with shared platform code, but the current
macOS thunk is a no-op. The mapping remains valid and consumes address space
after this call.

::: danger
Do not interpret a successful return as proof that memory was released. Use
[`Munmap`](munmap) with the allocation's original base address and exact size
when real deallocation is required.
:::

## See also

- [`HeapAlloc`](heapalloc) — create a mapping
- [`Munmap`](munmap) — release a mapping

