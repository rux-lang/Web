# BSD Package

::: warning Unstable API
The package is under active development and its API is **not yet stable**. Names, signatures, and behavior may change between releases, and this documentation will be updated to match.
:::

Direct x86-64 syscall bindings for FreeBSD, OpenBSD, NetBSD, and DragonFly BSD.

**Module:** `BSD`

**Source:** [github.com/rux-lang/BSD](https://github.com/rux-lang/BSD)

The package provides raw zero-to-six-argument syscall entry points, typed
wrappers for common I/O, process, memory, and time operations, and the constants
and structures those wrappers require. It calls the kernel without libc and
uses compiler-provided thunks where the supported BSD variants differ.

## Requirements

- FreeBSD, OpenBSD, NetBSD, or DragonFly BSD on x86-64
- A Rux compiler with the BSD syscall thunks

The syscall ABI is platform- and architecture-specific. Prefer `Std` when it
provides the operation you need.

## Installation

Add the package and install project dependencies:

```sh
rux add BSD
rux install
```

Then import the symbols you need:

```rux
import BSD::{ Stdout, Write };
```

## Platform Compatibility

Most exported syscall numbers are shared by the four supported BSD targets.
`Mmap`, `Nanosleep`, and `ClockGettime` use dedicated compiler thunks because
their syscall details differ by target.

The exported `MAP_ANONYMOUS` value is `4096` and `CLOCK_MONOTONIC` is `4`,
matching FreeBSD, NetBSD, and DragonFly BSD. OpenBSD uses `32` and `3`
respectively. Use these constants with the package's typed wrappers; do not
assume they are valid inputs to arbitrary raw OpenBSD syscalls.

## Result Convention

Functions returning `int64` expose the thunk result directly. The package
treats values from `1` through `4095` as positive errno values; [`IsError`](iserror)
performs that range check and [`Errno`](errno) returns the value when it falls
in the range.

::: danger Ambiguous positive results
The current convention overlaps legitimate small positive success values,
including byte counts returned by `Read` and `Write`, and potentially process
IDs. `IsError` can therefore misclassify success. Interpret each function's
result according to its own contract instead of applying `IsError` blindly.
:::

## Reference

| Topic                          | Contents                                         |
| ------------------------------ | ------------------------------------------------ |
| [`Types and constants`](types) | Descriptors, syscalls, flags, clocks, `timespec`.|
| [`I/O`](io)                    | Read, write, and close file descriptors.         |
| [`Memory`](memory)             | Map, unmap, and change the program break.         |
| [`Process`](process)           | Process ID and immediate termination.            |
| [`Time`](time)                 | Read clocks and suspend execution.                |
| [`Raw syscalls`](syscalls)     | `Syscall0`-`Syscall6` and error helpers.          |

## Example

```rux
import BSD::{ Stdout, Write };

func Main() -> int32 {
    let message = "hello from BSD\n";
    let result = Write(Stdout, message.data, message.length);
    return result == message.length as int64 ? 0i32 : 1i32;
}
```
