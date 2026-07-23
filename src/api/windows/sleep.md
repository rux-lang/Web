# `Sleep`

Suspends execution of the current thread.

**Package:** `Windows`

**Microsoft documentation:** [`Sleep`](https://learn.microsoft.com/en-us/windows/win32/api/synchapi/nf-synchapi-sleep)

## Signature

```rux
func Sleep(milliseconds: uint32);
```

## Parameters

| Name           | Type     | Description                    |
| -------------- | -------- | ------------------------------ |
| `milliseconds` | `uint32` | Minimum suspension interval.   |

The actual delay depends on system timer resolution and scheduling. A value of
`0` yields the remainder of the thread's time slice to another ready thread.

## See also

- [`Windows`](/api/windows/) — the package overview
