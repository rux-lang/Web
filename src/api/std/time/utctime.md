# `UtcTime`

Returns the current date and time in UTC.

**Module:** `Std::Time`

## Signature

```rux
func UtcTime() -> SystemTime;
```

## Returns

[`SystemTime`](systemtime) — the current Coordinated Universal Time, broken down
into year, month, day, time, and milliseconds.

## Description

Reads the system's real-time clock and converts it to a calendar date and time in
UTC.

::: warning
Returns a zeroed `SystemTime` on macOS — see the [module overview](/api/std/time/).
:::

## Example

```rux
import Time;
import Io::PrintLine;

func Main() -> int {
    let now = Time::UtcTime();
    PrintLine(Format("{}-{}-{}", now.year, now.month, now.day));
    return 0;
}
```

## See also

- [`Std::Time`](/api/std/time/) — module overview
- [`LocalTime`](localtime) — local-time variant
- [`SystemTime`](systemtime) — the returned struct
