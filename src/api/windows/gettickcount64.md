# `GetTickCount64`

Returns milliseconds elapsed since system startup.

**Module:** `Windows`

**Microsoft documentation:** [`GetTickCount64`](https://learn.microsoft.com/en-us/windows/win32/api/sysinfoapi/nf-sysinfoapi-gettickcount64)

## Signature

```rux
func GetTickCount64() -> uint64;
```

## Returns

`uint64` — the monotonic system tick count in milliseconds. Use differences
between readings to measure elapsed time.

## See also

- [`Time`](time) — Windows time API overview
