# `IsError`

Tests whether a result is in the package's positive errno range.

**Module:** `BSD`

## Signature

```rux
func IsError(result: int64) -> bool;
```

## Parameters

| Name     | Type    | Description               |
| -------- | ------- | ------------------------- |
| `result` | `int64` | Raw syscall return value. |

## Returns

`bool` - `true` when `result` is from `1` through `4095`; otherwise `false`.

::: danger
This range overlaps legitimate success values. Successful small reads and
writes return byte counts in this range, and a valid process ID may also fall
in it. Use the called operation's contract to decide whether `IsError` is
appropriate.
:::

## See also

- [`Errno`](errno) - return the positive value
- [`Raw syscalls`](syscalls) - raw syscall entry points
