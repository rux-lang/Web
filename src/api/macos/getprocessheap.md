# `GetProcessHeap`

Returns the macOS compatibility heap token.

**Module:** `MacOS`

## Signature

```rux
func GetProcessHeap() -> *opaque;
```

## Returns

`*opaque` — a fixed token accepted by [`HeapAlloc`](heapalloc) and
[`HeapFree`](heapfree).

## Description

macOS does not expose a Win32 process heap. The compatibility thunk returns a
token to preserve the shared API shape; the current allocation and free thunks
ignore the `heap` argument.

## Example

```rux
import MacOS::{ GetProcessHeap, HeapAlloc };

let heap = GetProcessHeap();
let memory = HeapAlloc(heap, 0u32, 4096u);
```

## See also

- [`Heap and memory`](heap) — allocation lifecycle and limitations

