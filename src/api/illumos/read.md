# `Read`

Reads bytes from a file descriptor.

**Module:** `Illumos`

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

`int64` - bytes read on success, `0` at end of file, or the thunk's raw error
result on failure. A successful call may return fewer than `count` bytes.

::: danger Error ambiguity
A successful byte count from `1` through `4095` also satisfies the current
[`IsError`](iserror) range check. Do not use `IsError` alone to interpret a
`Read` result.
:::

## Example

```rux
import Illumos::{ Read, Stdin };

var buffer: char8[256];
let result = Read(Stdin, buffer.data, 256u);
if result == 0i64 {
    // End of file.
}
```

## See also

- [`I/O`](io) - I/O overview
- [`Write`](write) - write bytes
