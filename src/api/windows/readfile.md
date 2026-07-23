# `ReadFile`

Reads bytes from a file or I/O device.

**Package:** `Windows`

**Microsoft documentation:** [`ReadFile`](https://learn.microsoft.com/en-us/windows/win32/api/fileapi/nf-fileapi-readfile)

## Signature

```rux
func ReadFile(
    file: *opaque,
    buffer: *opaque,
    numberOfBytesToRead: uint32,
    numberOfBytesRead: *uint32,
    overlapped: *opaque
) -> bool32;
```

## Parameters

| Name                  | Description                                      |
| --------------------- | ------------------------------------------------ |
| `file`                | Open readable handle.                            |
| `buffer`              | Writable destination buffer.                     |
| `numberOfBytesToRead` | Maximum requested byte count.                    |
| `numberOfBytesRead`   | Receives the actual count for synchronous I/O.   |
| `overlapped`          | Overlapped state, or `null` for synchronous I/O. |

## Returns

`bool32` — nonzero on completed success or zero on failure/pending overlapped
I/O. A successful synchronous read can return fewer bytes than requested; zero
bytes can indicate end of file.

## See also

- [`WriteFile`](writefile) — write bytes
- [`Windows`](/api/windows/) — the package overview
