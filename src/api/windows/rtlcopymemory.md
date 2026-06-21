# `RtlCopyMemory`

Copies bytes between non-overlapping memory ranges.

**Module:** `Windows`

**Microsoft documentation:** [`RtlCopyMemory`](https://learn.microsoft.com/en-us/previous-versions/windows/desktop/legacy/aa366535%28v=vs.85%29)

## Signature

```rux
func RtlCopyMemory(destination: *opaque, source: *const opaque,
    length: uint);
```

Both ranges must be valid for `length` bytes and must not overlap. Invalid
pointers, undersized buffers, or overlap can corrupt memory.

## See also

- [`Memory operations`](memory) — raw memory API overview
