# HeapReAlloc

Resizes a block allocated from a Win32 heap.

**Package:** `Windows`

**Microsoft documentation:** [`HeapReAlloc`](https://learn.microsoft.com/en-us/windows/win32/docs/api/heapapi/nf-heapapi-heaprealloc)

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

::warning
Do not overwrite the only copy of `mem` before checking the returned pointer.
::

## See also

- [`HeapAlloc`](/docs/api/windows/heapalloc) — allocate a block
- [`HeapFree`](/docs/api/windows/heapfree) — release a block
- [`Windows`](/docs/api/windows) — the package overview
