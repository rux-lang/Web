# `WriteFile`

Writes bytes to a file or device.

**Module:** `MacOS`

## Signature

```rux
func WriteFile(
    file: *opaque,
    buffer: *const opaque,
    bytesToWrite: uint32,
    bytesWritten: *uint32,
    overlapped: *opaque
) -> bool32;
```

## Parameters

| Name           | Type            | Description                                    |
| -------------- | --------------- | ---------------------------------------------- |
| `file`         | `*opaque`       | BSD file descriptor encoded as a pointer.      |
| `buffer`       | `*const opaque` | Source containing at least `bytesToWrite` bytes.|
| `bytesToWrite` | `uint32`        | Number of bytes requested.                     |
| `bytesWritten` | `*uint32`       | Receives the number of bytes actually written. |
| `overlapped`   | `*opaque`       | Compatibility parameter; pass `null`.          |

## Returns

`bool32` — nonzero when the underlying write succeeds; zero when it fails.

## Description

The operation is synchronous. A successful call may write fewer than
`bytesToWrite` bytes, so callers that require complete output must check
`bytesWritten` and continue from the first unwritten byte.

::: warning
This binding does not expose the underlying macOS error number or retry partial
or interrupted writes.
:::

## Example

```rux
import MacOS::{ GetStdHandle, StdHandle, WriteFile };

let message = c8"hello\n";
var written: uint32 = 0;
let output = GetStdHandle(StdHandle::Output);
let ok = WriteFile(output, message.data, message.length as uint32,
    &written, null);
if ok == 0 || written != message.length as uint32 {
    return 1i32;
}
```

## See also

- [`Console and I/O`](console) — I/O overview
- [`ReadFile`](readfile) — read bytes

