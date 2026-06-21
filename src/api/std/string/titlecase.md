# `TitleCase`

Returns a copy with the first letter of each word uppercased.

**Module:** `Std`

## Signature

```rux
func TitleCase(self) -> String;
```

## Returns

`String` — a new string with the first letter of each space-separated word
uppercased and the remaining letters lowercased.

## Description

Words are separated by spaces (` `). Within each word, the first ASCII letter is
uppercased and the rest are lowercased; non-letter bytes are copied unchanged.
The receiver is left untouched — see [`TitleCaseInPlace`](titlecaseinplace) for
the in-place variant.

## See also

- [`String`](/api/std/string/) — the string type
- [`Capitalize`](capitalize) — capitalize only the first word
- [`TitleCaseInPlace`](titlecaseinplace) — the in-place variant
