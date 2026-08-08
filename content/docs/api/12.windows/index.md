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

The functions are declared in a `#Link("Kernel32.dll") extern { ... }` block, so they resolve at link time against the system DLL. These bindings mirror Win32 closely and are not portable — reach for the cross-platform packages ([`Io`](/docs/api/io), [`Memory`](/docs/api/memory)) when they provide the operation you need.

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

Most fallible functions return `bool32`: nonzero means success and zero means failure. Call [`GetLastError`](/docs/api/windows/getlasterror) immediately after a failure when the function's contract defines a last-error value. Pointer-returning functions use `null` as their failure sentinel unless a page states otherwise.

Functions ending in `A` take narrow, null-terminated strings interpreted by the Windows ANSI API; they are not inherently UTF-8. Functions ending in `W` take UTF-16 `char16` data. Buffer lengths are measured in bytes or characters as each function states.

::warning
**Raw bindings**\
These APIs do not automatically close handles, free heap blocks, retry partial I/O, validate pointers, or preserve `GetLastError`. The caller owns those responsibilities.
::

## Functions

### Console

| Function                                           | Description                           |
| -------------------------------------------------- | ------------------------------------- |
| [`AllocConsole`](/docs/api/windows/allocconsole)   | Allocate a console for the process.   |
| [`GetStdHandle`](/docs/api/windows/getstdhandle)   | Get a standard device handle.         |
| [`ReadConsoleA`](/docs/api/windows/readconsolea)   | Read characters from the console.     |
| [`WriteConsoleA`](/docs/api/windows/writeconsolea) | Write a narrow string to the console. |
| [`WriteConsoleW`](/docs/api/windows/writeconsolew) | Write a UTF-16 string to the console. |
| [`Beep`](/docs/api/windows/beep)                   | Sound a tone on the speaker.          |

### File I/O

| Function                                                 | Description                       |
| -------------------------------------------------------- | --------------------------------- |
| [`CreateFileA`](/docs/api/windows/createfilea)           | Create or open a file or device.  |
| [`ReadFile`](/docs/api/windows/readfile)                 | Read bytes from a file or device. |
| [`WriteFile`](/docs/api/windows/writefile)               | Write bytes to a file or device.  |
| [`GetFileSizeEx`](/docs/api/windows/getfilesizeex)       | Get the size of a file.           |
| [`SetFilePointerEx`](/docs/api/windows/setfilepointerex) | Move the file pointer.            |

### Filesystem

| Function                                                         | Description                   |
| ---------------------------------------------------------------- | ----------------------------- |
| [`CopyFileA`](/docs/api/windows/copyfilea)                       | Copy a file.                  |
| [`MoveFileA`](/docs/api/windows/movefilea)                       | Move a file or directory.     |
| [`DeleteFileA`](/docs/api/windows/deletefilea)                   | Delete a file.                |
| [`CreateDirectoryA`](/docs/api/windows/createdirectorya)         | Create a directory.           |
| [`RemoveDirectoryA`](/docs/api/windows/removedirectorya)         | Remove an empty directory.    |
| [`GetFileAttributesA`](/docs/api/windows/getfileattributesa)     | Read a file's attributes.     |
| [`SetFileAttributesA`](/docs/api/windows/setfileattributesa)     | Set a file's attributes.      |
| [`GetCurrentDirectoryA`](/docs/api/windows/getcurrentdirectorya) | Read the current directory.   |
| [`SetCurrentDirectoryA`](/docs/api/windows/setcurrentdirectorya) | Change the current directory. |

### File enumeration

| Function                                             | Description                  |
| ---------------------------------------------------- | ---------------------------- |
| [`FindFirstFileA`](/docs/api/windows/findfirstfilea) | Begin a directory search.    |
| [`FindNextFileA`](/docs/api/windows/findnextfilea)   | Continue a directory search. |
| [`FindClose`](/docs/api/windows/findclose)           | Close a search handle.       |

### Heap and memory

| Function                                                 | Description                     |
| -------------------------------------------------------- | ------------------------------- |
| [`GetProcessHeap`](/docs/api/windows/getprocessheap)     | Get the process's default heap. |
| [`HeapAlloc`](/docs/api/windows/heapalloc)               | Allocate a heap block.          |
| [`HeapReAlloc`](/docs/api/windows/heaprealloc)           | Resize a heap block.            |
| [`HeapFree`](/docs/api/windows/heapfree)                 | Free a heap block.              |
| [`RtlCopyMemory`](/docs/api/windows/rtlcopymemory)       | Copy bytes between blocks.      |
| [`RtlFillMemory`](/docs/api/windows/rtlfillmemory)       | Fill a block with a byte.       |
| [`RtlZeroMemory`](/docs/api/windows/rtlzeromemory)       | Zero a block.                   |
| [`RtlCompareMemory`](/docs/api/windows/rtlcomparememory) | Compare two blocks.             |

### Process and thread

| Function                                                       | Description                 |
| -------------------------------------------------------------- | --------------------------- |
| [`ExitProcess`](/docs/api/windows/exitprocess)                 | Terminate the process.      |
| [`Sleep`](/docs/api/windows/sleep)                             | Suspend the current thread. |
| [`GetCurrentProcessId`](/docs/api/windows/getcurrentprocessid) | Get the process ID.         |
| [`GetCurrentThreadId`](/docs/api/windows/getcurrentthreadid)   | Get the thread ID.          |

### Time

| Function                                             | Description                      |
| ---------------------------------------------------- | -------------------------------- |
| [`GetTickCount64`](/docs/api/windows/gettickcount64) | Milliseconds since system start. |
| [`GetLocalTime`](/docs/api/windows/getlocaltime)     | Current local date and time.     |
| [`GetSystemTime`](/docs/api/windows/getsystemtime)   | Current UTC date and time.       |

### Text conversion

| Function                                                       | Description                          |
| -------------------------------------------------------------- | ------------------------------------ |
| [`MultiByteToWideChar`](/docs/api/windows/multibytetowidechar) | Convert a narrow string to UTF-16.   |
| [`WideCharToMultiByte`](/docs/api/windows/widechartomultibyte) | Convert UTF-16 to another code page. |

### Dynamic libraries

| Function                                             | Description                 |
| ---------------------------------------------------- | --------------------------- |
| [`LoadLibraryA`](/docs/api/windows/loadlibrarya)     | Load a DLL.                 |
| [`FreeLibrary`](/docs/api/windows/freelibrary)       | Unload a DLL.               |
| [`GetProcAddress`](/docs/api/windows/getprocaddress) | Resolve an exported symbol. |

### Handles and errors

| Function                                         | Description               |
| ------------------------------------------------ | ------------------------- |
| [`CloseHandle`](/docs/api/windows/closehandle)   | Close an object handle.   |
| [`GetLastError`](/docs/api/windows/getlasterror) | Read the last-error code. |

## Types and constants

The standard handle constants, the [`CodePage`](/docs/api/windows/codepage) and `CreationDisposition` enums, and the `FileTime`, `SystemTime`, and `Win32FindDataA` structures are listed on the [types and constants](/docs/api/windows/types) page.

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
