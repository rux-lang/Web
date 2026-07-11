# `Trim`

Returns a copy with the surrounding whitespace dropped.

**Module:** `Text`

## Signature

```rux
func Trim(self) -> String;
```

## Returns

A new `String` with the leading and trailing whitespace removed, in a block of its own. The receiver is left untouched.

Only the ends are trimmed — whitespace inside the string is kept. A string that is nothing but whitespace trims down to the empty string, and so does the empty string.

Whitespace is space, tab, newline, and carriage return, which is exactly what [`IsSpace`](../isspace) reports.

## Example

```rux
import Text::String;

var padded = String::From("  Hello, Rux!  \n");

var text = padded.Trim(); // "Hello, Rux!"
text.Length();            // 11

text.Free();
padded.Free();
```

## See also

- [`String`](/api/text/string/) — the string type
- [`IsSpace`](../isspace) — the bytes this treats as whitespace
- [`Substring`](substring) — drop bytes from the ends by offset instead
