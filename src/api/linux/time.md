# Time

Relative sleeping and Linux clock access.

**Module:** `Linux`

| Function                         | Description                      |
| -------------------------------- | -------------------------------- |
| [`ClockGetTime`](clockgettime)   | Read a Linux clock.              |
| [`Nanosleep`](nanosleep)         | Suspend for a relative interval. |

Both functions use [`Timespec`](timespec). Use `CLOCK_MONOTONIC` for interval
measurement and `CLOCK_REALTIME` for wall-clock time.
