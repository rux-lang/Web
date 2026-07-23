# `GetCurrentThreadId`

Returns the identifier of the calling thread.

**Package:** `Windows`

**Microsoft documentation:** [`GetCurrentThreadId`](https://learn.microsoft.com/en-us/windows/win32/api/processthreadsapi/nf-processthreadsapi-getcurrentthreadid)

## Signature

```rux
func GetCurrentThreadId() -> uint32;
```

## Returns

`uint32` — the current thread identifier. Windows may reuse the identifier
after the thread terminates.

## See also

- [`GetCurrentProcessId`](getcurrentprocessid) — calling process identifier
- [`Windows`](/api/windows/) — the package overview
