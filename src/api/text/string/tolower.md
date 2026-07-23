# `ToLower`

Returns a copy with ASCII letters lowercased.

**Package:** `Text`

## Signature

```rux
func ToLower(self) -> String;
```

## Returns

A new `String` in which every byte from `A` to `Z` is lowercased, in a block of its own. The receiver is left untouched, and the empty string yields the empty string.

The fold is **ASCII only**, on the same terms as [`ToUpper`](toupper): every other byte is copied through untouched, so the multi-byte sequences of a UTF-8 string survive intact but do not case fold.

## Example

```rux
import Text::String;

func Main() -> int {
    var text = String::From("Hello, Rux!");

    var quiet = text.ToLower(); // "hello, rux!"

    quiet.Free();
    text.Free();
    return 0;
}
```

## See also

- [`String`](/api/text/string/) — the string type
- [`ToUpper`](toupper) — the fold in the other direction
- [`Equals`](equals) — a comparison that does not fold case
