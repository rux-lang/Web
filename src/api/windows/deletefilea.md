# `DeleteFileA`

Marks an existing file for deletion.

**Package:** `Windows`

**Microsoft documentation:** [`DeleteFileA`](https://learn.microsoft.com/en-us/windows/win32/api/fileapi/nf-fileapi-deletefilea)

## Signature

```rux
func DeleteFileA(fileName: *char8) -> bool32;
```

`fileName` must be a null-terminated ANSI path. Returns nonzero on success or
zero on failure. Actual removal can be deferred until all open handles permit
deletion and are closed.

## See also

- [`Windows`](/api/windows/) — the package overview
