# `SetFilePointerEx`

Moves the file pointer of an open file.

**Module:** `Windows`

**Microsoft documentation:** [`SetFilePointerEx`](https://learn.microsoft.com/en-us/windows/win32/api/fileapi/nf-fileapi-setfilepointerex)

## Signature

```rux
func SetFilePointerEx(file: *opaque, distance: int64, newPos: *int64,
    moveMethod: SeekOrigin) -> bool32;
```

## Parameters

| Name         | Description                                      |
| ------------ | ------------------------------------------------ |
| `file`       | Open seekable handle.                            |
| `distance`   | Signed displacement from the selected origin.    |
| `newPos`     | Receives the absolute position, or `null`.        |
| `moveMethod` | `Begin`, `Current`, or `End`.                     |

## Returns

`bool32` — nonzero on success or zero on failure.

## See also

- [`SeekOrigin`](types#seekorigin) — supported origins
- [`File I/O`](files) — file API overview
