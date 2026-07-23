# `Read`

Reads bytes from a file descriptor.

**Package:** `Linux`

## Signature

```rux
func Read(fd: int32, buffer: *opaque, count: uint) -> int64;
```

## Parameters

| Name     | Type      | Description                                  |
| -------- | --------- | -------------------------------------------- |
| `fd`     | `int32`   | File descriptor to read.                     |
| `buffer` | `*opaque` | Writable destination for up to `count` bytes.|
| `count`  | `uint`    | Maximum number of bytes to read.             |

## Returns

`int64` — bytes read on success, `0` at end of file, or a negative errno
result on failure.

## Description

`Read` is a thin wrapper around Linux `read(2)`. A successful call may return
fewer than `count` bytes. The caller owns `buffer` and must ensure it remains
writable for the requested range.

::: warning
Do not use the return value as a length until [`IsError`](iserror) has ruled out
a negative result.
:::

## Example

```rux
import Linux::{ IsError, Read, StdIn };

func Main() -> int {
    var buffer: char8[256];
    let result = Read(StdIn, buffer.data, 256u);
    if IsError(result) {
        return 1;
    }
    let bytesRead = result as uint;
    return 0;
}
```

## See also

- [`Write`](write) — write bytes to a descriptor
- [`Close`](close) — close a descriptor

