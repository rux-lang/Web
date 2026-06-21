# `GetSystemTime`

Retrieves the current UTC date and time.

**Module:** `Windows`

**Microsoft documentation:** [`GetSystemTime`](https://learn.microsoft.com/en-us/windows/win32/api/sysinfoapi/nf-sysinfoapi-getsystemtime)

## Signature

```rux
func GetSystemTime(time: *SystemTime);
```

## Parameters

| Name   | Type          | Description                         |
| ------ | ------------- | ----------------------------------- |
| `time` | `*SystemTime` | Writable destination for UTC time.  |

The pointer must be non-null and writable. The function does not return a
status value.

## See also

- [`GetLocalTime`](getlocaltime) — retrieve local time
- [`SystemTime`](types#systemtime) — result structure
