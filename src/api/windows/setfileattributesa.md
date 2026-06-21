# `SetFileAttributesA`

Sets attributes for a file or directory.

**Module:** `Windows`

**Microsoft documentation:** [`SetFileAttributesA`](https://learn.microsoft.com/en-us/windows/win32/api/fileapi/nf-fileapi-setfileattributesa)

## Signature

```rux
func SetFileAttributesA(fileName: *const char8,
    fileAttributes: FileAttributes) -> bool32;
```

`fileName` must be a null-terminated ANSI path. Returns nonzero on success or
zero on failure. `FileAttributes.Normal` must be used alone; other compatible
attribute flags may be combined where the language permits.

## See also

- [`GetFileAttributesA`](getfileattributesa) — retrieve attributes
- [`FileAttributes`](types#fileattributes) — known flags
