# `ClockGettime`

Reads the current value of a BSD clock.

**Module:** `BSD`

## Signature

```rux
func ClockGettime(clk_id: int32, tp: *timespec) -> int64;
```

## Parameters

| Name     | Type        | Description                               |
| -------- | ----------- | ----------------------------------------- |
| `clk_id` | `int32`     | Clock to read, such as `CLOCK_MONOTONIC`. |
| `tp`     | `*timespec` | Writable destination for the clock value. |

## Returns

`int64` - `0` on success, or the thunk's raw error result on failure.

The compiler-provided thunk selects the target BSD syscall. Use
`CLOCK_REALTIME` for adjustable wall-clock time and `CLOCK_MONOTONIC` for
elapsed-time measurements.

## Example

```rux
import BSD::{ ClockGettime, timespec, CLOCK_MONOTONIC };

var now: timespec;
if ClockGettime(CLOCK_MONOTONIC, &now) != 0i64 {
    return 1i32;
}
```

## See also

- [`Time`](time) - time API overview
- [`Types and constants`](types) - clocks and `timespec`
