# GetCurrentProcessId

Returns the identifier of the calling process.

**Package:** `Windows`

**Microsoft documentation:** [`GetCurrentProcessId`](https://learn.microsoft.com/en-us/windows/win32/docs/api/processthreadsapi/nf-processthreadsapi-getcurrentprocessid)

## Signature

```rux
func GetCurrentProcessId() -> uint32;
```

## Returns

`uint32` — the current process identifier. Windows may reuse the identifier
after the process terminates.

## See also

- [`GetCurrentThreadId`](/docs/api/windows/getcurrentthreadid) — calling thread identifier
- [`Windows`](/docs/api/windows) — the package overview
