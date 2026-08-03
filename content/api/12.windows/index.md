---
navigation:
  title: Overview
---

# Windows Package

::warning
**Unstable API**\
The package is under active development and its API is **not yet stable**. Names, signatures, and behavior may change between releases, and this documentation will be updated to match.
::

Direct Win32 API bindings for Rux programs.

**Package:** `Windows`

**Source:** [github.com/rux-lang/Rux/tree/main/Packages/Windows](https://github.com/rux-lang/Rux/tree/main/Packages/Windows)

The package imports a focused set of functions from `kernel32.dll`, covering console and file I/O, heap and memory operations, processes, time, filesystem operations, text conversion, directory enumeration, and dynamic libraries.

## Requirements

- Windows
- A Rux compiler with the `kernel32.dll` link support

The functions are declared in a `#Link("Kernel32.dll") extern { ... }` block, so they resolve at link time against the system DLL. These bindings mirror Win32 closely and are not portable — reach for the cross-platform packages ([`Io`](/api/io), [`Memory`](/api/memory)) when they provide the operation you need.

## Installation

```sh
rux add Windows
rux install
```

Then import the symbols you need:

```rux
import Windows::{ GetLastError, GetTickCount64 };
```

## Calling Conventions

Most fallible functions return `bool32`: nonzero means success and zero means failure. Call [`GetLastError`](/api/windows/getlasterror) immediately after a failure when the function's contract defines a last-error value. Pointer-returning functions use `null` as their failure sentinel unless a page states otherwise.

Functions ending in `A` take narrow, null-terminated strings interpreted by the Windows ANSI API; they are not inherently UTF-8. Functions ending in `W` take UTF-16 `char16` data. Buffer lengths are measured in bytes or characters as each function states.

::warning
**Raw bindings**\
These APIs do not automatically close handles, free heap blocks, retry partial I/O, validate pointers, or preserve `GetLastError`. The caller owns those responsibilities.
::

## Functions

### Console

| Function                                      | Description                           |
| --------------------------------------------- | ------------------------------------- |
| [`AllocConsole`](/api/windows/allocconsole)   | Allocate a console for the process.   |
| [`GetStdHandle`](/api/windows/getstdhandle)   | Get a standard device handle.         |
| [`ReadConsoleA`](/api/windows/readconsolea)   | Read characters from the console.     |
| [`WriteConsoleA`](/api/windows/writeconsolea) | Write a narrow string to the console. |
| [`WriteConsoleW`](/api/windows/writeconsolew) | Write a UTF-16 string to the console. |
| [`Beep`](/api/windows/beep)                   | Sound a tone on the speaker.          |

### File I/O

| Function                                            | Description                       |
| --------------------------------------------------- | --------------------------------- |
| [`CreateFileA`](/api/windows/createfilea)           | Create or open a file or device.  |
| [`ReadFile`](/api/windows/readfile)                 | Read bytes from a file or device. |
| [`WriteFile`](/api/windows/writefile)               | Write bytes to a file or device.  |
| [`GetFileSizeEx`](/api/windows/getfilesizeex)       | Get the size of a file.           |
| [`SetFilePointerEx`](/api/windows/setfilepointerex) | Move the file pointer.            |

### Filesystem

| Function                                                    | Description                   |
| ----------------------------------------------------------- | ----------------------------- |
| [`CopyFileA`](/api/windows/copyfilea)                       | Copy a file.                  |
| [`MoveFileA`](/api/windows/movefilea)                       | Move a file or directory.     |
| [`DeleteFileA`](/api/windows/deletefilea)                   | Delete a file.                |
| [`CreateDirectoryA`](/api/windows/createdirectorya)         | Create a directory.           |
| [`RemoveDirectoryA`](/api/windows/removedirectorya)         | Remove an empty directory.    |
| [`GetFileAttributesA`](/api/windows/getfileattributesa)     | Read a file's attributes.     |
| [`SetFileAttributesA`](/api/windows/setfileattributesa)     | Set a file's attributes.      |
| [`GetCurrentDirectoryA`](/api/windows/getcurrentdirectorya) | Read the current directory.   |
| [`SetCurrentDirectoryA`](/api/windows/setcurrentdirectorya) | Change the current directory. |

### File enumeration

| Function                                        | Description                  |
| ----------------------------------------------- | ---------------------------- |
| [`FindFirstFileA`](/api/windows/findfirstfilea) | Begin a directory search.    |
| [`FindNextFileA`](/api/windows/findnextfilea)   | Continue a directory search. |
| [`FindClose`](/api/windows/findclose)           | Close a search handle.       |

### Heap and memory

| Function                                            | Description                     |
| --------------------------------------------------- | ------------------------------- |
| [`GetProcessHeap`](/api/windows/getprocessheap)     | Get the process's default heap. |
| [`HeapAlloc`](/api/windows/heapalloc)               | Allocate a heap block.          |
| [`HeapReAlloc`](/api/windows/heaprealloc)           | Resize a heap block.            |
| [`HeapFree`](/api/windows/heapfree)                 | Free a heap block.              |
| [`RtlCopyMemory`](/api/windows/rtlcopymemory)       | Copy bytes between blocks.      |
| [`RtlFillMemory`](/api/windows/rtlfillmemory)       | Fill a block with a byte.       |
| [`RtlZeroMemory`](/api/windows/rtlzeromemory)       | Zero a block.                   |
| [`RtlCompareMemory`](/api/windows/rtlcomparememory) | Compare two blocks.             |

### Process and thread

| Function                                                  | Description                 |
| --------------------------------------------------------- | --------------------------- |
| [`ExitProcess`](/api/windows/exitprocess)                 | Terminate the process.      |
| [`Sleep`](/api/windows/sleep)                             | Suspend the current thread. |
| [`GetCurrentProcessId`](/api/windows/getcurrentprocessid) | Get the process ID.         |
| [`GetCurrentThreadId`](/api/windows/getcurrentthreadid)   | Get the thread ID.          |

### Time

| Function                                        | Description                      |
| ----------------------------------------------- | -------------------------------- |
| [`GetTickCount64`](/api/windows/gettickcount64) | Milliseconds since system start. |
| [`GetLocalTime`](/api/windows/getlocaltime)     | Current local date and time.     |
| [`GetSystemTime`](/api/windows/getsystemtime)   | Current UTC date and time.       |

### Text conversion

| Function                                                  | Description                          |
| --------------------------------------------------------- | ------------------------------------ |
| [`MultiByteToWideChar`](/api/windows/multibytetowidechar) | Convert a narrow string to UTF-16.   |
| [`WideCharToMultiByte`](/api/windows/widechartomultibyte) | Convert UTF-16 to another code page. |

### Dynamic libraries

| Function                                        | Description                 |
| ----------------------------------------------- | --------------------------- |
| [`LoadLibraryA`](/api/windows/loadlibrarya)     | Load a DLL.                 |
| [`FreeLibrary`](/api/windows/freelibrary)       | Unload a DLL.               |
| [`GetProcAddress`](/api/windows/getprocaddress) | Resolve an exported symbol. |

### Handles and errors

| Function                                    | Description               |
| ------------------------------------------- | ------------------------- |
| [`CloseHandle`](/api/windows/closehandle)   | Close an object handle.   |
| [`GetLastError`](/api/windows/getlasterror) | Read the last-error code. |

## Types and constants

The standard handle constants, the [`CodePage`](/api/windows/codepage) and `CreationDisposition` enums, and the `FileTime`, `SystemTime`, and `Win32FindDataA` structures are listed on the [types and constants](/api/windows/types) page.

## Example

```rux
import Windows::{ GetStdHandle, StdOutputHandle, WriteFile };

func Main() -> int {
    let output = GetStdHandle(StdOutputHandle);
    let text = "Hello, Windows!\n";
    var written: uint32 = 0;
    let ok = WriteFile(output, text.data, text.length as uint32, @written, null);
    return ok != 0 && written == text.length as uint32 ? 0 : 1;
}
```
