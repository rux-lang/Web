# Types

Types exported by the `C` package, mirroring the C standard library.

**Package:** `C`

## `time_t`

**C reference:** [`time_t`](https://en.cppreference.com/c/chrono/time_t)

```rux
type time_t = int64;
```

An arithmetic type capable of representing a calendar time, in seconds since the epoch. Used by [`time`](time), [`ctime`](ctime), [`gmtime`](gmtime), [`localtime`](localtime), [`mktime`](mktime), and [`difftime`](difftime).

## `clock_t`

**C reference:** [`clock_t`](https://en.cppreference.com/c/chrono/clock_t)

```rux
type clock_t = int64;
```

An arithmetic type capable of representing processor time. Returned by [`clock`](clock).

## `tm`

**C reference:** [`tm`](https://en.cppreference.com/c/chrono/tm)

```rux
struct tm {
    tm_sec: int32;    // seconds after the minute [0, 60]
    tm_min: int32;    // minutes after the hour [0, 59]
    tm_hour: int32;   // hours since midnight [0, 23]
    tm_mday: int32;   // day of the month [1, 31]
    tm_mon: int32;    // months since January [0, 11]
    tm_year: int32;   // years since 1900
    tm_wday: int32;   // days since Sunday [0, 6]
    tm_yday: int32;   // days since January 1 [0, 365]
    tm_isdst: int32;  // daylight saving time flag
    tm_gmtoff: int64; // seconds east of UTC
    tm_zone: *char8;  // timezone abbreviation
}
```

Calendar time broken into its components. On Windows the layout stops at `tm_isdst`; the `tm_gmtoff` and `tm_zone` fields exist only on the Unix targets. Filled by [`gmtime`](gmtime) and [`localtime`](localtime), and consumed by [`asctime`](asctime), [`mktime`](mktime), and [`strftime`](strftime).

## `timespec`

**C reference:** [`timespec`](https://en.cppreference.com/c/chrono/timespec)

```rux
struct timespec {
    tv_sec: time_t; // whole seconds
    tv_nsec: int64; // nanoseconds [0, 999999999]
}
```

A time expressed in whole seconds plus a nanosecond remainder.

## See also

- [`C`](/api/c/) — the package overview
