# `GetCurrentProcessId`

Returns the identifier of the calling process.

**Module:** `Windows`

**Microsoft documentation:** [`GetCurrentProcessId`](https://learn.microsoft.com/en-us/windows/win32/api/processthreadsapi/nf-processthreadsapi-getcurrentprocessid)

## Signature

```rux
func GetCurrentProcessId() -> uint32;
```

## Returns

`uint32` — the current process identifier. Windows may reuse the identifier
after the process terminates.

## See also

- [`GetCurrentThreadId`](getcurrentthreadid) — calling thread identifier
- [`Process and thread`](process) — process API overview
