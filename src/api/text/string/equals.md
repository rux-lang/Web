# `Equals`

Reports whether two strings hold the same bytes.

**Package:** `Text`

## Signature

```rux
func Equals(self, other: String) -> bool;
func ==(self, other: String) -> bool;
func !=(self, other: String) -> bool;
```

## Parameters

| Name    | Type     | Description               |
| ------- | -------- | ------------------------- |
| `other` | `String` | The string to compare to. |

## Returns

`true` when both strings hold the same bytes. The comparison is on **contents, not addresses**: two strings holding the same bytes in separate blocks are equal, and so are two empty strings. Strings of different lengths are never equal, which is checked first, so the bytes are only walked when the lengths match.

The `==` and `!=` operators route to `Equals`, so they compare the same way.

The comparison is byte for byte. It does not fold case and does not normalize UTF-8, so two strings that a reader would call the same can still differ here.

## Example

```rux
import Text::String;

func Main() -> int {
    var a = String::From("Rux");
    var b = String::From("Rux"); // a separate block, the same bytes
    var c = String::From("rux");

    a.Equals(b); // true
    a == b;      // true
    a != c;      // true -- the comparison is case-sensitive

    c.Free();
    b.Free();
    a.Free();
    return 0;
}
```

## See also

- [`String`](/api/text/string/) — the string type
- [`StartsWith`](startswith) — compare only the front
- [`Contains`](contains) — look for the bytes anywhere
- [`Memory::Compare`](/api/memory/compare) — the comparison this is built on
