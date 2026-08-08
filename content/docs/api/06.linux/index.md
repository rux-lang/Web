---
navigation:
  title: Overview
---

# Linux Package

::warning
**Unstable API**\
The package is under active development and its API is **not yet stable**. Names, signatures, and behavior may change between releases, and this documentation will be updated to match.
::

Direct Linux system-call bindings for Rux programs.

**Package:** `Linux`

**Source:** [github.com/rux-lang/Rux/tree/main/Packages/Linux](https://github.com/rux-lang/Rux/tree/main/Packages/Linux)

The package calls the kernel without going through libc. It provides raw zero-to-six-argument syscall entry points, typed wrappers for a focused set of common operations, and the constants and structures those wrappers need.

## Requirements

- Linux on x86-64 or AArch64
- A Rux compiler with the Linux syscall support

On x86-64 the wrappers issue the `syscall` instruction directly; on AArch64 the native backend lowers them through libc's `syscall` function. The syscall numbers are architecture-specific and the package selects the right set for the active target at compile time.

## Installation

```sh
rux add Linux
rux install
```

Then import the symbols you need:

```rux
import Linux::{ StdOut, Write };
```

## Result Convention

The wrappers return the kernel result directly: a non-negative value on success — a byte count, a process ID, a mapped address, or `0` — and a **negative errno** (`-1` through `-4095`) on failure. [`IsError`](/docs/api/linux/iserror) tests for that negative range and [`Errno`](/docs/api/linux/errno) turns it back into a positive errno number.

The package does not set a thread-local `errno`, retry interrupted calls, or convert failures into exceptions.

## Functions

### I/O

| Function                         | Description                        |
| -------------------------------- | ---------------------------------- |
| [`Read`](/docs/api/linux/read)   | Read bytes from a file descriptor. |
| [`Write`](/docs/api/linux/write) | Write bytes to a file descriptor.  |
| [`Close`](/docs/api/linux/close) | Close a file descriptor.           |

### Memory

| Function                           | Description                                      |
| ---------------------------------- | ------------------------------------------------ |
| [`Mmap`](/docs/api/linux/mmap)     | Create a virtual-memory mapping.                 |
| [`Munmap`](/docs/api/linux/munmap) | Remove a virtual-memory mapping.                 |
| [`Brk`](/docs/api/linux/brk)       | Invoke the kernel's raw program-break operation. |

### Process

| Function                           | Description                        |
| ---------------------------------- | ---------------------------------- |
| [`Exit`](/docs/api/linux/exit)     | Terminate the process immediately. |
| [`GetPid`](/docs/api/linux/getpid) | Return the calling process ID.     |

### Time

| Function                                       | Description                      |
| ---------------------------------------------- | -------------------------------- |
| [`ClockGetTime`](/docs/api/linux/clockgettime) | Read a Linux clock.              |
| [`Nanosleep`](/docs/api/linux/nanosleep)       | Suspend for a relative interval. |

### Raw syscalls

| Function                                          | Description                                |
| ------------------------------------------------- | ------------------------------------------ |
| [`Syscall0`–`Syscall6`](/docs/api/linux/syscalls) | Invoke an arbitrary syscall by number.     |
| [`IsError`](/docs/api/linux/iserror)              | Test whether a result is a negative errno. |
| [`Errno`](/docs/api/linux/errno)                  | Extract the positive errno from a result.  |

## Types and constants

The standard descriptors, syscall numbers, mapping and protection flags, clock IDs, and the [`Timespec`](/docs/api/linux/types) structure are listed on the [types and constants](/docs/api/linux/types) page.

## Example

```rux
import Linux::{ IsError, StdOut, Write };

func Main() -> int {
    let message = "hello from Linux\n";
    let result = Write(StdOut, message.data, message.length);
    if IsError(result) {
        return 1;
    }
    return result == message.length as int64 ? 0 : 2;
}
```
