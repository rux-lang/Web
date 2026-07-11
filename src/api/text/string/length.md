# `Length`

Returns the length of the string in bytes.

**Module:** `Text`

## Signature

```rux
func Length(self) -> uint;
```

## Returns

The number of bytes the string holds, and `0` for the empty string.

This counts **bytes, not characters**: a multi-byte UTF-8 sequence counts once per byte, so the length of a string is not the number of characters a reader would see in it.

## Example

```rux
import Text::String;

var ascii = String::From("Rux");
ascii.Length(); // 3

var utf8 = String::From("héllo");
utf8.Length();  // 6 -- five characters, six bytes

utf8.Free();
ascii.Free();
```

## See also

- [`String`](/api/text/string/) — the string type
- [`IsEmpty`](isempty) — the `Length() == 0` case
- [`Data`](data) — the bytes this length covers
