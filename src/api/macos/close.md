# `Close`

Closes a file descriptor.

**Package:** `MacOS`

## Signature

```rux
func Close(fd: int32) -> int64;
```

## Parameters

| Name | Type    | Description               |
| ---- | ------- | ------------------------- |
| `fd` | `int32` | File descriptor to close. |

## Returns

`int64` - `0` on success, or a negative errno value on failure.

After success, the descriptor may be reused and must not be closed again.

::: warning
Do not blindly retry `Close` after an error. The descriptor's state may be
uncertain and its number may have been reused.
:::

## See also

- [`MacOS`](/api/macos/) — the package overview
