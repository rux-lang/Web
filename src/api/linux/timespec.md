# `Timespec`

A Linux time interval or timestamp with nanosecond precision.

**Module:** `Linux`

## Struct

```rux
struct Timespec {
    tv_sec:  int64;
    tv_nsec: int64;
}
```

## Fields

| Field     | Type    | Description                                      |
| --------- | ------- | ------------------------------------------------ |
| `tv_sec`  | `int64` | Whole seconds.                                   |
| `tv_nsec` | `int64` | Nanoseconds within the second, normally 0–999,999,999. |

The meaning of the value depends on the operation. [`Nanosleep`](nanosleep)
interprets it as a relative duration, while [`ClockGetTime`](clockgettime)
writes a timestamp for the selected clock.

## Example

```rux
import Linux::{ Nanosleep, Timespec };

var delay = Timespec { tv_sec: 0i64, tv_nsec: 250000000i64 };
let result = Nanosleep(&delay, null);
```

## See also

- [`Nanosleep`](nanosleep) — sleep for a relative duration
- [`ClockGetTime`](clockgettime) — read a clock into a `Timespec`

