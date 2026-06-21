# `Errno`

Returns a value that falls in the package's positive errno range.

**Module:** `BSD`

## Signature

```rux
func Errno(result: int64) -> int64;
```

## Parameters

| Name     | Type    | Description               |
| -------- | ------- | ------------------------- |
| `result` | `int64` | Raw syscall return value. |

## Returns

`int64` - `result` unchanged when it is from `1` through `4095`, or `0` for any
other value.

`Errno` does not read or modify a global or thread-local errno variable. It
only applies the same range test as [`IsError`](iserror).

::: danger
Because small positive success results occupy the same range, a nonzero return
from `Errno` does not by itself prove that the syscall failed.
:::

## See also

- [`IsError`](iserror) - test the same range
- [`Raw syscalls`](syscalls) - raw syscall entry points
