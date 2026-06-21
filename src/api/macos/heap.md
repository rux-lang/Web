# Heap and Memory

Virtual-memory allocation through the Rux macOS compatibility layer.

**Module:** `MacOS`

| Function                                  | Description                              |
| ----------------------------------------- | ---------------------------------------- |
| [`GetProcessHeap`](getprocessheap)        | Return the compatibility heap token.     |
| [`HeapAlloc`](heapalloc)                  | Allocate an anonymous memory mapping.    |
| [`HeapFree`](heapfree)                    | Report success without releasing memory. |
| [`Munmap`](munmap)                        | Release a complete memory mapping.       |

::: danger Current release behavior
`HeapFree` is currently a no-op. To release a `HeapAlloc` mapping, retain its
exact allocation size and call [`Munmap`](munmap) with the original base
address and size.
:::

