# Linux Package

::: warning Unstable API
The package is under active development and its API is **not yet stable**. Names, signatures, and behavior may change between releases, and this documentation will be updated to match.
:::

Direct Linux x86-64 system-call bindings for Rux programs.

**Module:** `Linux`

**Source:** [github.com/rux-lang/Linux](https://github.com/rux-lang/Linux)

The package calls the kernel without going through libc. It provides raw
zero-to-six-argument syscall entry points, typed wrappers for a focused set of
common operations, and the constants and structures those wrappers need.

## Requirements

- Linux on x86-64
- A Rux compiler with the `rux-linux` syscall thunks

The syscall numbers and calling convention are architecture-specific. Do not
use this package when targeting another operating system or architecture.

## Installation

Add the package and install project dependencies:

```sh
rux add Linux
rux install
```

Then import the symbols you need:

```rux
import Linux::{ IsError, Stdout, Write };
```

## Result Convention

Functions that return `int64` expose the kernel result unchanged. A
non-negative value indicates success. Values from `-4095` through `-1` encode
an error as negative errno; test them with [`IsError`](iserror) and extract the
positive errno value with [`Errno`](errno).

The package does not set a thread-local `errno`, retry interrupted calls, or
convert failures into exceptions.

## I/O and Process

| Function                | Description                                      |
| ----------------------- | ------------------------------------------------ |
| [`Read`](read)          | Read bytes from a file descriptor.               |
| [`Write`](write)        | Write bytes to a file descriptor.                |
| [`Close`](close)        | Close a file descriptor.                         |
| [`GetPid`](getpid)      | Return the calling process ID.                   |
| [`Exit`](exit)          | Terminate the calling thread immediately.        |

## Memory

| Function                | Description                                      |
| ----------------------- | ------------------------------------------------ |
| [`Mmap`](mmap)          | Create a virtual-memory mapping.                 |
| [`Munmap`](munmap)      | Remove a virtual-memory mapping.                 |
| [`Brk`](brk)            | Invoke the kernel's raw program-break operation. |

## Time

| Symbol                            | Description                                |
| --------------------------------- | ------------------------------------------ |
| [`Timespec`](timespec)            | Seconds-and-nanoseconds time value.        |
| [`Nanosleep`](nanosleep)          | Suspend execution for a relative interval.|
| [`ClockGetTime`](clockgettime)    | Read a Linux clock.                        |

## Low-level API

| Topic                         | Description                                      |
| ----------------------------- | ------------------------------------------------ |
| [`Syscall0`–`Syscall6`](syscalls) | Invoke an arbitrary syscall with 0–6 arguments. |
| [`Constants`](constants)      | File descriptors, syscall numbers, and flags.    |
| [`IsError`](iserror)          | Test whether a raw result encodes an error.       |
| [`Errno`](errno)              | Decode a raw error result.                        |

## Example

```rux
import Linux::{ Errno, IsError, Stdout, Write };

func Main() -> int32 {
    let message = "hello from Linux\n";
    let result = Write(Stdout, message.data, message.length);
    if IsError(result) {
        // Errno(result) is the positive Linux errno value.
        return 1i32;
    }
    return result == message.length as int64 ? 0i32 : 2i32;
}
```

::: tip Higher-level code
Prefer `Std::Io`, `Std::Memory`, and `Std::Time` for portable application code.
Use this package when Linux-specific behavior or direct syscall control is
required.
:::
