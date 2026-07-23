# `Syscall0`–`Syscall6`

Invoke an arbitrary Linux x86-64 syscall with zero to six arguments.

**Package:** `Linux`

## Signatures

```rux
func Syscall0(number: uint64) -> int64;
func Syscall1(number: uint64, arg0: uint64) -> int64;
func Syscall2(number: uint64, arg0: uint64, arg1: uint64) -> int64;
func Syscall3(number: uint64, arg0: uint64, arg1: uint64, arg2: uint64) -> int64;
func Syscall4(number: uint64, arg0: uint64, arg1: uint64, arg2: uint64, arg3: uint64) -> int64;
func Syscall5(number: uint64, arg0: uint64, arg1: uint64, arg2: uint64, arg3: uint64, arg4: uint64) -> int64;
func Syscall6(number: uint64, arg0: uint64, arg1: uint64, arg2: uint64, arg3: uint64, arg4: uint64, arg5: uint64) -> int64;
```

## Parameters

| Name     | Type     | Description                                      |
| -------- | -------- | ------------------------------------------------ |
| `number` | `uint64` | Linux x86-64 syscall number.                     |
| `arg0`…`arg5` | `uint64` | Arguments in the order required by the syscall ABI. |

Pointers and signed values must be converted to their raw 64-bit
representations before being passed.

## Returns

`int64` — the raw kernel result. Use [`IsError`](iserror) before interpreting
the value as a successful result.

## Description

Choose the function whose suffix matches the syscall's argument count. These
entry points perform no validation, type conversion, retry, or resource
management.

::: danger
An incorrect syscall number, argument count, pointer, or buffer length can
corrupt memory, leak resources, or terminate the process. Prefer a typed
wrapper when the package provides one.
:::

## Example

```rux
import Linux::{ IsError, SYS_GETPID, Syscall0 };

func Main() -> int {
    let result = Syscall0(SYS_GETPID);
    if !IsError(result) {
        let pid = result;
    }
    return 0;
}
```

## See also

- [`Constants`](types) — exported syscall numbers
- [`IsError`](iserror) — test the raw result
- [`Errno`](errno) — decode an error result

