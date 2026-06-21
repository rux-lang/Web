# `HeapFree`

Releases a block allocated from a Win32 heap.

**Module:** `Windows`

**Microsoft documentation:** [`HeapFree`](https://learn.microsoft.com/en-us/windows/win32/api/heapapi/nf-heapapi-heapfree)

## Signature

```rux
func HeapFree(heap: *opaque, flags: uint32, mem: *opaque) -> bool32;
```

## Parameters

| Name    | Description                                     |
| ------- | ----------------------------------------------- |
| `heap`  | The same heap used to allocate `mem`.           |
| `flags` | Heap flags; normally `0`.                       |
| `mem`   | Allocated block to release.                     |

## Returns

`bool32` — nonzero on success or zero on failure. The pointer is invalid after
a successful call.

## See also

- [`Heap`](heap) — heap API overview
