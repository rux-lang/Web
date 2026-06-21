# `ClockGetTime`

Reads the current value of a Linux clock.

**Module:** `Linux`

## Signature

```rux
func ClockGetTime(clockId: int32, tp: *Timespec) -> int64;
```

## Parameters

| Name      | Type        | Description                                |
| --------- | ----------- | ------------------------------------------ |
| `clockId` | `int32`     | Clock to read, such as `CLOCK_MONOTONIC`.  |
| `tp`      | `*Timespec` | Writable destination for the clock value.  |

## Returns

`int64` — `0` on success, or a negative errno result on failure.

## Description

Use `CLOCK_REALTIME` for calendar time that can jump when the system clock is
adjusted. Use `CLOCK_MONOTONIC` for elapsed-time measurements; it is not
affected by discontinuous wall-clock changes.

## Example

```rux
import Linux::{ ClockGetTime, IsError, Timespec, CLOCK_MONOTONIC };

var now: Timespec;
if IsError(ClockGetTime(CLOCK_MONOTONIC, &now)) {
    return 1i32;
}
```

## See also

- [`Constants`](constants) — exported clock IDs
- [`Timespec`](timespec) — result structure
- [`Nanosleep`](nanosleep) — relative sleep

