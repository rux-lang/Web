# I/O

Synchronous byte I/O through Linux file descriptors.

**Module:** `Linux`

| Function         | Description                         |
| ---------------- | ----------------------------------- |
| [`Close`](close) | Close a file descriptor.            |
| [`Read`](read)   | Read bytes from a file descriptor.  |
| [`Write`](write) | Write bytes to a file descriptor.   |

These thin wrappers do not buffer data, retry interrupted operations, or
guarantee that a requested byte count is transferred in one call.
