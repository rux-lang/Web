# GetTickCount64

Returns milliseconds elapsed since system startup.

**Package:** `Windows`

**Microsoft documentation:** [`GetTickCount64`](https://learn.microsoft.com/en-us/windows/win32/docs/api/sysinfoapi/nf-sysinfoapi-gettickcount64)

## Signature

```rux
func GetTickCount64() -> uint64;
```

## Returns

`uint64` — the monotonic system tick count in milliseconds. Use differences
between readings to measure elapsed time.

## See also

- [`Windows`](/docs/api/windows) — the package overview
