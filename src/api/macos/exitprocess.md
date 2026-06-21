# `ExitProcess`

Terminates the calling process immediately.

**Module:** `MacOS`

## Signature

```rux
func ExitProcess(exitCode: uint32);
```

## Parameters

| Name       | Type     | Description                                  |
| ---------- | -------- | -------------------------------------------- |
| `exitCode` | `uint32` | Status reported to the process's parent.     |

## Description

The Rux linker resolves this compatibility function to the macOS process-exit
syscall. It does not return, unwind the stack, flush user-space buffers, or run
cleanup code. Unix parent processes normally observe only the low 8 bits of the
status.

::: warning
Prefer returning from `Main` for normal termination. Use `ExitProcess` only
when the process must stop immediately.
:::

## Example

```rux
import MacOS::ExitProcess;

if unrecoverable {
    ExitProcess(1u32);
}
```

## See also

- [`Process`](process) — process API overview
