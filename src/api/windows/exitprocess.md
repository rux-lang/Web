# `ExitProcess`

Terminates the calling process and all of its threads.

**Package:** `Windows`

**Microsoft documentation:** [`ExitProcess`](https://learn.microsoft.com/en-us/windows/win32/api/processthreadsapi/nf-processthreadsapi-exitprocess)

## Signature

```rux
func ExitProcess(exitCode: uint32);
```

## Parameters

| Name       | Type     | Description                         |
| ---------- | -------- | ----------------------------------- |
| `exitCode` | `uint32` | Status reported for the process.    |

## Description

`ExitProcess` does not return. Normal stack unwinding and cleanup in the caller
do not occur. Prefer returning from `Main` for normal termination.

## See also

- [`Windows`](/api/windows/) — the package overview
