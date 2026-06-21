# `GetProcessHeap`

Retrieves the calling process's default heap.

**Module:** `Windows`

**Microsoft documentation:** [`GetProcessHeap`](https://learn.microsoft.com/en-us/windows/win32/api/heapapi/nf-heapapi-getprocessheap)

## Signature

```rux
func GetProcessHeap() -> *opaque;
```

## Returns

`*opaque` — the process heap handle. The caller must not close or destroy this
handle.

## See also

- [`HeapAlloc`](heapalloc) — allocate from a heap
- [`Heap`](heap) — heap API overview
