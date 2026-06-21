# `FindClose`

Closes a file-search handle.

**Module:** `Windows`

**Microsoft documentation:** [`FindClose`](https://learn.microsoft.com/en-us/windows/win32/api/fileapi/nf-fileapi-findclose)

## Signature

```rux
func FindClose(findFile: *opaque) -> bool32;
```

Returns nonzero on success or zero on failure. Call it exactly once for every
successful [`FindFirstFileA`](findfirstfilea), including when enumeration stops
early. Search handles must not be passed to `CloseHandle`.

## See also

- [`File enumeration`](enumeration) — enumeration overview
