# `FindNextFileA`

Retrieves the next entry from a file search.

**Module:** `Windows`

**Microsoft documentation:** [`FindNextFileA`](https://learn.microsoft.com/en-us/windows/win32/api/fileapi/nf-fileapi-findnextfilea)

## Signature

```rux
func FindNextFileA(findFile: *opaque,
    findFileData: *Win32FindDataA) -> bool32;
```

Returns nonzero when another result was written. A zero return with
`ERROR_NO_MORE_FILES` from [`GetLastError`](getlasterror) means enumeration is
complete; other error codes indicate failure.

## See also

- [`FindFirstFileA`](findfirstfilea) — start a search
- [`FindClose`](findclose) — release the search handle
