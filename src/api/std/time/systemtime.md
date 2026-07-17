# `SystemTime`

A broken-down calendar date and time.

**Module:** `Std::Time`

## Struct

```rux
struct SystemTime {
    year:         uint16;
    month:        uint16;
    dayOfWeek:    uint16;
    day:          uint16;
    hour:         uint16;
    minute:       uint16;
    second:       uint16;
    milliseconds: uint16;
}
```

## Fields

| Field          | Range       | Description                    |
| -------------- | ----------- | ------------------------------ |
| `year`         | e.g. `2026` | Full year.                     |
| `month`        | `1`–`12`    | Month, January = 1.            |
| `dayOfWeek`    | `0`–`6`     | Day of week, Sunday = 0.       |
| `day`          | `1`–`31`    | Day of the month.              |
| `hour`         | `0`–`23`    | Hour, 24-hour clock.           |
| `minute`       | `0`–`59`    | Minute.                        |
| `second`       | `0`–`59`    | Second.                        |
| `milliseconds` | `0`–`999`   | Millisecond within the second. |

## Description

Returned by [`UtcTime`](utctime) and [`LocalTime`](localtime). It is a plain
value struct — read the fields directly to format or compute with the date.

## Example

```rux
import Time;
import Io::PrintLine;

func Main() -> int {
    let t = Time::UtcTime();
    PrintLine(Format("{}:{}:{}", t.hour, t.minute, t.second));
    return 0;
}
```

## See also

- [`UtcTime`](utctime) / [`LocalTime`](localtime) — produce a `SystemTime`
- [`Std::Time`](/api/std/time/) — module overview
