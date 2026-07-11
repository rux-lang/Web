# `EndsWith`

Reports whether the string closes with a suffix.

**Module:** `Text`

## Signature

```rux
func EndsWith(self, suffix: String) -> bool;
```

## Parameters

| Name     | Type     | Description                        |
| -------- | -------- | ---------------------------------- |
| `suffix` | `String` | The bytes to look for at the end.  |

## Returns

`true` when the string's last bytes are the bytes of `suffix`. Every string ends with the empty one, and none ends with a suffix longer than itself.

The comparison is byte for byte and case-sensitive, on the same terms as [`StartsWith`](startswith).

## Example

```rux
import Text::String;

var file = String::From("main.rux");
var ext = String::From(".rux");

file.EndsWith(ext); // true

ext.Free();
file.Free();
```

## See also

- [`String`](/api/text/string/) — the string type
- [`StartsWith`](startswith) — the same test at the other end
- [`Contains`](contains) — look for the bytes anywhere
