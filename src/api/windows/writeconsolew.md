# `WriteConsoleW`

Writes UTF-16 characters to a console screen buffer.

**Module:** `Windows`

**Microsoft documentation:** [`WriteConsole`](https://learn.microsoft.com/en-us/windows/console/writeconsole)

## Signature

```rux
func WriteConsoleW(consoleOutput: *opaque, buffer: *const char16,
    numberOfCharsToWrite: uint32, numberOfCharsWritten: *uint32,
    reserved: *opaque) -> bool32;
```

## Parameters

| Name                   | Description                                 |
| ---------------------- | ------------------------------------------- |
| `consoleOutput`        | Console screen-buffer handle.               |
| `buffer`               | UTF-16 code units to write.                 |
| `numberOfCharsToWrite` | Requested UTF-16 code-unit count.           |
| `numberOfCharsWritten` | Receives the actual count written.          |
| `reserved`             | Must be `null`.                             |

## Returns

`bool32` — nonzero on success or zero on failure. This call fails for
redirected output; use [`WriteFile`](writefile) for that case.

## See also

- [`WriteConsoleA`](writeconsolea) — write narrow characters
- [`Console`](console) — console API overview
