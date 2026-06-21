# `Exit`

Terminates the current process with an exit code.

**Module:** `Std`

## Signature

```rux
func Exit(code: uint32);
```

## Parameters

| Name   | Type     | Description                                      |
| ------ | -------- | ------------------------------------------------ |
| `code` | `uint32` | The exit code to report to the operating system. |

## Description

`Exit` ends the program immediately, handing `code` back to the operating system
(`0` conventionally means success, non-zero means failure). It does not return,
and code after the call does not run.

::: warning
`Exit` terminates the process directly without unwinding the stack, so any
pending cleanup at or above the call site is skipped. Prefer returning from
`Main` for normal termination; use `Exit` to stop early from deep in the call
tree.
:::

## Example

```rux
import Std::Exit;
import Std::Io::PrintLine;

func Main() -> int {
    if !LoadConfig() {
        PrintLine("failed to load configuration");
        Exit(1u32);
    }
    return 0;
}
```

## See also

- [`Fatal`](fatal) — print a diagnostic and exit with code `1`
- [`Assert`](assert) — exit with code `2` when a condition fails
