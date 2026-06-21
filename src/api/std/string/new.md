# `New`

Creates an empty string.

**Module:** `Std`

## Signature

```rux
func New() -> String;
```

## Returns

`String` — an empty string with `null` data and zero length. No buffer is
allocated.

## Description

`New` produces a string of length `0`. It is the canonical way to start an empty
value, and is what several methods (such as [`Repeat`](repeat) with a count of
`0`) return for the empty case.

## See also

- [`String`](/api/std/string/) — the string type
- [`From`](from) — create a string from existing data
- [`IsEmpty`](isempty) — test for an empty string
