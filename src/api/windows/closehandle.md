# `CloseHandle`

Closes an open kernel object handle.

**Module:** `Windows`

**Microsoft documentation:** [`CloseHandle`](https://learn.microsoft.com/en-us/windows/win32/api/handleapi/nf-handleapi-closehandle)

## Signature

```rux
func CloseHandle(handle: *opaque) -> bool32;
```

## Parameters

| Name     | Type      | Description              |
| -------- | --------- | ------------------------ |
| `handle` | `*opaque` | Open object handle.      |

## Returns

`bool32` — nonzero on success or zero on failure.

Do not use the handle after success. Search handles require
[`FindClose`](findclose), and pseudo-handles must not be passed here.

## See also

- [`GetLastError`](getlasterror) — retrieve failure details
- [`Handles and errors`](handles) — handle overview
