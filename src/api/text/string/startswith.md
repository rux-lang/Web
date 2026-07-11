# `StartsWith`

Reports whether the string opens with a prefix.

**Module:** `Text`

## Signature

```rux
func StartsWith(self, prefix: String) -> bool;
```

## Parameters

| Name     | Type     | Description          |
| -------- | -------- | -------------------- |
| `prefix` | `String` | The bytes to look for at the front. |

## Returns

`true` when the string's first bytes are the bytes of `prefix`. Every string starts with the empty one, and none starts with a prefix longer than itself.

The comparison is byte for byte and case-sensitive, on the same terms as [`Equals`](equals).

## Example

```rux
import Text::String;

var path = String::From("/usr/local/bin");
var root = String::From("/usr");

path.StartsWith(root);          // true
path.StartsWith(String::New()); // true -- the empty prefix always matches

root.Free();
path.Free();
```

## See also

- [`String`](/api/text/string/) — the string type
- [`EndsWith`](endswith) — the same test at the other end
- [`IndexOf`](indexof) — find the bytes anywhere, not only at the front
- [`Equals`](equals) — compare the whole string
