# `GetFileAttributesA`

Retrieves attributes for a file or directory.

**Module:** `Windows`

**Microsoft documentation:** [`GetFileAttributesA`](https://learn.microsoft.com/en-us/windows/win32/api/fileapi/nf-fileapi-getfileattributesa)

## Signature

```rux
func GetFileAttributesA(fileName: *const char8) -> uint32;
```

## Returns

`uint32` — an attribute bitmask on success or `0xFFFFFFFF` on failure. Test
individual attributes with bitwise operations because several can be set.

## See also

- [`SetFileAttributesA`](setfileattributesa) — change attributes
- [`FileAttributes`](types#fileattributes) — known flags
