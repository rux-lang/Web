# `WriteConsoleA`

Writes narrow characters to a console screen buffer.

**Package:** `Windows`

**Microsoft documentation:** [`WriteConsole`](https://learn.microsoft.com/en-us/windows/console/writeconsole)

## Signature

```rux
func WriteConsoleA(
    consoleOutput: *opaque,
    buffer: *char8,
    numberOfCharsToWrite: uint32,
    numberOfCharsWritten: *uint32,
    reserved: *opaque
) -> bool32;
```

## Parameters

| Name                   | Description                                 |
| ---------------------- | ------------------------------------------- |
| `consoleOutput`        | Console screen-buffer handle.               |
| `buffer`               | Narrow characters to write.                 |
| `numberOfCharsToWrite` | Requested character count.                  |
| `numberOfCharsWritten` | Receives the actual character count.        |
| `reserved`             | Must be `null`.                             |

## Returns

`bool32` — nonzero on success or zero on failure. This call fails for
redirected output; use [`WriteFile`](writefile) for that case.

## See also

- [`WriteConsoleW`](writeconsolew) — write UTF-16 characters
- [`Windows`](/api/windows/) — the package overview
