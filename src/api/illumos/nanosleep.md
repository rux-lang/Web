# `Nanosleep`

Suspends execution for a relative time interval.

**Module:** `Illumos`

## Signature

```rux
func Nanosleep(req: *opaque, rem: *opaque) -> int64;
```

## Parameters

| Name  | Type      | Description                                      |
| ----- | --------- | ------------------------------------------------ |
| `req` | `*opaque` | Pointer to the requested `Timespec` duration.    |
| `rem` | `*opaque` | Receives remaining time if interrupted, or `null`. |

## Returns

`int64` - `0` after the interval elapses, or the thunk's raw error result on
failure or interruption.

The requested `tv_nsec` value must normally be from `0` through `999999999`.
When interruption reporting is needed, pass a pointer to a writable `Timespec`
as `rem`.

## Example

```rux
import Illumos::{ Nanosleep, Timespec };

var delay = Timespec { tv_sec: 0i64, tv_nsec: 250000000i64 };
if Nanosleep(&delay as *opaque, null) != 0i64 {
    return 1i32;
}
```

## See also

- [`Time`](time) - time API overview
- [`Types and constants`](types) - `Timespec`
