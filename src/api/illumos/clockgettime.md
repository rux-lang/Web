# `ClockGetTime`

Reads the current value of an Illumos clock.

**Module:** `Illumos`

## Signature

```rux
func ClockGetTime(clockId: int32, ts: *Timespec) -> int64;
```

## Parameters

| Name      | Type        | Description                               |
| --------- | ----------- | ----------------------------------------- |
| `clockId` | `int32`     | Clock to read, such as `CLOCK_MONOTONIC`. |
| `ts`      | `*Timespec` | Writable destination for the clock value. |

## Returns

`int64` - `0` on success, or the thunk's raw error result on failure.

Use `CLOCK_REALTIME` for adjustable wall-clock time. Use `CLOCK_MONOTONIC` for
elapsed-time measurements that should not jump with wall-clock adjustments.

## Example

```rux
import Illumos::{ ClockGetTime, Timespec, CLOCK_MONOTONIC };

var now: Timespec;
if ClockGetTime(CLOCK_MONOTONIC, &now) != 0i64 {
    return 1i32;
}
```

## See also

- [`Time`](time) - time API overview
- [`Types and constants`](types) - clocks and `Timespec`
