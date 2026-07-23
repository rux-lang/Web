# `Read`

Reads bytes from a file descriptor.

**Package:** `Bsd`

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

`int64` - bytes read on success, `0` at end of file, or a negative errno value on failure. A successful call may return fewer than `count` bytes.


## Example

```rux
import Bsd::{ Read, StdIn };

func Main() -> int {
    var buffer: char8[256];
    let result = Read(StdIn, buffer.data, 256u);
    if result == 0i64 {
        // End of file.
    }
    return 0;
}
```

## See also

- [`Bsd`](/api/bsd/) — the package overview
- [`Write`](write) - write bytes
