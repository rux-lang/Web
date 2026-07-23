# `CreateDirectoryA`

Creates a directory.

**Package:** `Windows`

**Microsoft documentation:** [`CreateDirectoryA`](https://learn.microsoft.com/en-us/windows/win32/api/fileapi/nf-fileapi-createdirectorya)

## Signature

```rux
func CreateDirectoryA(
    pathName: *char8,
    securityAttributes: *opaque
) -> bool32;
```

`pathName` must be a null-terminated ANSI path. Pass `null` for default
security attributes. The function creates one directory and does not create
missing parents. Returns nonzero on success.

## See also

- [`RemoveDirectoryA`](removedirectorya) — remove an empty directory
- [`Windows`](/api/windows/) — the package overview
