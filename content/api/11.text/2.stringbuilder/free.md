# `Free`

Releases the block the builder owns.

**Package:** `Text`

## Signature

```rux
func Free(self);
```

## Remarks

There are no destructors, so ownership is released by hand, as it is for [`String::Free`](/api/text/string/free). It leaves an empty builder behind — [`Length`](/api/text/stringbuilder/length) and [`Capacity`](/api/text/stringbuilder/capacity) back to `0` — so a second call is a no-op, and the builder stays usable and will take a fresh block on the next append.

It is safe on a builder that owns nothing, which is what a builder is after [`IntoString`](/api/text/stringbuilder/intostring) has given its block away. Calling it there releases nothing and is not a double free.

To keep the block and only forget the contents, use [`Clear`](/api/text/stringbuilder/clear).

## Example

```rux
import Text::StringBuilder;

func Main() -> int {
    var builder = StringBuilder::New();
    builder.Append("Rux");

    builder.Free();
    builder.IsEmpty(); // true

    builder.Append("again"); // fine -- the builder takes a new block
    builder.Free();
    return 0;
}
```

## See also

- [`StringBuilder`](/api/text/stringbuilder) — the builder type
- [`Clear`](/api/text/stringbuilder/clear) — forget the contents but keep the block
- [`IntoString`](/api/text/stringbuilder/intostring) — give the block away instead of releasing it
- [`String::Free`](/api/text/string/free) — the same by-hand release for a string
