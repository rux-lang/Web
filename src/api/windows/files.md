# File I/O

Open files and devices, perform I/O, query size, and seek.

**Module:** `Windows`

| Function                                   | Description                         |
| ------------------------------------------ | ----------------------------------- |
| [`CreateFileA`](createfilea)               | Create or open a file/device.       |
| [`GetFileSizeEx`](getfilesizeex)           | Retrieve a file's size.             |
| [`ReadFile`](readfile)                     | Read bytes from a handle.           |
| [`SetFilePointerEx`](setfilepointerex)     | Move a file pointer.                |
| [`WriteFile`](writefile)                   | Write bytes to a handle.            |

Close successful `CreateFileA` results with [`CloseHandle`](closehandle).

