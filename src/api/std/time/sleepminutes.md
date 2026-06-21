# `SleepMinutes`

Pauses the current thread for a number of minutes.

**Module:** `Std::Time`

## Signature

```rux
func SleepMinutes(minutes: uint32);
```

## Parameters

| Name      | Type     | Description                 |
| --------- | -------- | --------------------------- |
| `minutes` | `uint32` | Number of minutes to sleep. |

## Description

Convenience wrapper over [`SleepSeconds`](sleepseconds)`(minutes * 60)`.

::: warning
No-op on macOS — see the [module overview](/api/std/time/).
:::

## Example

```rux
import Std::Time;

Time::SleepMinutes(1u32);
```

## See also

- [`Std::Time`](/api/std/time/) — module overview
- [`SleepMs`](sleepms), [`SleepSeconds`](sleepseconds) — finer units
