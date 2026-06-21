# Time

Relative sleeping and clock access.

**Module:** `Illumos`

| Function                           | Description                         |
| ---------------------------------- | ----------------------------------- |
| [`ClockGetTime`](clockgettime)     | Read an Illumos clock.              |
| [`Nanosleep`](nanosleep)           | Suspend for a relative interval.    |

Both functions use the [`Timespec`](types#timespec) layout. Use
`CLOCK_MONOTONIC` for interval measurement and `CLOCK_REALTIME` for wall-clock
time.
