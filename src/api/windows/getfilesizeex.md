# `GetFileSizeEx`

Retrieves the size of an open file.

**Package:** `Windows`

**Microsoft documentation:** [`GetFileSizeEx`](https://learn.microsoft.com/en-us/windows/win32/api/fileapi/nf-fileapi-getfilesizeex)

## Signature

```rux
func GetFileSizeEx(
    file: *opaque,
    size: *int64
) -> bool32;
```

## Parameters

| Name   | Description                           |
| ------ | ------------------------------------- |
| `file` | Open file handle.                     |
| `size` | Receives the file size in bytes.      |

## Returns

`bool32` — nonzero on success or zero on failure.

## See also

- [`SetFilePointerEx`](setfilepointerex) — move the file pointer
- [`Windows`](/api/windows/) — the package overview
