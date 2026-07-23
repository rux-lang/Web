# `ClockGetTime`

Reads the current value of a Linux clock.

**Package:** `Linux`

## Signature

```rux
func ClockGetTime(clockId: int32, tp: *Timespec) -> int64;
```

## Parameters

| Name      | Type        | Description                                |
| --------- | ----------- | ------------------------------------------ |
| `clockId` | `int32`     | Clock to read, such as `ClockMonotonic`.  |
| `tp`      | `*Timespec` | Writable destination for the clock value.  |

## Returns

`int64` — `0` on success, or a negative errno result on failure.

## Description

Use `ClockRealtime` for calendar time that can jump when the system clock is
adjusted. Use `ClockMonotonic` for elapsed-time measurements; it is not
affected by discontinuous wall-clock changes.

## Example

```rux
import Linux::{ ClockGetTime, IsError, Timespec, ClockMonotonic };

func Main() -> int {
    var now: Timespec;
    if IsError(ClockGetTime(ClockMonotonic, @now)) {
        return 1;
    }
    return 0;
}
```

## See also

- [`Constants`](types) — exported clock IDs
- [`Timespec`](types) — result structure
- [`Nanosleep`](nanosleep) — relative sleep

