# `GetStdHandle`

Retrieves a handle to a standard device.

**Module:** `Windows`

**Microsoft documentation:** [`GetStdHandle`](https://learn.microsoft.com/en-us/windows/console/getstdhandle)

## Signatures

```rux
func GetStdHandle(stdHandle: StdHandle) -> *opaque;
func GetStdHandle(stdHandle: uint32) -> *opaque;
```

## Parameters

| Name        | Description                                      |
| ----------- | ------------------------------------------------ |
| `stdHandle` | `StdHandle.Input`, `.Output`, or `.Error`.        |

## Returns

`*opaque` — the current standard-device handle. The result can be `null` or
`INVALID_HANDLE_VALUE` when no usable handle is available.

The `uint32` overload exists for `Std` compatibility; application code should
prefer the typed overload. The returned handle is process-owned and normally
must not be closed by the caller.

## See also

- [`Types and constants`](types#stdhandle) — `StdHandle` values
- [`Console`](console) — console API overview
