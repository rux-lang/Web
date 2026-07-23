# `WriteFile`

Writes bytes to a file or I/O device.

**Package:** `Windows`

**Microsoft documentation:** [`WriteFile`](https://learn.microsoft.com/en-us/windows/win32/api/fileapi/nf-fileapi-writefile)

## Signature

```rux
func WriteFile(
    file: *opaque,
    buffer: *opaque,
    bytesToWrite: uint32,
    bytesWritten: *uint32,
    overlapped: *opaque
) -> bool32;
```

## Parameters

| Name           | Description                                      |
| -------------- | ------------------------------------------------ |
| `file`         | Open writable handle.                            |
| `buffer`       | Source buffer.                                   |
| `bytesToWrite` | Requested byte count.                            |
| `bytesWritten` | Receives the actual count for synchronous I/O.   |
| `overlapped`   | Overlapped state, or `null` for synchronous I/O. |

## Returns

`bool32` — nonzero on completed success or zero on failure/pending overlapped
I/O. A successful device write can report fewer bytes than requested.

## See also

- [`ReadFile`](readfile) — read bytes
- [`Windows`](/api/windows/) — the package overview
