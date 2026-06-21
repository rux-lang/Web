# `DeleteFileA`

Marks an existing file for deletion.

**Module:** `Windows`

**Microsoft documentation:** [`DeleteFileA`](https://learn.microsoft.com/en-us/windows/win32/api/fileapi/nf-fileapi-deletefilea)

## Signature

```rux
func DeleteFileA(fileName: *const char8) -> bool32;
```

`fileName` must be a null-terminated ANSI path. Returns nonzero on success or
zero on failure. Actual removal can be deferred until all open handles permit
deletion and are closed.

## See also

- [`Filesystem`](filesystem) — filesystem API overview
