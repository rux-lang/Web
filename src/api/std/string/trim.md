# `Trim`

Returns a copy with surrounding whitespace removed.

**Module:** `Std`

## Signature

```rux
func Trim(self) -> String;
```

## Returns

`String` — a new string with leading and trailing whitespace removed. A string
consisting entirely of whitespace yields an empty string.

## Description

Whitespace is any of space (` `), tab (`\t`), newline (`\n`), or carriage return
(`\r`). Only the ends are trimmed; interior whitespace is preserved. The receiver
is left untouched — see [`TrimInPlace`](triminplace) for the in-place variant.

## See also

- [`String`](/api/std/string/) — the string type
- [`TrimInPlace`](triminplace) — the in-place variant
