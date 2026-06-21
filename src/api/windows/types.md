# Types and Constants

Core types and constants exported by the `Windows` module.

**Module:** `Windows`

## `INVALID_HANDLE_VALUE`

**Microsoft documentation:** [`CreateFileA`](https://learn.microsoft.com/en-us/windows/win32/api/fileapi/nf-fileapi-createfilea)

```rux
const INVALID_HANDLE_VALUE = -1;
```

The failure sentinel returned by [`CreateFileA`](files#createfilea) and
[`FindFirstFileA`](enumeration#findfirstfilea). Cast it to the handle pointer
type when comparing it with a returned `*opaque`.

## `StdHandle`

**Microsoft documentation:** [`GetStdHandle`](https://learn.microsoft.com/en-us/windows/console/getstdhandle)

| Member   | Value        | Description              |
| -------- | ------------ | ------------------------ |
| `Error`  | `0xFFFFFFF4` | Standard error device.   |
| `Output` | `0xFFFFFFF5` | Standard output device.  |
| `Input`  | `0xFFFFFFF6` | Standard input device.   |

## File Enums

### `FileAccess`

**Microsoft documentation:** [`FileAccess enum`](https://learn.microsoft.com/en-us/dotnet/api/system.io.fileaccess)

| Member      | Value        | Description        |
| ----------- | ------------ | ------------------ |
| `Read`      | `0x80000000` | Generic read.      |
| `Write`     | `0x40000000` | Generic write.     |
| `ReadWrite` | `0xC0000000` | Read and write.    |

### `FileShare`

**Microsoft documentation:** [`FileShare enum`](https://learn.microsoft.com/en-us/dotnet/api/system.io.fileshare)

| Member   | Value | Description                              |
| -------- | ----: | ---------------------------------------- |
| `None`   | `0`   | Prevent subsequent sharing.              |
| `Read`   | `1`   | Permit subsequent read access.           |
| `Write`  | `2`   | Permit subsequent write access.          |
| `Delete` | `4`   | Permit subsequent delete access.         |

Combine share modes with bitwise OR when multiple modes are needed.

### `CreationDisposition`

**Microsoft documentation:** [`CreateFileA creation disposition`](https://learn.microsoft.com/en-us/windows/win32/api/fileapi/nf-fileapi-createfilea#parameters)

| Member             | Value | Behavior                                      |
| ------------------ | ----: | --------------------------------------------- |
| `CreateNew`        | `1`   | Create only when the target does not exist.   |
| `CreateAlways`     | `2`   | Create or overwrite.                          |
| `OpenExisting`     | `3`   | Open only when the target exists.             |
| `OpenAlways`       | `4`   | Open or create.                               |
| `TruncateExisting` | `5`   | Open and truncate an existing file.           |

### `FileAttributes`

**Microsoft documentation:** [`FileAttributes enum`](https://learn.microsoft.com/en-us/dotnet/api/system.io.fileattributes)

| Member      | Value   | Description                         |
| ----------- | ------- | ----------------------------------- |
| `ReadOnly`  | `0x1`   | Read-only file or directory.        |
| `Hidden`    | `0x2`   | Hidden from ordinary listings.      |
| `System`    | `0x4`   | Used by the operating system.       |
| `Directory` | `0x10`  | Directory entry.                    |
| `Archive`   | `0x20`  | Marked for archival.                |
| `Normal`    | `0x80`  | No other attributes set.            |
| `Temporary` | `0x100` | Used for temporary storage.         |

`Normal` must be used alone. Other compatible attributes can be combined with
bitwise OR, although APIs typed as `FileAttributes` may accept one enum value.

### `SeekOrigin`

**Microsoft documentation:** [`SeekOrigin enum`](https://learn.microsoft.com/en-us/dotnet/api/system.io.seekorigin)

| Member    | Value | Base position                |
| --------- | ----: | ---------------------------- |
| `Begin`   | `0`   | Beginning of the file.       |
| `Current` | `1`   | Current file pointer.        |
| `End`     | `2`   | End of the file.             |

## `FileTime`

**Microsoft documentation:** [`FILETIME structure`](https://learn.microsoft.com/en-us/windows/win32/api/minwinbase/ns-minwinbase-filetime)

```rux
struct FileTime {
    lowDateTime:  uint32;
    highDateTime: uint32;
}
```

The two fields form an unsigned 64-bit count of 100-nanosecond intervals since
January 1, 1601 UTC. `lowDateTime` contains the low-order bits.

## `SystemTime`

**Microsoft documentation:** [`SYSTEMTIME structure`](https://learn.microsoft.com/en-us/windows/win32/api/minwinbase/ns-minwinbase-systemtime)

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

## `Win32FindDataA`

**Microsoft documentation:** [`WIN32_FIND_DATAA structure`](https://learn.microsoft.com/en-us/windows/win32/api/minwinbase/ns-minwinbase-win32_find_dataa)

```rux
struct Win32FindDataA {
    fileAttributes:   uint32;
    creationTime:     FileTime;
    lastAccessTime:   FileTime;
    lastWriteTime:    FileTime;
    fileSizeHigh:     uint32;
    fileSizeLow:      uint32;
    reserved0:        uint32;
    reserved1:        uint32;
    fileName:         char8[260];
    alternateFileName: char8[14];
}
```

`fileSizeHigh` and `fileSizeLow` form the high and low halves of the unsigned
64-bit file size. The filename arrays contain null-terminated ANSI strings.
Applications must not depend on the reserved fields.

## See also

- [`CodePage`](codepage) — text encoding identifiers
- [`File I/O`](files) — use the file enums
- [`File enumeration`](enumeration) — populate `Win32FindDataA`
