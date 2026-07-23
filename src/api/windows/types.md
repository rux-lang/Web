# Types and Constants

Types and constants exported by the `Windows` package.

**Package:** `Windows`

## Standard Device Handles

Pass one of these to [`GetStdHandle`](getstdhandle) to obtain a handle to the
corresponding standard device.

| Name               | Type     | Value        | Description             |
| ------------------ | -------- | ------------ | ----------------------- |
| `StdInputHandle`   | `uint32` | `0xFFFFFFF6` | Standard input device.  |
| `StdOutputHandle`  | `uint32` | `0xFFFFFFF5` | Standard output device. |
| `StdErrorHandle`   | `uint32` | `0xFFFFFFF4` | Standard error device.  |

## `CreationDisposition`

**Microsoft documentation:** [`CreateFileA`](https://learn.microsoft.com/en-us/windows/win32/api/fileapi/nf-fileapi-createfilea)

```rux
enum CreationDisposition: uint32 {
    CreateNew = 1,
    CreateAlways = 2,
    OpenExisting = 3,
    OpenAlways = 4,
    TruncateExisting = 5
}
```

| Member             | Value | Behavior                                    |
| ------------------ | ----: | ------------------------------------------- |
| `CreateNew`        | `1`   | Create only when the target does not exist. |
| `CreateAlways`     | `2`   | Create or overwrite.                        |
| `OpenExisting`     | `3`   | Open only when the target exists.           |
| `OpenAlways`       | `4`   | Open or create.                             |
| `TruncateExisting` | `5`   | Open and truncate an existing file.         |

## `FileTime`

**Microsoft documentation:** [`FILETIME structure`](https://learn.microsoft.com/en-us/windows/win32/api/minwinbase/ns-minwinbase-filetime)

```rux
struct FileTime {
    lowDateTime: uint32;
    highDateTime: uint32;
}
```

The two fields form an unsigned 64-bit count of 100-nanosecond intervals since January 1, 1601 UTC. `lowDateTime` contains the low-order bits.

## `SystemTime`

**Microsoft documentation:** [`SYSTEMTIME structure`](https://learn.microsoft.com/en-us/windows/win32/api/minwinbase/ns-minwinbase-systemtime)

```rux
struct SystemTime {
    year: uint16;
    month: uint16;
    dayOfWeek: uint16;
    day: uint16;
    hour: uint16;
    minute: uint16;
    second: uint16;
    milliseconds: uint16;
}
```

| Field          | Typical range | Description                    |
| -------------- | ------------- | ------------------------------ |
| `year`         | Full year     | Year.                          |
| `month`        | `1`–`12`      | January is 1.                  |
| `dayOfWeek`    | `0`–`6`       | Sunday is 0.                   |
| `day`          | `1`–`31`      | Day of month.                  |
| `hour`         | `0`–`23`      | Hour.                          |
| `minute`       | `0`–`59`      | Minute.                        |
| `second`       | `0`–`59`      | Second.                        |
| `milliseconds` | `0`–`999`     | Millisecond within the second. |

Filled by [`GetLocalTime`](getlocaltime) (local time) and [`GetSystemTime`](getsystemtime) (UTC).

## `Win32FindDataA`

**Microsoft documentation:** [`WIN32_FIND_DATAA structure`](https://learn.microsoft.com/en-us/windows/win32/api/minwinbase/ns-minwinbase-win32_find_dataa)

```rux
struct Win32FindDataA {
    fileAttributes: uint32;
    creationTime: FileTime;
    lastAccessTime: FileTime;
    lastWriteTime: FileTime;
    fileSizeHigh: uint32;
    fileSizeLow: uint32;
    reserved0: uint32;
    reserved1: uint32;
    fileName: char8[260];
    alternateFileName: char8[14];
}
```

`fileSizeHigh` and `fileSizeLow` form the high and low halves of the unsigned 64-bit file size. The filename arrays hold null-terminated ANSI strings, and applications must not depend on the reserved fields. Populated by [`FindFirstFileA`](findfirstfilea) and [`FindNextFileA`](findnextfilea).

## See also

- [`Windows`](/api/windows/) — the package overview
- [`CodePage`](codepage) — text-encoding identifiers for the conversion functions
