# `GetTimeOfDay`

Reads the current wall-clock time.

**Package:** `MacOS`

## Signature

```rux
func GetTimeOfDay(time: *Timeval) -> int64;
```

## Parameters

| Name   | Type       | Description                              |
| ------ | ---------- | ---------------------------------------- |
| `time` | `*Timeval` | Destination for the current wall time.   |

## Returns

`int64` - `0` on success, or a negative errno value on failure.

The raw Darwin entry point has an optional third `mach_absolute_time` output;
this wrapper leaves it null and fills only the [`Timeval`](types) with seconds
and microseconds since the Unix epoch. As wall-clock time, the value can jump
backward or forward when the system clock is adjusted.

## Example

```rux
import MacOS::{ GetTimeOfDay, Timeval };

func Main() -> int {
    var now: Timeval;
    if GetTimeOfDay(@now) != 0i64 {
        return 1;
    }
    return 0;
}
```

## See also

- [`MacOS`](/api/macos/) — the package overview
- [`Types and constants`](types) - the `Timeval` structure
