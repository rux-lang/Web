# `Std::Time`

Sleeping, monotonic timing, and wall-clock time.

**Module:** `Std::Time`

```rux
import Time;
import Io::PrintLine;

func Main() -> int {
    let start = Time::TickMs();
    Time::SleepMs(50u32);
    PrintLine(Time::TickMs() - start);   // ~50
    return 0;
}
```

::: warning
On **macOS**, `Std::Time` is currently a no-op stub: the sleep functions do
nothing, `TickMs` returns `0`, and `LocalTime`/`UtcTime` return a zeroed
[`SystemTime`](systemtime). The clock thunks are not yet wired into the compiler.
:::

## Sleeping

| Function                       | Description                         |
| ------------------------------ | ----------------------------------- |
| [`SleepMs`](sleepms)           | Pause for a number of milliseconds. |
| [`SleepSeconds`](sleepseconds) | Pause for a number of seconds.      |
| [`SleepMinutes`](sleepminutes) | Pause for a number of minutes.      |

## Timing

| Function           | Description                                               |
| ------------------ | --------------------------------------------------------- |
| [`TickMs`](tickms) | Monotonic millisecond counter for measuring elapsed time. |

## Wall-clock time

| Function                   | Description                                    |
| -------------------------- | ---------------------------------------------- |
| [`UtcTime`](utctime)       | Current date and time in UTC.                  |
| [`LocalTime`](localtime)   | Current local date and time.                   |
| [`SystemTime`](systemtime) | The broken-down date/time struct these return. |
