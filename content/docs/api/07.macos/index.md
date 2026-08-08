---
navigation:
  title: Overview
---

# MacOS Package

::warning
**Unstable API**\
The package is under active development and its API is **not yet stable**. Names, signatures, and behavior may change between releases, and this documentation will be updated to match.
::

Direct macOS (Darwin) system-call bindings for Rux programs.

**Package:** `MacOS`

**Source:** [github.com/rux-lang/Rux/tree/main/Packages/MacOS](https://github.com/rux-lang/Rux/tree/main/Packages/MacOS)

The package calls the Darwin kernel without going through libc. It provides raw zero-to-six-argument syscall entry points, typed wrappers for a focused set of common operations, and the constants and structures those wrappers need.

## Requirements

- macOS on x86-64
- A Rux compiler with the macOS syscall support

The package is **x86-64 only** — the syscall entry points are hand-written x86-64 assembly, and there is no Apple Silicon (AArch64) path yet. On any other architecture the package does not apply.

## Installation

```sh
rux add MacOS
rux install
```

Then import the symbols you need:

```rux
import MacOS::{ StdOut, Write };
```

## Result Convention

The wrappers return the kernel result directly: a non-negative value on success — a byte count, a process ID, a mapped address, or `0` — and a **negative errno** (`-1` through `-4095`) on failure. Darwin itself reports errors as a positive errno with the carry flag set; the wrappers normalize that to `-errno` for parity with the Linux and BSD packages. [`IsError`](/docs/api/macos/iserror) tests for the negative range and [`Errno`](/docs/api/macos/errno) turns it back into a positive errno number.

## Functions

### I/O

| Function                         | Description                        |
| -------------------------------- | ---------------------------------- |
| [`Read`](/docs/api/macos/read)   | Read bytes from a file descriptor. |
| [`Write`](/docs/api/macos/write) | Write bytes to a file descriptor.  |
| [`Close`](/docs/api/macos/close) | Close a file descriptor.           |

### Memory

| Function                           | Description                      |
| ---------------------------------- | -------------------------------- |
| [`Mmap`](/docs/api/macos/mmap)     | Create a virtual-memory mapping. |
| [`Munmap`](/docs/api/macos/munmap) | Remove a virtual-memory mapping. |

### Process

| Function                           | Description                        |
| ---------------------------------- | ---------------------------------- |
| [`Exit`](/docs/api/macos/exit)     | Terminate the process immediately. |
| [`GetPid`](/docs/api/macos/getpid) | Return the calling process ID.     |

### Time

| Function                                       | Description                       |
| ---------------------------------------------- | --------------------------------- |
| [`GetTimeOfDay`](/docs/api/macos/gettimeofday) | Read the current wall-clock time. |

### Raw syscalls

| Function                                          | Description                                |
| ------------------------------------------------- | ------------------------------------------ |
| [`Syscall0`–`Syscall6`](/docs/api/macos/syscalls) | Invoke an arbitrary syscall by number.     |
| [`IsError`](/docs/api/macos/iserror)              | Test whether a result is a negative errno. |
| [`Errno`](/docs/api/macos/errno)                  | Extract the positive errno from a result.  |

## Types and constants

The standard descriptors, class-qualified syscall numbers, mapping and protection flags, and the [`Timeval`](/docs/api/macos/types) structure are listed on the [types and constants](/docs/api/macos/types) page.

## Example

```rux
import MacOS::{ StdOut, Write };

func Main() -> int {
    let message = "hello from macOS\n";
    let result = Write(StdOut, message.data, message.length);
    return result == message.length as int64 ? 0 : 1;
}
```
