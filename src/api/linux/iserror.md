# `IsError`

Tests whether a raw syscall result encodes a Linux error.

**Package:** `Linux`

## Signature

```rux
func IsError(result: int64) -> bool;
```

## Parameters

| Name     | Type    | Description                |
| -------- | ------- | -------------------------- |
| `result` | `int64` | Raw syscall return value.  |

## Returns

`bool` — `true` when `result` is in the Linux error range `-4095` through
`-1`; otherwise `false`.

## Example

```rux
import Linux::{ Errno, IsError, Read, StdIn };

func Main() -> int {
    let result = Read(StdIn, buffer, capacity);
    if IsError(result) {
        let errorNumber = Errno(result);
    }
    return 0;
}
```

## See also

- [`Errno`](errno) — convert an error result to positive errno
- [`Syscall0`–`Syscall6`](syscalls) — raw syscall entry points

