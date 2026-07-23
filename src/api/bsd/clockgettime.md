# `ClockGetTime`

Reads the current value of a BSD clock.

**Package:** `Bsd`

## Signature

```rux
func ClockGetTime(clk_id: int32, tp: *Timespec) -> int64;
```

## Parameters

| Name     | Type        | Description                               |
| -------- | ----------- | ----------------------------------------- |
| `clk_id` | `int32`     | Clock to read, such as `ClockMonotonic`. |
| `tp`     | `*Timespec` | Writable destination for the clock value. |

## Returns

`int64` - `0` on success, or a negative errno value on failure.

The compiler-provided thunk selects the target BSD syscall. Use
`ClockRealtime` for adjustable wall-clock time and `ClockMonotonic` for
elapsed-time measurements.

## Example

```rux
import Bsd::{ ClockGetTime, Timespec, ClockMonotonic };

func Main() -> int {
    var now: Timespec;
    if ClockGetTime(ClockMonotonic, @now) != 0i64 {
        return 1;
    }
    return 0;
}
```

## See also

- [`Bsd`](/api/bsd/) — the package overview
- [`Types and constants`](types) - clocks and `Timespec`
