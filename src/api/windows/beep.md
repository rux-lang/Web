# `Beep`

Generates a simple tone on the speaker.

**Module:** `Windows`

**Microsoft documentation:** [`Beep`](https://learn.microsoft.com/en-us/windows/win32/api/utilapiset/nf-utilapiset-beep)

## Signature

```rux
func Beep(freq: uint32, duration: uint32) -> bool32;
```

## Parameters

| Name       | Type     | Description                  |
| ---------- | -------- | ---------------------------- |
| `freq`     | `uint32` | Frequency in hertz, 37–32767.|
| `duration` | `uint32` | Duration in milliseconds.    |

## Returns

`bool32` — nonzero on success or zero on failure.

## See also

- [`Console`](console) — console API overview
