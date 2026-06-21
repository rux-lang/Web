# I/O

Synchronous byte I/O through Illumos file descriptors.

**Module:** `Illumos`

| Function         | Description                         |
| ---------------- | ----------------------------------- |
| [`Close`](close) | Close a file descriptor.            |
| [`Read`](read)   | Read bytes from a file descriptor.  |
| [`Write`](write) | Write bytes to a file descriptor.   |

These are thin syscall wrappers. They do not buffer data, retry interrupted
operations, or guarantee that a requested byte count is transferred in one
call.
