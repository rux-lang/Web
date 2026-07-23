# `Free`

Releases the block the string owns.

**Package:** `Text`

## Signature

```rux
func Free(self);
```

## Remarks

There are no destructors, so ownership is released by hand: every `String` this package returns has to be freed exactly once. The empty string holds a null block, and [`Memory::Free`](/api/memory/free) ignores null, which makes this safe to call on any `String` at all.

It leaves an empty string behind — [`Data`](data) is `null` and [`Length`](length) is `0` — so a second call is a no-op rather than a double free, and the value stays usable as the empty string.

What it cannot see is a block shared by two `String` values, which is what plain assignment produces. Freeing each of them **is** a double free; take a [`Clone`](clone) when both have to be released.

## Example

```rux
import Text::String;

func Main() -> int {
    var text = String::From("Rux");

    text.Free();
    text.IsEmpty(); // true
    text.Free();    // harmless -- there is nothing left to release
    return 0;
}
```

## See also

- [`String`](/api/text/string/) — the string type
- [`Clone`](clone) — take a copy that can be freed on its own
- [`Memory::Free`](/api/memory/free) — the release this is built on
