# `Errno`

Extracts the positive errno from a raw syscall result.

**Package:** `Bsd`

## Signature

```rux
func Errno(result: int64) -> int64;
```

## Parameters

| Name     | Type    | Description               |
| -------- | ------- | ------------------------- |
| `result` | `int64` | Raw syscall return value. |

## Returns

`int64` - the positive errno (`1` through `4095`) when `result` is a negative
errno in the range `-1` through `-4095`, or `0` for any other value, which the
package treats as success.

`Errno` does not read or modify a global or thread-local errno variable. It
negates the result when [`IsError`](iserror) reports one, and returns `0`
otherwise.

## Example

```rux
import Bsd::{ Close, Errno };

func Main() -> int {
    let code = Errno(Close(3));
    if code != 0i64 {
        // The close failed with errno `code`.
    }
    return 0;
}
```

## See also

- [`Bsd`](/api/bsd/) — the package overview
- [`IsError`](iserror) - test whether a result is an error
- [`Syscall0`–`Syscall6`](syscalls) - raw syscall entry points
