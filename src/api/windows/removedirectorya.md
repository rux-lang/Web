# `RemoveDirectoryA`

Removes an empty directory.

**Package:** `Windows`

**Microsoft documentation:** [`RemoveDirectoryA`](https://learn.microsoft.com/en-us/windows/win32/api/fileapi/nf-fileapi-removedirectorya)

## Signature

```rux
func RemoveDirectoryA(
    pathName: *char8
) -> bool32;
```

`pathName` must be a null-terminated ANSI path. Returns nonzero on success or
zero on failure. The directory must be empty.

## See also

- [`CreateDirectoryA`](createdirectorya) — create a directory
- [`Windows`](/api/windows/) — the package overview
