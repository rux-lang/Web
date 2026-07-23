# `HeapAlloc`

Allocates a block from a Win32 heap.

**Package:** `Windows`

**Microsoft documentation:** [`HeapAlloc`](https://learn.microsoft.com/en-us/windows/win32/api/heapapi/nf-heapapi-heapalloc)

## Signature

```rux
func HeapAlloc(
    heap: *opaque,
    flags: uint32,
    bytes: uint
) -> *var opaque;
```

## Parameters

| Name    | Description                                      |
| ------- | ------------------------------------------------ |
| `heap`  | Heap handle returned by `GetProcessHeap`.        |
| `flags` | Win32 heap flags; use `0` for default behavior.  |
| `bytes` | Requested allocation size.                       |

## Returns

`*opaque` — the allocated block, or `null` on failure. The memory is
uninitialized unless a zero-memory flag is supplied. Release it with
[`HeapFree`](heapfree) using the same heap.

## See also

- [`Windows`](/api/windows/) — the package overview
