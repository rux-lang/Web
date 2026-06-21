# Illumos Package

Direct Illumos x86-64 system-call bindings for Rux programs.

**Module:** `Illumos`

The package provides raw zero-to-six-argument syscall entry points, typed
wrappers for common I/O, process, memory, and time operations, and the constants
and structures those wrappers require. It calls the kernel without libc.

::: warning Unstable API
The Illumos package is under active development and its API is not yet stable.
Pin a package version when reproducible builds are required.
:::

## Requirements

- An Illumos distribution on x86-64, such as OmniOS, OpenIndiana, or SmartOS
- A Rux compiler with the `rux-illumos` syscall thunks

The syscall numbers and calling convention are platform- and
architecture-specific. Prefer `Std` when it provides the operation you need.

## Installation

Add the package and install project dependencies:

```sh
rux add Illumos
rux install
```

Then import the symbols you need:

```rux
import Illumos::{ Stdout, Write };
```

## Result Convention

Functions returning `int64` expose the thunk result directly. The package
treats values from `1` through `4095` as positive errno values; [`IsError`](iserror)
performs exactly that range check and [`Errno`](errno) returns the value when it
falls in that range.

::: danger Ambiguous positive results
The current convention overlaps legitimate small positive success values,
including byte counts returned by `Read` and `Write`, and potentially process
IDs. Consequently, `IsError` can misclassify a successful result. Interpret
each function's result according to its own contract; do not apply `IsError`
blindly to every positive result.
:::

The package does not set a thread-local `errno`, retry interrupted calls, or
convert failures into exceptions.

## Reference

| Topic                            | Contents                                      |
| -------------------------------- | --------------------------------------------- |
| [`Types and constants`](types)   | File descriptors, flags, clocks, and `Timespec`. |
| [`I/O`](io)                      | Read, write, and close file descriptors.      |
| [`Memory`](memory)               | Map, unmap, and change the program break.      |
| [`Process`](process)             | Process ID and immediate termination.         |
| [`Time`](time)                   | Read clocks and suspend execution.             |
| [`Raw syscalls`](syscalls)       | `Syscall0`-`Syscall6` and error helpers.       |

## Example

```rux
import Illumos::{ Stdout, Write };

func Main() -> int32 {
    let message = "hello from Illumos\n";
    let result = Write(Stdout, message.data, message.length);

    // A complete write returns the requested byte count.
    return result == message.length as int64 ? 0i32 : 1i32;
}
```
