# Console and I/O

Synchronous byte input and output through macOS file descriptors.

**Module:** `MacOS`

| Function                              | Description                              |
| ------------------------------------- | ---------------------------------------- |
| [`GetStdHandle`](getstdhandle)        | Get a standard-device descriptor.        |
| [`ReadFile`](readfile)                | Read bytes from a file or device.        |
| [`WriteFile`](writefile)              | Write bytes to a file or device.         |

Despite the compatibility names, these functions are backed by macOS BSD
`read` and `write` syscalls. They operate on bytes and do not perform text
encoding or newline conversion.

