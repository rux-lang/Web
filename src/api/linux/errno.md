# `Errno`

Decodes the errno value from a raw syscall result.

**Package:** `Linux`

## Signature

```rux
func Errno(result: int64) -> int64;
```

## Parameters

| Name     | Type    | Description               |
| -------- | ------- | ------------------------- |
| `result` | `int64` | Raw syscall return value. |

## Returns

`int64` — the positive errno value when `result` is between `-4095` and `-1`,
or `0` when the value does not encode an error.

## Description

`Errno` does not read or modify a global or thread-local errno variable. It
only decodes the supplied kernel return value.

::: tip
Call [`IsError`](iserror) when you need to distinguish success from failure.
`Errno(result) == 0` means the input was not an encoded syscall error.
:::

## Example

```rux
import Linux::{ Errno, IsError, Write };

func Main() -> int {
    let result = Write(fd, data, length);
    if IsError(result) {
        let errorNumber = Errno(result);
    }
    return 0;
}
```

## See also

- [`IsError`](iserror) — test a raw result
