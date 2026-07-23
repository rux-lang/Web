# `Write`

Writes bytes to a file descriptor.

**Package:** `Bsd`

## Signature

```rux
func Write(fd: int32, buffer: *opaque, count: uint) -> int64;
```

## Parameters

| Name     | Type            | Description                               |
| -------- | --------------- | ----------------------------------------- |
| `fd`     | `int32`         | File descriptor to write.                 |
| `buffer` | `*opaque` | Source containing at least `count` bytes. |
| `count`  | `uint`          | Number of bytes requested.                |

## Returns

`int64` - bytes written on success, or a negative errno value on failure.
A successful call may write fewer than `count` bytes.


## Example

```rux
import Bsd::{ StdOut, Write };

func Main() -> int {
    let text = "hello\n";
    let result = Write(StdOut, text.data, text.length);
    if result != text.length as int64 {
        return 1;
    }
    return 0;
}
```

## See also

- [`Bsd`](/api/bsd/) — the package overview
- [`Read`](read) - read bytes
