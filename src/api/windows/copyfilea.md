# `CopyFileA`

Copies an existing file to a new path.

**Package:** `Windows`

**Microsoft documentation:** [`CopyFileA`](https://learn.microsoft.com/en-us/windows/win32/api/winbase/nf-winbase-copyfilea)

## Signature

```rux
func CopyFileA(
    existingFileName: *char8,
    newFileName: *char8,
    failIfExists: bool32
) -> bool32;
```

Both names must be null-terminated ANSI paths. When `failIfExists` is nonzero,
the call fails rather than overwriting an existing destination. Returns nonzero
on success.

## See also

- [`MoveFileA`](movefilea) — move or rename
- [`Windows`](/api/windows/) — the package overview
