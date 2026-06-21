# `Nanosleep`

Suspends execution for a relative time interval.

**Module:** `Linux`

## Signature

```rux
func Nanosleep(req: *const Timespec, rem: *Timespec) -> int64;
```

## Parameters

| Name  | Type              | Description                                      |
| ----- | ----------------- | ------------------------------------------------ |
| `req` | `*const Timespec` | Requested relative duration.                     |
| `rem` | `*Timespec`       | Receives remaining time if interrupted, or `null`. |

## Returns

`int64` — `0` after the requested interval elapses, or a negative errno result
on failure or interruption.

## Description

`req.tv_nsec` must be between `0` and `999999999`. When a signal interrupts the
sleep, Linux returns a negative `EINTR` result and, when `rem` is non-null,
writes the unslept duration to `rem`.

## Example

```rux
import Linux::{ IsError, Nanosleep, Timespec };

var delay = Timespec { tv_sec: 1i64, tv_nsec: 0i64 };
if IsError(Nanosleep(&delay, null)) {
    return 1i32;
}
```

## See also

- [`Timespec`](timespec) — time structure
- [`ClockGetTime`](clockgettime) — read a clock

