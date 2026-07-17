# `TickMs`

Returns a monotonic millisecond counter.

**Module:** `Std::Time`

## Signature

```rux
func TickMs() -> uint64;
```

## Returns

`uint64` — a millisecond count from a monotonic clock, or `0` if the clock could
not be read.

## Description

`TickMs` reads a steady, always-increasing clock that is not affected by changes
to the wall-clock time. The absolute value is meaningless on its own — take the
difference between two readings to measure elapsed time.

::: warning
Returns `0` on macOS, where the clock is not yet implemented — see the
[module overview](/api/std/time/).
:::

## Example

```rux
import Time;
import Io::PrintLine;

func Main() -> int {
    let start = Time::TickMs();
    DoWork();
    let elapsed = Time::TickMs() - start;
    PrintLine(Format("took {} ms", elapsed));
    return 0;
}
```

## See also

- [`Std::Time`](/api/std/time/) — module overview
- [`UtcTime`](utctime) — wall-clock date and time
