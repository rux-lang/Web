# `SetFileAttributesA`

Sets attributes for a file or directory.

**Package:** `Windows`

**Microsoft documentation:** [`SetFileAttributesA`](https://learn.microsoft.com/en-us/windows/win32/api/fileapi/nf-fileapi-setfileattributesa)

## Signature

```rux
func SetFileAttributesA(
    fileName: *char8,
    fileAttributes: uint32
) -> bool32;
```

`fileName` must be a null-terminated ANSI path. `fileAttributes` is a bitmask of
the Win32 `FILE_ATTRIBUTE_*` values; the normal-file flag must be used alone.
Returns nonzero on success or zero on failure.

## See also

- [`Windows`](/api/windows/) — the package overview
- [`GetFileAttributesA`](getfileattributesa) — retrieve attributes
