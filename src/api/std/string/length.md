# `Length`

Returns the length of the string in bytes.

**Module:** `Std`

## Signature

```rux
func Length(self) -> uint;
```

## Returns

`uint` — the number of bytes in the string.

## Description

`Length` reports the **byte** length, not the number of characters. Since strings
are UTF-8, a multi-byte character counts as more than one byte.

## See also

- [`String`](/api/std/string/) — the string type
- [`Data`](data) — pointer to the bytes counted here
- [`IsEmpty`](isempty) — test for zero length
