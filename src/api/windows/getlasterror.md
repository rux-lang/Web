# `GetLastError`

Retrieves the calling thread's last-error code.

**Module:** `Windows`

**Microsoft documentation:** [`GetLastError`](https://learn.microsoft.com/en-us/windows/win32/api/errhandlingapi/nf-errhandlingapi-getlasterror)

## Signature

```rux
func GetLastError() -> uint32;
```

## Returns

`uint32` — the thread-local Win32 error code.

## Description

Call `GetLastError` immediately after a function reports failure and only when
that function's contract defines a last-error value. Another API call may
overwrite the code. A return value of `0` does not prove that the preceding
operation succeeded.

## See also

- [`Handles and errors`](handles) — Win32 error-handling conventions
