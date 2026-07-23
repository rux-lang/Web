# `IndexOf`

Returns the offset of the first occurrence of a substring.

**Package:** `Text`

## Signature

```rux
func IndexOf(self, needle: String) -> int;
```

## Parameters

| Name     | Type     | Description             |
| -------- | -------- | ----------------------- |
| `needle` | `String` | The bytes to search for. |

## Returns

The byte offset of the first match, or `-1` when there is none. The empty needle matches at the front and reports `0`, and a needle longer than the string never matches.

The offset is in **bytes**, so it can be handed straight to [`Substring`](substring), and it can land inside a multi-byte UTF-8 sequence when the needle does.

The scan is the plain one — every starting offset is tried in turn — so the worst case costs the product of the two lengths. Reach for [`Contains`](contains) when only the answer matters and not the position.

## Example

```rux
import Text::String;

func Main() -> int {
    var text = String::From("Hello, Rux!");
    var needle = String::From("Rux");
    var missing = String::From("C");

    text.IndexOf(needle);  // 7
    text.IndexOf(missing); // -1

    missing.Free();
    needle.Free();
    text.Free();
    return 0;
}
```

## See also

- [`String`](/api/text/string/) — the string type
- [`Contains`](contains) — the same search when the position does not matter
- [`Substring`](substring) — copy the bytes the offset points at
- [`StartsWith`](startswith) — the cheaper test when the match has to be at the front
