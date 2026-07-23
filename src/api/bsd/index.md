# Bsd Package

::: warning Unstable API
The package is under active development and its API is **not yet stable**. Names, signatures, and behavior may change between releases, and this documentation will be updated to match.
:::

Direct syscall bindings for FreeBSD, OpenBSD, NetBSD, and DragonFly BSD.

**Package:** `Bsd`

**Source:** [github.com/rux-lang/Rux/tree/main/Packages/Bsd](https://github.com/rux-lang/Rux/tree/main/Packages/Bsd)

The package provides raw zero-to-six-argument syscall entry points, typed wrappers for common I/O, process, memory, and time operations, and the constants and structures those wrappers require. It calls the kernel without libc and uses compiler-provided thunks where the supported BSD variants differ.

## Requirements

- FreeBSD, OpenBSD, NetBSD, or DragonFly BSD on x86-64
- A Rux compiler with the BSD syscall thunks

The syscall ABI is platform- and architecture-specific. Prefer the cross-platform packages — [`Io`](/api/io/), [`Memory`](/api/memory/) — when they provide the operation you need.

## Installation

```sh
rux add Bsd
rux install
```

Then import the symbols you need:

```rux
import Bsd::{ StdOut, Write };
```

## Platform Compatibility

The package is **x86-64 only** — the raw syscall entry points are hand-written x86-64 assembly, and there is no AArch64 path yet. On any other architecture the package does not apply.

Syscall numbers and clock IDs differ between the four supported BSDs, so the package selects the right value for the active target at compile time; `Mmap`, `Munmap`, `Nanosleep`, and `ClockGetTime` route through dedicated per-target paths. `ClockMonotonic` is `4` on FreeBSD and DragonFly BSD and `3` on NetBSD and OpenBSD. The mapping and protection flags are the same on all four.

## Result Convention

The wrappers return the kernel result directly: a non-negative value on success — a byte count, a process ID, a mapped address, or `0` — and a **negative errno** (`-1` through `-4095`) on failure. [`IsError`](iserror) tests for that negative range and [`Errno`](errno) turns it back into a positive errno number, so a legitimate positive result is never mistaken for an error.

## Functions

### I/O

| Function         | Description                        |
| ---------------- | ---------------------------------- |
| [`Read`](read)   | Read bytes from a file descriptor. |
| [`Write`](write) | Write bytes to a file descriptor.  |
| [`Close`](close) | Close a file descriptor.           |

### Memory

| Function           | Description                       |
| ------------------ | --------------------------------- |
| [`Mmap`](mmap)     | Create a virtual-memory mapping.  |
| [`Munmap`](munmap) | Remove a virtual-memory mapping.  |
| [`Brk`](brk)       | Change the process program break. |

### Process

| Function           | Description                        |
| ------------------ | ---------------------------------- |
| [`Exit`](exit)     | Terminate the process immediately. |
| [`GetPid`](getpid) | Return the calling process ID.     |

### Time

| Function                       | Description                      |
| ------------------------------ | -------------------------------- |
| [`ClockGetTime`](clockgettime) | Read a BSD clock.                |
| [`Nanosleep`](nanosleep)       | Suspend for a relative interval. |

### Raw syscalls

| Function                          | Description                                 |
| --------------------------------- | ------------------------------------------- |
| [`Syscall0`–`Syscall6`](syscalls) | Invoke an arbitrary syscall by number.      |
| [`IsError`](iserror)              | Test whether a result is a negative errno.  |
| [`Errno`](errno)                  | Extract the positive errno from a result.   |

## Types and constants

The standard descriptors, syscall numbers, mapping and protection flags, clock IDs, and the [`Timespec`](types) structure are listed on the [types and constants](types) page.

## Example

```rux
import Bsd::{ StdOut, Write };

func Main() -> int {
    let message = "hello from BSD\n";
    let result = Write(StdOut, message.data, message.length);
    return result == message.length as int64 ? 0 : 1;
}
```
