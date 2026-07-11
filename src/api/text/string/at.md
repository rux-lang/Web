# `At`

Returns the byte at an index.

**Module:** `Text`

## Signature

```rux
func At(self, index: uint) -> char8;
```

## Parameters

| Name    | Type   | Description                   |
| ------- | ------ | ----------------------------- |
| `index` | `uint` | The offset of the byte, in bytes. |

## Returns

The byte at `index`, or the null character (`'\0'`) when `index` is at or past [`Length`](length) — an out of range read reports rather than running off the end of the block. A null character is therefore ambiguous: it is also what a string that really holds one reports.

The index is a **byte** offset, not a character offset, so indexing into a multi-byte UTF-8 sequence yields one byte of it rather than the character.

## Example

```rux
import Text::String;

var text = String::From("Rux");

text.At(0); // 'R'
text.At(2); // 'x'
text.At(9); // '\0' -- out of range

text.Free();
```

## See also

- [`String`](/api/text/string/) — the string type
- [`Length`](length) — the bound the index is checked against
- [`Substring`](substring) — copy a range of bytes rather than read one
- [`Data`](data) — the bytes without the bounds check
