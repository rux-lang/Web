# `Exit`

Terminates the process immediately.

**Module:** `BSD`

## Signature

```rux
func Exit(code: int32);
```

## Parameters

| Name   | Type    | Description                              |
| ------ | ------- | ---------------------------------------- |
| `code` | `int32` | Status reported to the process's parent. |

## Description

`Exit` invokes the low-level target BSD exit operation. It does not return,
unwind the stack, flush user-space buffers, or run cleanup code. A waiting
parent normally observes only the low 8 bits of the status.

::: warning
Prefer returning from `Main` for normal termination. Use `Exit` only when the
process must stop immediately.
:::

## See also

- [`Process`](process) - process API overview
