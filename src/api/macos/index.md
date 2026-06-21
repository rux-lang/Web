# MacOS Package

Low-level macOS x64 system bindings for Rux programs.

**Module:** `MacOS`

The package exposes a focused compatibility API for process termination,
standard input and output, and virtual-memory allocation. Its Win32-style
function names are resolved by the Rux Mach-O linker to thunks backed by macOS
BSD syscalls; they do not load or emulate Windows system libraries.

::: warning Unstable API
The MacOS package is under active development and its API is not yet stable.
Pin a package version when reproducible builds are required.
:::

## Requirements

- macOS on x86-64
- A Rux compiler with the `rux-macos` compatibility thunks

These bindings are platform-specific. Prefer `Std::Io`, `Std::Memory`, and
`Std::Exit` for portable application code.

## Installation

Add the package and install project dependencies:

```sh
rux add MacOS
rux install
```

Then import the symbols you need:

```rux
import MacOS::{ GetStdHandle, StdHandle, WriteFile };
```

## Calling Conventions

[`ReadFile`](readfile), [`WriteFile`](writefile), and [`HeapFree`](heapfree)
return `bool32`: nonzero means success and zero means failure. [`HeapAlloc`](heapalloc)
returns `null` when allocation fails. [`Munmap`](munmap) follows the raw macOS
syscall convention and returns `0` on success or a negative error result.

Standard devices are BSD file descriptors encoded as `*opaque`. In particular,
standard input is descriptor `0`, so its valid handle may compare equal to
`null`. Do not use a null check to validate a standard handle.

::: warning Raw bindings
The API does not retry interrupted or partial I/O, provide an error-decoding
helper, track allocation sizes, or release memory through `HeapFree`. The caller
owns those responsibilities.
:::

## Reference

| Topic                          | Contents                                      |
| ------------------------------ | --------------------------------------------- |
| [`Types`](types)               | `StdHandle` standard-device identifiers.      |
| [`Console and I/O`](console)   | Standard handles, byte input, and byte output.|
| [`Heap and memory`](heap)      | Allocate and unmap virtual memory.             |
| [`Process`](process)           | Terminate the process.                         |

## Example

```rux
import MacOS::{ GetStdHandle, StdHandle, WriteFile };

func Main() -> int32 {
    let message = c8"Hello, macOS!\n";
    let output = GetStdHandle(StdHandle::Output);
    var written: uint32 = 0;

    let ok = WriteFile(output, message.data, message.length as uint32,
        &written, null);
    return ok != 0 && written == message.length as uint32 ? 0i32 : 1i32;
}
```
