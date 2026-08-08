# FindNextFileA

Retrieves the next entry from a file search.

**Package:** `Windows`

**Microsoft documentation:** [`FindNextFileA`](https://learn.microsoft.com/en-us/windows/win32/docs/api/fileapi/nf-fileapi-findnextfilea)

## Signature

```rux
func FindNextFileA(
    findFile: *opaque,
    findFileData: *Win32FindDataA
) -> bool32;
```

Returns nonzero when another result was written. A zero return with
`ERROR_NO_MORE_FILES` from [`GetLastError`](/docs/api/windows/getlasterror) means enumeration is
complete; other error codes indicate failure.

## See also

- [`FindFirstFileA`](/docs/api/windows/findfirstfilea) — start a search
- [`FindClose`](/docs/api/windows/findclose) — release the search handle
