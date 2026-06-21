# `MoveFileA`

Moves or renames a file or directory.

**Module:** `Windows`

**Microsoft documentation:** [`MoveFileA`](https://learn.microsoft.com/en-us/windows/win32/api/winbase/nf-winbase-movefilea)

## Signature

```rux
func MoveFileA(existingFileName: *const char8,
    newFileName: *const char8) -> bool32;
```

Both names must be null-terminated ANSI paths. Returns nonzero on success or
zero on failure. `MoveFileA` does not provide replacement flags for an existing
destination.

## See also

- [`CopyFileA`](copyfilea) — copy a file
- [`Filesystem`](filesystem) — filesystem API overview
