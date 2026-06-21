# `Munmap`

Releases a virtual-memory mapping.

**Module:** `MacOS`

## Signature

```rux
func Munmap(addr: *opaque, length: uint) -> int64;
```

## Parameters

| Name     | Type      | Description                                  |
| -------- | --------- | -------------------------------------------- |
| `addr`   | `*opaque` | Base address returned by `HeapAlloc`.        |
| `length` | `uint`    | Full size originally passed to `HeapAlloc`.  |

## Returns

`int64` — `0` on success; a negative raw macOS error result on failure.

## Description

After a successful call, the mapping is invalid and must not be accessed.
Because the package does not record allocation sizes, the caller must retain
the exact size used to allocate the region.

::: warning
The package currently provides no helper for decoding a negative `Munmap`
result. Do not call `Munmap` twice for the same mapping.
:::

## Example

```rux
import MacOS::{ GetProcessHeap, HeapAlloc, Munmap };

let size: uint = 4096u;
let memory = HeapAlloc(GetProcessHeap(), 0u32, size);
if memory == null {
    return 1i32;
}
if Munmap(memory, size) != 0i64 {
    return 2i32;
}
```

## See also

- [`Heap and memory`](heap) — memory API overview
- [`HeapAlloc`](heapalloc) — create a mapping

