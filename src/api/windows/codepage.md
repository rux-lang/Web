# `CodePage`

Identifies a Windows character encoding.

**Module:** `Windows`

**Microsoft documentation:** [`Code page identifiers`](https://learn.microsoft.com/en-us/windows/win32/intl/code-page-identifiers)

```rux
enum CodePage: uint32
```

The enum exposes the Windows code-page identifiers accepted by
[`MultiByteToWideChar`](conversion#multibytetowidechar) and
[`WideCharToMultiByte`](conversion#widechartomultibyte). Common members are:

| Member        | Value   | Encoding                         |
| ------------- | ------: | -------------------------------- |
| `Utf8`        | `65001` | UTF-8.                           |
| `Utf7`        | `65000` | UTF-7; avoid for new data.       |
| `Utf16Le`     | `1200`  | UTF-16 little-endian.            |
| `Utf16Be`     | `1201`  | UTF-16 big-endian.               |
| `Utf32Le`     | `12000` | UTF-32 little-endian.            |
| `Utf32Be`     | `12001` | UTF-32 big-endian.               |
| `UsAscii`     | `20127` | 7-bit US ASCII.                  |
| `Windows1250` | `1250`  | Windows Central European.        |
| `Windows1251` | `1251`  | Windows Cyrillic.                |
| `Windows1252` | `1252`  | Windows Western European.        |
| `ShiftJis`    | `932`   | Japanese Shift-JIS.              |
| `Gb2312`      | `936`   | Simplified Chinese.              |
| `KsC5601`     | `949`   | Korean.                          |
| `Big5`        | `950`   | Traditional Chinese.             |
| `Gb18030`     | `54936` | GB18030 Simplified Chinese.      |

The enum also includes the OEM, EBCDIC, Macintosh, ISO-8859, ISO-2022, EUC,
KOI8, ISCII, and legacy East Asian identifiers declared by Windows. Prefer
`CodePage.Utf8` for new interoperable text.

::: warning
A code-page identifier does not make an `A`-suffixed API UTF-8. Those APIs use
the process ANSI conventions. Convert explicitly when Unicode correctness is
required.
:::
