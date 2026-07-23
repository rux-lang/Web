# `HeapReAlloc`

Resizes a block allocated from a Win32 heap.

**Package:** `Windows`

**Microsoft documentation:** [`HeapReAlloc`](https://learn.microsoft.com/en-us/windows/win32/api/heapapi/nf-heapapi-heaprealloc)

## Signature

```rux
func HeapReAlloc(
    heap: *opaque,
    flags: uint32,
    mem: *opaque,
    bytes: uint
) -> *var opaque;
```

## Returns

`*opaque` — the resized block, or `null` on failure. On failure, `mem` remains
valid and must still be freed. Use the same heap that allocated the block.

::: warning
Do not overwrite the only copy of `mem` before checking the returned pointer.
:::

## See also

- [`HeapAlloc`](heapalloc) — allocate a block
- [`HeapFree`](heapfree) — release a block
- [`Windows`](/api/windows/) — the package overview
