# File Enumeration

Enumerate directory entries matching an ANSI path pattern.

**Module:** `Windows`

| Function                                 | Description                         |
| ---------------------------------------- | ----------------------------------- |
| [`FindClose`](findclose)                 | Close a search handle.              |
| [`FindFirstFileA`](findfirstfilea)       | Start a file search.                |
| [`FindNextFileA`](findnextfilea)         | Retrieve the next result.           |

Search results use [`Win32FindDataA`](types#win32finddataa). Every successful
`FindFirstFileA` call must be paired with `FindClose`.

