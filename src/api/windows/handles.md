# Handles and Errors

Handle cleanup and thread-local Win32 error reporting.

**Module:** `Windows`

| Function                         | Description                              |
| -------------------------------- | ---------------------------------------- |
| [`CloseHandle`](closehandle)     | Close an open kernel object handle.      |
| [`GetLastError`](getlasterror)   | Retrieve the thread's last-error code.   |

Call `GetLastError` immediately after a documented failure. Search handles
must be released with [`FindClose`](findclose), not `CloseHandle`.

