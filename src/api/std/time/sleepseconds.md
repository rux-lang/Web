# `SleepSeconds`

Pauses the current thread for a number of seconds.

**Module:** `Std::Time`

## Signature

```rux
func SleepSeconds(seconds: uint32);
```

## Parameters

| Name      | Type     | Description                 |
| --------- | -------- | --------------------------- |
| `seconds` | `uint32` | Number of seconds to sleep. |

## Description

Convenience wrapper over [`SleepMs`](sleepms)`(seconds * 1000)`.

::: warning
No-op on macOS — see the [module overview](/api/std/time/).
:::

## Example

```rux
import Rux::Time;

Time::SleepSeconds(3u32);
```

## See also

- [`Std::Time`](/api/std/time/) — module overview
- [`SleepMs`](sleepms), [`SleepMinutes`](sleepminutes) — other units
