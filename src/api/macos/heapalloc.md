# `HeapAlloc`

Allocates a writable anonymous memory mapping.

**Module:** `MacOS`

## Signature

```rux
func HeapAlloc(heap: *opaque, flags: uint32, bytes: uint) -> *opaque;
```

## Parameters

| Name    | Type      | Description                              |
| ------- | --------- | ---------------------------------------- |
| `heap`  | `*opaque` | Compatibility heap token; currently ignored. |
| `flags` | `uint32`  | Compatibility flags; currently ignored. |
| `bytes` | `uint`    | Number of bytes to map.                  |

## Returns

`*opaque` — the base address of the mapping, or `null` if allocation fails.

## Description

The binding creates a private anonymous mapping backed by the macOS virtual
memory system. Keep the exact `bytes` value alongside the returned pointer if
the mapping will later be released with [`Munmap`](munmap).

::: warning
No heap flags are implemented, including zero-initialization flags. Do not rely
on Win32 `HeapAlloc` flag behavior. `HeapFree` currently does not release the
mapping.
:::

## Example

```rux
import MacOS::{ GetProcessHeap, HeapAlloc, Munmap };

let size: uint = 4096u;
let memory = HeapAlloc(GetProcessHeap(), 0u32, size);
if memory == null {
    return 1i32;
}

// Use memory within the allocated range.
if Munmap(memory, size) != 0i64 {
    return 2i32;
}
```

## See also

- [`Heap and memory`](heap) — memory API overview
- [`Munmap`](munmap) — release the mapping

