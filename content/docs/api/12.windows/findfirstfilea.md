# FindFirstFileA

Starts a file search and returns its first matching entry.

**Package:** `Windows`

**Microsoft documentation:** [`FindFirstFileA`](https://learn.microsoft.com/en-us/windows/win32/docs/api/fileapi/nf-fileapi-findfirstfilea)

## Signature

```rux
func FindFirstFileA(
    fileName: *char8,
    findFileData: *Win32FindDataA
) -> *opaque;
```

`fileName` is a null-terminated ANSI path pattern and may contain wildcards.
`findFileData` receives the first result. Returns a search handle on success, or
the invalid-handle sentinel (`-1` as a handle) on failure. Release the search
handle with [`FindClose`](/docs/api/windows/findclose), not `CloseHandle`.

## See also

- [`FindNextFileA`](/docs/api/windows/findnextfilea) — continue the search
- [`Windows`](/docs/api/windows) — the package overview
