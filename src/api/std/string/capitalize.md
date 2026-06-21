# `Capitalize`

Returns a copy with the first character uppercased and the rest lowercased.

**Module:** `Std`

## Signature

```rux
func Capitalize(self) -> String;
```

## Returns

`String` — a new string whose first character is uppercased and whose remaining
ASCII letters are lowercased.

## Description

Affects ASCII letters only; other bytes are copied unchanged. An empty string
returns an empty string. The receiver is left untouched — see
[`CapitalizeInPlace`](capitalizeinplace) for the in-place variant.

## See also

- [`String`](/api/std/string/) — the string type
- [`TitleCase`](titlecase) — capitalize every word
- [`CapitalizeInPlace`](capitalizeinplace) — the in-place variant
