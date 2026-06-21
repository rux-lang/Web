# `Data`

Returns a pointer to the underlying byte buffer.

**Module:** `Std`

## Signature

```rux
func Data(self) -> *char8;
```

## Returns

`*char8` — a pointer to the first byte of the string's buffer.

## Description

The buffer holds exactly [`Length`](length) bytes and is **not** null-terminated.
The pointer is only valid while the `String` is alive and unmodified; do not
retain it past the lifetime of the string.

## See also

- [`String`](/api/std/string/) — the string type
- [`Length`](length) — number of bytes in the buffer
