# `Close`

Closes a file descriptor.

**Module:** `BSD`

## Signature

```rux
func Close(fd: int32) -> int64;
```

## Parameters

| Name | Type    | Description               |
| ---- | ------- | ------------------------- |
| `fd` | `int32` | File descriptor to close. |

## Returns

`int64` - `0` on success, or the thunk's raw error result on failure.

After success, the descriptor may be reused and must not be closed again.

::: warning
Do not blindly retry `Close` after an error. The descriptor's state may be
uncertain and its number may have been reused.
:::

## See also

- [`I/O`](io) - I/O overview
