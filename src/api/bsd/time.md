# Time

Relative sleeping and clock access through target-specific BSD thunks.

**Module:** `BSD`

| Function                         | Description                      |
| -------------------------------- | -------------------------------- |
| [`ClockGettime`](clockgettime)   | Read a BSD clock.                |
| [`Nanosleep`](nanosleep)         | Suspend for a relative interval. |

Both functions use [`timespec`](types#timespec). Use `CLOCK_MONOTONIC` for
interval measurement and `CLOCK_REALTIME` for wall-clock time.
