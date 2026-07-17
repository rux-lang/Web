# `SleepMs`

Pauses the current thread for a number of milliseconds.

**Module:** `Std::Time`

## Signature

```rux
func SleepMs(ms: uint32);
```

## Parameters

| Name | Type     | Description                      |
| ---- | -------- | -------------------------------- |
| `ms` | `uint32` | Number of milliseconds to sleep. |

## Description

Blocks execution for approximately `ms` milliseconds. The actual delay may be
slightly longer depending on operating-system scheduling.

::: warning
No-op on macOS — see the [module overview](/api/std/time/).
:::

## Example

```rux
import Rux::Time;

Time::SleepMs(250u32);       // pause for a quarter second
```

## See also

- [`Std::Time`](/api/std/time/) — module overview
- [`SleepSeconds`](sleepseconds), [`SleepMinutes`](sleepminutes) — coarser units
