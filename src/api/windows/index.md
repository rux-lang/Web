# Windows Package

::: warning Unstable API
The package is under active development and its API is **not yet stable**. Names, signatures, and behavior may change between releases, and this documentation will be updated to match.
:::

Direct Win32 API bindings for Rux programs.

**Module:** `Windows`

**Source:** [github.com/rux-lang/Windows](https://github.com/rux-lang/Windows)

The package imports a focused set of functions from `kernel32.dll`, covering
console and file I/O, heap and memory operations, processes, time, filesystem
operations, text conversion, directory enumeration, and dynamic libraries.

## Requirements

- Windows
- A Rux compiler that supports `@[Target("Windows")]` imports

These bindings mirror Win32 closely and are not portable. Prefer the `Std`
package when it provides the operation you need.

## Installation

Add the package and install project dependencies:

```sh
rux add Windows
rux install
```

Then import the symbols you need:

```rux
import Windows::{ GetLastError, GetTickCount64 };
```

## Calling Conventions

Most fallible functions return `bool32`: nonzero means success and zero means
failure. Call [`GetLastError`](handles#getlasterror) immediately after a
failure when the function's contract defines a last-error value. Pointer-returning
functions use either `null` or `INVALID_HANDLE_VALUE` as their failure sentinel;
the relevant page identifies which one applies.

Functions ending in `A` accept narrow, null-terminated strings interpreted by
the Windows ANSI API. They are not inherently UTF-8. Functions ending in `W`
accept UTF-16 `char16` data. Buffer lengths are measured in bytes or characters
as stated by each function.

::: warning Raw bindings
These APIs do not automatically close handles, free heap blocks, retry partial
I/O, validate pointers, or preserve `GetLastError`. The caller owns those
responsibilities.
:::

## Reference

| Topic                              | Contents                                         |
| ---------------------------------- | ------------------------------------------------ |
| [`Types and constants`](types)     | Handles, file flags, seek origins, and structs.  |
| [`CodePage`](codepage)             | Character encoding identifiers.                 |
| [`Handles and errors`](handles)    | `CloseHandle`, `GetLastError`.                   |
| [`Console`](console)               | Console allocation, handles, input, output, beep.|
| [`Heap`](heap)                     | Process heap allocation and reallocation.        |
| [`Memory`](memory)                 | Copy, fill, zero, and compare memory.             |
| [`Process and thread`](process)    | Exit, sleep, process ID, and thread ID.           |
| [`Time`](time)                     | Tick count, local time, and UTC system time.      |
| [`File I/O`](files)                | Open, read, write, size, and seek.                |
| [`Filesystem`](filesystem)         | Files, directories, attributes, and current path.|
| [`File enumeration`](enumeration)  | Find files and traverse search results.           |
| [`Text conversion`](conversion)    | Convert between narrow and UTF-16 text.           |
| [`Dynamic libraries`](libraries)   | Load DLLs and resolve exported symbols.           |

## Example

```rux
import Windows::{
    CloseHandle,
    CreateFileA,
    CreationDisposition,
    FileAccess,
    FileAttributes,
    FileShare,
    INVALID_HANDLE_VALUE,
    WriteFile
};

func Main() -> int32 {
    let file = CreateFileA("example.txt".data, FileAccess.Write,
        FileShare.None, null, CreationDisposition.CreateAlways,
        FileAttributes.Normal as uint32, null);
    if file == INVALID_HANDLE_VALUE as *opaque {
        return 1i32;
    }

    let text = "Hello, Windows!\n";
    var written: uint32 = 0;
    let ok = WriteFile(file, text.data, text.length as uint32, &written, null);
    CloseHandle(file);
    return ok != 0 && written == text.length as uint32 ? 0i32 : 2i32;
}
```
