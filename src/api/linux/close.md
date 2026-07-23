# `Close`

Closes a file descriptor.

**Package:** `Linux`

## Signature

```rux
func Close(fd: int32) -> int64;
```

## Parameters

| Name | Type    | Description               |
| ---- | ------- | ------------------------- |
| `fd` | `int32` | File descriptor to close. |

## Returns

`int64` — `0` on success, or a negative errno result on failure.

## Description

After a successful close, `fd` no longer refers to the resource and may be
reused by a later operation. Do not close a descriptor more than once.

::: warning
Retrying `Close` after an error is unsafe on Linux because the descriptor may
already have been released and reused. Handle the reported error without
blindly repeating the call.
:::

## Example

```rux
import Linux::{ Close, IsError };

func Main() -> int {
    if IsError(Close(fd)) {
        return 1;
    }
    return 0;
}
```

