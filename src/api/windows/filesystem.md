# Filesystem

File, directory, attribute, and current-directory operations.

**Module:** `Windows`

| Function                                           | Description                         |
| -------------------------------------------------- | ----------------------------------- |
| [`CopyFileA`](copyfilea)                           | Copy a file.                        |
| [`CreateDirectoryA`](createdirectorya)             | Create a directory.                 |
| [`DeleteFileA`](deletefilea)                       | Delete a file.                      |
| [`GetCurrentDirectoryA`](getcurrentdirectorya)     | Retrieve the current directory.     |
| [`GetFileAttributesA`](getfileattributesa)         | Retrieve filesystem attributes.     |
| [`MoveFileA`](movefilea)                           | Move or rename a path.              |
| [`RemoveDirectoryA`](removedirectorya)             | Remove an empty directory.          |
| [`SetCurrentDirectoryA`](setcurrentdirectorya)     | Change the current directory.       |
| [`SetFileAttributesA`](setfileattributesa)         | Change filesystem attributes.       |

All paths use null-terminated ANSI strings and may not represent every Unicode
path. Current-directory changes affect the entire process.

