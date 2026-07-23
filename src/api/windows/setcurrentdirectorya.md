# `SetCurrentDirectoryA`

Changes the process current directory.

**Package:** `Windows`

**Microsoft documentation:** [`SetCurrentDirectoryA`](https://learn.microsoft.com/en-us/windows/win32/api/winbase/nf-winbase-setcurrentdirectorya)

## Signature

```rux
func SetCurrentDirectoryA(
    pathName: *char8
) -> bool32;
```

`pathName` must be a null-terminated ANSI path. Returns nonzero on success.
The current directory is process-wide state, so changing it can affect other
threads and relative-path operations.

## See also

- [`GetCurrentDirectoryA`](getcurrentdirectorya) — retrieve the current directory
- [`Windows`](/api/windows/) — the package overview
