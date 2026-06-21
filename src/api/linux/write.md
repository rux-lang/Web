# `Write`

Writes bytes to a file descriptor.

**Module:** `Linux`

## Signature

```rux
func Write(fd: int32, buffer: *const opaque, count: uint) -> int64;
```

## Parameters

| Name     | Type            | Description                              |
| -------- | --------------- | ---------------------------------------- |
| `fd`     | `int32`         | File descriptor to write.                |
| `buffer` | `*const opaque` | Source containing at least `count` bytes.|
| `count`  | `uint`          | Number of bytes requested.               |

## Returns

`int64` — bytes written on success, or a negative errno result on failure.

## Description

`Write` is a thin wrapper around Linux `write(2)`. A successful call may write
fewer than `count` bytes. Code that must emit the complete buffer should
advance the pointer and repeat until all bytes are written or an error occurs.

## Example

```rux
import Linux::{ IsError, Stdout, Write };

let message = "hello\n";
let result = Write(Stdout, message.data, message.length);
if IsError(result) || result != message.length as int64 {
    return 1i32;
}
```

## See also

- [`Read`](read) — read bytes from a descriptor
- [`Close`](close) — close a descriptor

