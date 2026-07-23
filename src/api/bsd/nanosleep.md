# `Nanosleep`

Suspends execution for a relative interval.

**Package:** `Bsd`

## Signature

```rux
func Nanosleep(req: *Timespec, rem: *Timespec) -> int64;
```

## Parameters

| Name  | Type        | Description                                      |
| ----- | ----------- | ------------------------------------------------ |
| `req` | `*Timespec` | Requested relative duration.                     |
| `rem` | `*Timespec` | Receives remaining time if interrupted, or `null`. |

## Returns

`int64` - `0` after the interval elapses, or a negative errno value on
failure or interruption.

`req.nanoseconds` must normally be from `0` through `999999999`. When interrupted,
a non-null `rem` receives the unslept duration.

## Example

```rux
import Bsd::{ Nanosleep, Timespec };

func Main() -> int {
    var delay = Timespec { seconds: 0i64, nanoseconds: 250000000i64 };
    if Nanosleep(@delay, null) != 0i64 {
        return 1;
    }
    return 0;
}
```

## See also

- [`Bsd`](/api/bsd/) — the package overview
- [`Types and constants`](types) - `Timespec`
