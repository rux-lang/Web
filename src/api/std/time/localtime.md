# `LocalTime`

Returns the current local date and time.

**Module:** `Std::Time`

## Signature

```rux
func LocalTime() -> SystemTime;
```

## Returns

[`SystemTime`](systemtime) — the current local date and time, broken down into
year, month, day, time, and milliseconds.

## Description

On Windows, this uses the system's configured time zone.

::: warning
On Linux and Illumos, `LocalTime` currently returns the same value as
[`UtcTime`](utctime) — there is no time-zone offset applied yet. On macOS it
returns a zeroed `SystemTime`. See the [module overview](/api/std/time/).
:::

## Example

```rux
import Rux::Time;

let now = Time::LocalTime();
```

## See also

- [`Std::Time`](/api/std/time/) — module overview
- [`UtcTime`](utctime) — UTC variant
- [`SystemTime`](systemtime) — the returned struct
