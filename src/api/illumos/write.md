# `Write`

Writes bytes to a file descriptor.

**Module:** `Illumos`

## Signature

```rux
func Write(fd: int32, buffer: *const opaque, count: uint) -> int64;
```

## Parameters

| Name     | Type            | Description                               |
| -------- | --------------- | ----------------------------------------- |
| `fd`     | `int32`         | File descriptor to write.                 |
| `buffer` | `*const opaque` | Source containing at least `count` bytes. |
| `count`  | `uint`          | Number of bytes requested.                |

## Returns

`int64` - bytes written on success, or the thunk's raw error result on failure.
A successful call may write fewer than `count` bytes.

::: danger Error ambiguity
A successful byte count from `1` through `4095` also satisfies the current
[`IsError`](iserror) range check. For fixed output, compare the result with the
requested byte count and handle partial writes explicitly.
:::

## Example

```rux
import Illumos::{ Stdout, Write };

let text = "hello\n";
let result = Write(Stdout, text.data, text.length);
if result != text.length as int64 {
    return 1i32;
}
```

## See also

- [`I/O`](io) - I/O overview
- [`Read`](read) - read bytes
