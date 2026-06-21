# `ReadConsoleA`

Reads narrow characters from a console input buffer.

**Module:** `Windows`

**Microsoft documentation:** [`ReadConsole`](https://learn.microsoft.com/en-us/windows/console/readconsole)

## Signature

```rux
func ReadConsoleA(consoleInput: *opaque, buffer: *opaque,
    numberOfCharsToRead: uint32, numberOfCharsRead: *uint32,
    inputControl: *opaque) -> bool32;
```

## Parameters

| Name                  | Description                                      |
| --------------------- | ------------------------------------------------ |
| `consoleInput`        | Console input handle.                            |
| `buffer`              | Writable output buffer.                          |
| `numberOfCharsToRead` | Maximum characters to read.                      |
| `numberOfCharsRead`   | Receives the actual character count.             |
| `inputControl`        | Input control data; use `null` for ANSI input.   |

## Returns

`bool32` — nonzero on success or zero on failure. The function requires a
console handle; use [`ReadFile`](readfile) for redirected standard input.

## See also

- [`GetStdHandle`](getstdhandle) — retrieve standard input
- [`Console`](console) — console API overview
