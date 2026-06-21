# Memory

Low-level virtual-memory and program-break operations.

**Module:** `BSD`

| Function           | Description                       |
| ------------------ | --------------------------------- |
| [`Brk`](brk)       | Change the process program break. |
| [`Mmap`](mmap)     | Create a virtual-memory mapping.  |
| [`Munmap`](munmap) | Remove a virtual-memory mapping.  |

::: warning
These functions bypass the runtime allocator. Incorrect addresses, sizes, or
flags can corrupt process state. Prefer `Std::Memory` for ordinary allocation.
:::
