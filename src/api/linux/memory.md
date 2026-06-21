# Memory

Low-level Linux virtual-memory and program-break operations.

**Module:** `Linux`

| Function           | Description                       |
| ------------------ | --------------------------------- |
| [`Brk`](brk)       | Invoke the raw program-break operation. |
| [`Mmap`](mmap)     | Create a virtual-memory mapping.  |
| [`Munmap`](munmap) | Remove a virtual-memory mapping.  |

::: warning
These functions bypass the runtime allocator. Incorrect addresses, sizes, or
flags can corrupt process state. Prefer `Std::Memory` for ordinary allocation.
:::
