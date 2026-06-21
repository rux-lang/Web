# `Clone`

Returns an independent copy of the string.

**Module:** `Std`

## Signature

```rux
func Clone(self) -> String;
```

## Returns

`String` — a new string with its own buffer holding the same bytes.

## Description

`Clone` allocates a new buffer and copies the receiver's contents into it, so the
result can be modified or outlive the original without affecting it. Cloning an
empty string returns another empty string.

This is the way to keep a segment produced by [`Split`](split) alive after the
source string is gone, since those segments are views rather than owned copies.

## See also

- [`String`](/api/std/string/) — the string type
- [`From`](from) — create a string from raw data
- [`Split`](split) — produces non-owning views that may need cloning
