# `MoveFileA`

Moves or renames a file or directory.

**Package:** `Windows`

**Microsoft documentation:** [`MoveFileA`](https://learn.microsoft.com/en-us/windows/win32/api/winbase/nf-winbase-movefilea)

## Signature

```rux
func MoveFileA(
    existingFileName: *char8,
    newFileName: *char8
) -> bool32;
```

Both names must be null-terminated ANSI paths. Returns nonzero on success or
zero on failure. `MoveFileA` does not provide replacement flags for an existing
destination.

## See also

- [`CopyFileA`](copyfilea) — copy a file
- [`Windows`](/api/windows/) — the package overview
