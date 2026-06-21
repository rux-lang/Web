# `MultiByteToWideChar`

Converts multibyte text to UTF-16.

**Module:** `Windows`

**Microsoft documentation:** [`MultiByteToWideChar`](https://learn.microsoft.com/en-us/windows/win32/api/stringapiset/nf-stringapiset-multibytetowidechar)

## Signatures

```rux
func MultiByteToWideChar(codePage: CodePage, flags: uint32,
    multiByteStr: *const char8, multiByte: int32,
    wideCharStr: *char16, wideChar: int32) -> int32;

func MultiByteToWideChar(codePage: uint32, flags: uint32,
    multiByteStr: *const char8, multiByte: int32,
    wideCharStr: *char16, wideChar: int32) -> int32;
```

## Parameters

| Name           | Description                                         |
| -------------- | --------------------------------------------------- |
| `codePage`     | Source encoding.                                    |
| `flags`        | Conversion flags.                                   |
| `multiByteStr` | Source bytes.                                       |
| `multiByte`    | Byte count, or `-1` to include a null terminator.   |
| `wideCharStr`  | UTF-16 destination, or `null` for a size query.     |
| `wideChar`     | Destination capacity in UTF-16 code units.          |

## Returns

`int32` — UTF-16 code units written or required, or `0` on failure. For a size
query, pass `null` and `0` as the destination. The `uint32` overload exists for
`Std` compatibility; prefer `CodePage` in application code.

## See also

- [`WideCharToMultiByte`](widechartomultibyte) — convert from UTF-16
- [`Text conversion`](conversion) — conversion overview
