# `WideCharToMultiByte`

Converts UTF-16 text to a multibyte encoding.

**Package:** `Windows`

**Microsoft documentation:** [`WideCharToMultiByte`](https://learn.microsoft.com/en-us/windows/win32/api/stringapiset/nf-stringapiset-widechartomultibyte)

## Signature

```rux
func WideCharToMultiByte(
    codePage: CodePage,
    flags: uint32,
    wideCharStr: *const char16,
    wideChar: int32,
    multiByteStr: *char8,
    multiByte: int32,
    defaultChar: *char8,
    usedDefaultChar: *bool32
) -> int32;
```

## Parameters

| Name              | Description                                          |
| ----------------- | ---------------------------------------------------- |
| `codePage`        | Destination encoding.                                |
| `flags`           | Conversion flags.                                    |
| `wideCharStr`     | UTF-16 source.                                       |
| `wideChar`        | Code-unit count, or `-1` to include a terminator.    |
| `multiByteStr`    | Byte destination, or `null` for a size query.        |
| `multiByte`       | Destination capacity in bytes.                       |
| `defaultChar`     | Substitution byte, or `null`.                        |
| `usedDefaultChar` | Receives whether substitution occurred, or `null`.   |

## Returns

`int32` — bytes written or required, or `0` on failure. For a size query, pass
`null` and `0` as the destination. For UTF-8, pass `null` for both substitution
parameters.

## See also

- [`MultiByteToWideChar`](multibytetowidechar) — convert to UTF-16
- [`Windows`](/api/windows/) — the package overview
