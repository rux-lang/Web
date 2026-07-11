# `Contains`

Reports whether a substring occurs anywhere in the string.

**Module:** `Text`

## Signature

```rux
func Contains(self, needle: String) -> bool;
```

## Parameters

| Name     | Type     | Description              |
| -------- | -------- | ------------------------ |
| `needle` | `String` | The bytes to search for. |

## Returns

`true` when the bytes of `needle` occur anywhere in the string. The empty needle is contained in every string, and a needle longer than the string is contained in none.

This is [`IndexOf`](indexof) with the offset thrown away, and it costs the same — ask [`IndexOf`](indexof) instead when the position matters.

## Example

```rux
import Text::String;

var text = String::From("Hello, Rux!");
var needle = String::From("Rux");

text.Contains(needle); // true

needle.Free();
text.Free();
```

## See also

- [`String`](/api/text/string/) — the string type
- [`IndexOf`](indexof) — the same search, reporting where the match is
- [`StartsWith`](startswith) — the cheaper test when the match has to be at the front
