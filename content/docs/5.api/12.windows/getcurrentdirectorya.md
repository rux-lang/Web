# GetCurrentDirectoryA

Retrieves the process current directory.

**Package:** `Windows`

**Microsoft documentation:** [`GetCurrentDirectoryA`](https://learn.microsoft.com/en-us/windows/win32/docs/api/winbase/nf-winbase-getcurrentdirectorya)

## Signature

```rux
func GetCurrentDirectoryA(
    bufferLength: uint32,
    buffer: *char8
) -> uint32;
```

## Returns

When the buffer is large enough, returns the path length excluding the null
terminator. If too small, returns the required size including the terminator.
Returns `0` on failure. `bufferLength` is measured in narrow characters.

## See also

- [`SetCurrentDirectoryA`](/docs/api/windows/setcurrentdirectorya) — change the current directory
- [`Windows`](/docs/api/windows) — the package overview
