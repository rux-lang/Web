# Heap

Allocation through the calling process's default heap.

**Module:** `Windows`

| Function                           | Description                              |
| ---------------------------------- | ---------------------------------------- |
| [`GetProcessHeap`](getprocessheap) | Retrieve the default process heap.       |
| [`HeapAlloc`](heapalloc)           | Allocate a block from a heap.            |
| [`HeapFree`](heapfree)             | Release a heap block.                    |
| [`HeapReAlloc`](heaprealloc)       | Resize a heap block.                     |

An allocation must be reallocated and freed through the same heap that created
it. The process heap handle itself is owned by Windows.

