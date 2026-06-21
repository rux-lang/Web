# `CopyFileA`

Copies an existing file to a new path.

**Module:** `Windows`

**Microsoft documentation:** [`CopyFileA`](https://learn.microsoft.com/en-us/windows/win32/api/winbase/nf-winbase-copyfilea)

## Signature

```rux
func CopyFileA(existingFileName: *const char8,
    newFileName: *const char8, failIfExists: bool32) -> bool32;
```

Both names must be null-terminated ANSI paths. When `failIfExists` is nonzero,
the call fails rather than overwriting an existing destination. Returns nonzero
on success.

## See also

- [`MoveFileA`](movefilea) — move or rename
- [`Filesystem`](filesystem) — filesystem API overview
