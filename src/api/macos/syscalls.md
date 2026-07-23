# Syscalls

Invoke arbitrary Darwin (macOS) x86-64 syscalls and inspect raw results.

**Package:** `MacOS`

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

Choose the function whose suffix matches the syscall's argument count. On Darwin
the number must be **class-qualified**: Unix/BSD calls carry
`UnixSyscallClass` (`0x02000000`) in bits 24-31, so pass a complete value such
as `SysRead`, not the bare ordinal. Every argument must match the x86-64 System
V calling convention, with pointers and signed values converted to raw 64-bit
representations.

## Returns

`int64` - the kernel result: a non-negative value on success, or a negative
errno (`-1` through `-4095`) on failure. No validation, type conversion, retry,
or resource management is performed. Use [`IsError`](iserror) and
[`Errno`](errno) to interpret it.

::: danger
An incorrect syscall number, argument count, pointer, or buffer length can
corrupt memory, leak resources, or terminate the process. Prefer a typed
wrapper when one exists.
:::

## Error Helpers

| Function             | Description                                            |
| -------------------- | ------------------------------------------------------ |
| [`Errno`](errno)     | Return the positive errno of a failing result, else 0. |
| [`IsError`](iserror) | Test whether a result is a negative errno.             |

## See also

- [`MacOS`](/api/macos/) — the package overview
- [`Types and constants`](types) - class-qualified syscall numbers
