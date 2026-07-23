# `GetLocalTime`

Retrieves the current local date and time.

**Package:** `Windows`

**Microsoft documentation:** [`GetLocalTime`](https://learn.microsoft.com/en-us/windows/win32/api/sysinfoapi/nf-sysinfoapi-getlocaltime)

## Signature

```rux
func GetLocalTime(time: *SystemTime);
```

## Parameters

| Name   | Type          | Description                              |
| ------ | ------------- | ---------------------------------------- |
| `time` | `*SystemTime` | Writable destination for local time.     |

The pointer must be non-null and writable. The function does not return a
status value.

## See also

- [`GetSystemTime`](getsystemtime) — retrieve UTC
- [`SystemTime`](types#systemtime) — result structure
