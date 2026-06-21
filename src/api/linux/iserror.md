# `IsError`

Tests whether a raw syscall result encodes a Linux error.

**Module:** `Linux`

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
import Linux::{ Errno, IsError, Read, Stdin };

let result = Read(Stdin, buffer, capacity);
if IsError(result) {
    let errorNumber = Errno(result);
}
```

## See also

- [`Errno`](errno) — convert an error result to positive errno
- [`Syscall0`–`Syscall6`](syscalls) — raw syscall entry points

