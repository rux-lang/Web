# `Exit`

Terminates the calling thread immediately.

**Package:** `Linux`

## Signature

```rux
func Exit(code: int32);
```

## Parameters

| Name   | Type    | Description                                  |
| ------ | ------- | -------------------------------------------- |
| `code` | `int32` | Status made available to the waiting parent. |

## Description

`Exit` directly invokes Linux `exit(2)`. It does not return, unwind the stack,
flush user-space buffers, or run cleanup code. Only the low 8 bits of the
status are normally visible to a parent process.

::: warning
The underlying syscall terminates only the calling thread. In a multithreaded
process, it is not equivalent to `exit_group(2)`. Prefer returning from `Main`
or using the standard library for normal process termination.
:::

## Example

```rux
import Linux::Exit;

func Main() -> int {
    if unrecoverable {
        Exit(1i32);
    }
    return 0;
}
```

