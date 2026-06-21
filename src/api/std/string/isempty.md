# `IsEmpty`

Reports whether the string has zero length.

**Module:** `Std`

## Signature

```rux
func IsEmpty(self) -> bool8;
```

## Returns

`bool8` — `true` if the string has zero length, otherwise `false`.

## Description

A convenience for the common `Length() == 0` check.

## See also

- [`String`](/api/std/string/) — the string type
- [`Length`](length) — the underlying byte length
- [`New`](new) — create an empty string
