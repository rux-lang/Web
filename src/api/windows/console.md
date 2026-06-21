# Console

Console allocation, standard handles, input, output, and tones.

**Module:** `Windows`

| Function                         | Description                                  |
| -------------------------------- | -------------------------------------------- |
| [`AllocConsole`](allocconsole)   | Allocate a console for the process.          |
| [`Beep`](beep)                   | Generate a simple tone.                      |
| [`GetStdHandle`](getstdhandle)   | Retrieve a standard-device handle.           |
| [`ReadConsoleA`](readconsolea)   | Read narrow console characters.              |
| [`WriteConsoleA`](writeconsolea) | Write narrow console characters.             |
| [`WriteConsoleW`](writeconsolew) | Write UTF-16 console characters.             |

Console-specific read/write calls require console handles and fail when the
standard stream is redirected. Use `ReadFile` and `WriteFile` for redirected
or general-purpose handles.

