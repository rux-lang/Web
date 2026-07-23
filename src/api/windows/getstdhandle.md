# `GetStdHandle`

Retrieves a handle to a standard device.

**Package:** `Windows`

**Microsoft documentation:** [`GetStdHandle`](https://learn.microsoft.com/en-us/windows/console/getstdhandle)

## Signature

```rux
func GetStdHandle(stdHandle: uint32) -> *opaque;
```

## Parameters

| Name        | Description                                                            |
| ----------- | --------------------------------------------------------------------- |
| `stdHandle` | One of `StdInputHandle`, `StdOutputHandle`, or `StdErrorHandle`.       |

## Returns

`*opaque` — the current standard-device handle. The result can be `null` or the
invalid-handle sentinel (`-1` as a handle) when no usable handle is available.

The returned handle is process-owned and normally must not be closed by the
caller.

## See also

- [`Types and constants`](types#stdhandle) — `StdHandle` values
- [`Windows`](/api/windows/) — the package overview
