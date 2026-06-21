# `Nanosleep`

Suspends execution for a relative interval.

**Module:** `BSD`

## Signature

```rux
func Nanosleep(req: *timespec, rem: *timespec) -> int64;
```

## Parameters

| Name  | Type        | Description                                      |
| ----- | ----------- | ------------------------------------------------ |
| `req` | `*timespec` | Requested relative duration.                     |
| `rem` | `*timespec` | Receives remaining time if interrupted, or `null`. |

## Returns

`int64` - `0` after the interval elapses, or the thunk's raw error result on
failure or interruption.

`req.tv_nsec` must normally be from `0` through `999999999`. When interrupted,
a non-null `rem` receives the unslept duration.

## Example

```rux
import BSD::{ Nanosleep, timespec };

var delay = timespec { tv_sec: 0i64, tv_nsec: 250000000i64 };
if Nanosleep(&delay, null) != 0i64 {
    return 1i32;
}
```

## See also

- [`Time`](time) - time API overview
- [`Types and constants`](types) - `timespec`
