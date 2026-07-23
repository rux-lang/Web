# `IsError`

Tests whether a raw syscall result is an error.

**Package:** `Bsd`

## Signature

```rux
func IsError(result: int64) -> bool;
```

## Parameters

| Name     | Type    | Description               |
| -------- | ------- | ------------------------- |
| `result` | `int64` | Raw syscall return value. |

## Returns

`bool` - `true` when `result` is a negative errno in the range `-1` through
`-4095`; otherwise `false`.

The wrappers report failure as a small negative value, so a non-negative
result — a byte count, a process ID, a mapped address, or `0` — is always a
success. `IsError` therefore never misclassifies a legitimate result.

## Example

```rux
import Bsd::{ IsError, Mmap, MapAnonymous, MapPrivate, ProtectionRead, ProtectionWrite };

func Main() -> int {
    let result = Mmap(null, 4096u, ProtectionRead | ProtectionWrite,
        MapPrivate | MapAnonymous, -1i32, 0u64);
    if IsError(result) {
        return 1;
    }
    return 0;
}
```

## See also

- [`Bsd`](/api/bsd/) — the package overview
- [`Errno`](errno) - extract the positive errno value
- [`Syscall0`–`Syscall6`](syscalls) - raw syscall entry points
