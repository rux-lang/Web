# `ReadFile`

Reads bytes from a file or device.

**Module:** `MacOS`

## Signature

```rux
func ReadFile(
    file: *opaque,
    buffer: *opaque,
    bytesToRead: uint32,
    bytesRead: *uint32,
    overlapped: *opaque
) -> bool32;
```

## Parameters

| Name          | Type      | Description                                      |
| ------------- | --------- | ------------------------------------------------ |
| `file`        | `*opaque` | BSD file descriptor encoded as a pointer.        |
| `buffer`      | `*opaque` | Writable buffer for up to `bytesToRead` bytes.   |
| `bytesToRead` | `uint32`  | Maximum number of bytes to read.                 |
| `bytesRead`   | `*uint32` | Receives the number of bytes actually read.      |
| `overlapped`  | `*opaque` | Compatibility parameter; pass `null`.            |

## Returns

`bool32` — nonzero when the underlying read succeeds, including an end-of-file
result of zero bytes; zero when it fails.

## Description

The operation is synchronous and may return fewer than `bytesToRead` bytes.
The caller must provide a writable buffer large enough for the requested count
and a valid `bytesRead` pointer.

::: warning
This binding does not expose the underlying macOS error number. It also does
not automatically retry a read interrupted by a signal.
:::

## Example

```rux
import MacOS::{ GetStdHandle, ReadFile, StdHandle };

var buffer: char8[256];
var count: uint32 = 0;
let input = GetStdHandle(StdHandle::Input);
if ReadFile(input, buffer.data, 256u32, &count, null) == 0 {
    return 1i32;
}
```

## See also

- [`Console and I/O`](console) — I/O overview
- [`WriteFile`](writefile) — write bytes

