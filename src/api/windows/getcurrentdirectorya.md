# `GetCurrentDirectoryA`

Retrieves the process current directory.

**Module:** `Windows`

**Microsoft documentation:** [`GetCurrentDirectoryA`](https://learn.microsoft.com/en-us/windows/win32/api/winbase/nf-winbase-getcurrentdirectorya)

## Signature

```rux
func GetCurrentDirectoryA(bufferLength: uint32, buffer: *char8) -> uint32;
```

## Returns

When the buffer is large enough, returns the path length excluding the null
terminator. If too small, returns the required size including the terminator.
Returns `0` on failure. `bufferLength` is measured in narrow characters.

## See also

- [`SetCurrentDirectoryA`](setcurrentdirectorya) — change the current directory
- [`Filesystem`](filesystem) — filesystem API overview
