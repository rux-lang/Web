# Raw Syscalls

Invoke arbitrary Illumos x86-64 syscalls and inspect raw results.

**Module:** `Illumos`

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

Choose the function whose suffix matches the syscall's argument count.
`number` is an Illumos x86-64 syscall number; `arg0` through `arg5` are its
arguments in ABI order. Pointers and signed values must be converted to their
raw 64-bit representations.

## Returns

`int64` - the raw thunk result. No validation, type conversion, retry, or
resource management is performed.

::: danger
An incorrect syscall number, argument count, pointer, or buffer length can
corrupt memory, leak resources, or terminate the process. Prefer a typed
wrapper when one is available.
:::

## Error Helpers

| Function               | Description                                      |
| ---------------------- | ------------------------------------------------ |
| [`IsError`](iserror)   | Test whether a result is in the range 1-4095.    |
| [`Errno`](errno)       | Return that positive value, or zero otherwise.   |

The range-based helpers cannot distinguish positive errno from a legitimate
small positive success result.

## See also

- [`Types and constants`](types) - exported syscall numbers
