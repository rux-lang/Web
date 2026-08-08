# GetFileAttributesA

Retrieves attributes for a file or directory.

**Package:** `Windows`

**Microsoft documentation:** [`GetFileAttributesA`](https://learn.microsoft.com/en-us/windows/win32/docs/api/fileapi/nf-fileapi-getfileattributesa)

## Signature

```rux
func GetFileAttributesA(
    fileName: *char8
) -> uint32;
```

## Returns

`uint32` — an attribute bitmask on success or `0xFFFFFFFF` on failure. Test
individual attributes with bitwise operations because several can be set.

## See also

- [`SetFileAttributesA`](/docs/api/windows/setfileattributesa) — change attributes
- [`Windows` types](/docs/api/windows/types) — shared type definitions
