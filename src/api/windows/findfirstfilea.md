# `FindFirstFileA`

Starts a file search and returns its first matching entry.

**Module:** `Windows`

**Microsoft documentation:** [`FindFirstFileA`](https://learn.microsoft.com/en-us/windows/win32/api/fileapi/nf-fileapi-findfirstfilea)

## Signature

```rux
func FindFirstFileA(fileName: *const char8,
    findFileData: *Win32FindDataA) -> *opaque;
```

`fileName` is a null-terminated ANSI path pattern and may contain wildcards.
`findFileData` receives the first result. Returns a search handle on success or
`INVALID_HANDLE_VALUE` on failure. Release the search handle with
[`FindClose`](findclose), not `CloseHandle`.

## See also

- [`FindNextFileA`](findnextfilea) — continue the search
- [`File enumeration`](enumeration) — enumeration overview
