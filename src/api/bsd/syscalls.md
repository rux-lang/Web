# Raw Syscalls

Invoke arbitrary BSD x86-64 syscalls and inspect raw results.

**Package:** `Bsd`

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
`number` and every argument must match the active BSD target's x86-64 ABI.
Pointers and signed values must be converted to raw 64-bit representations.

## Returns

`int64` - the kernel result: a non-negative value on success, or a negative
errno (`-1` through `-4095`) on failure. No validation, type conversion, retry,
or resource management is performed. Use [`IsError`](iserror) and
[`Errno`](errno) to interpret it.

::: danger
The supported BSD systems do not share every syscall number or ABI detail. An
incorrect target assumption, argument count, pointer, or buffer length can
corrupt memory, leak resources, or terminate the process. Prefer a typed
wrapper when available.
:::

## Error Helpers

| Function             | Description                                            |
| -------------------- | ------------------------------------------------------ |
| [`Errno`](errno)     | Return the positive errno of a failing result, else 0. |
| [`IsError`](iserror) | Test whether a result is a negative errno.             |

## See also

- [`Bsd`](/api/bsd/) — the package overview
- [`Types and constants`](types) - shared syscall numbers
