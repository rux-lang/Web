# `ToUpper`

Returns a copy with ASCII letters uppercased.

**Package:** `Text`

## Signature

```rux
func ToUpper(self) -> String;
```

## Returns

A new `String` in which every byte from `a` to `z` is uppercased, in a block of its own. The receiver is left untouched, and the empty string yields the empty string.

The fold is **ASCII only**. Every other byte is copied through untouched, so the multi-byte sequences of a UTF-8 string survive intact but do not case fold — `é` comes back as `é`, not `É`.

## Example

```rux
import Text::String;

func Main() -> int {
    var text = String::From("Hello, Rux!");

    var shout = text.ToUpper(); // "HELLO, RUX!"

    shout.Free();
    text.Free();
    return 0;
}
```

## See also

- [`String`](/api/text/string/) — the string type
- [`ToLower`](tolower) — the fold in the other direction
- [`Equals`](equals) — a comparison that does not fold case
