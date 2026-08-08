# Data

Returns the pointer to the bytes written so far.

**Package:** `Text`

## Signature

```rux
func Data(self) -> *char8;
```

## Returns

A pointer to the first byte of the block, or `null` for a builder that has not taken one yet.

Unlike [`String::Data`](/docs/api/text/string/data), this points at memory a later append **may move**: growing the block reallocates it. Do not hold the pointer across an [`Append`](/docs/api/text/stringbuilder/append), a [`Reserve`](/docs/api/text/stringbuilder/reserve), a [`Grow`](/docs/api/text/stringbuilder/grow), or a [`Shrink`](/docs/api/text/stringbuilder/shrink) — read it again afterwards.

Only the first [`Length`](/docs/api/text/stringbuilder/length) bytes have been written; the rest of the capacity is uninitialized. There is no null terminator, so pair the pointer with [`Length`](/docs/api/text/stringbuilder/length).

## Example

```rux
import Text::StringBuilder;

func Main() -> int {
    var builder = StringBuilder::New();
    builder.Append("Rux");

    let bytes = builder.Data(); // valid for Length() bytes

    builder.Append(" rocks");   // may reallocate -- `bytes` is now suspect

    builder.Free();
    return 0;
}
```

## See also

- [`StringBuilder`](/docs/api/text/stringbuilder) — the builder type
- [`Length`](/docs/api/text/stringbuilder/length) — how many of the bytes have been written
- [`ToString`](/docs/api/text/stringbuilder/tostring) — take a copy that will not move
- [`String::Data`](/docs/api/text/string/data) — the same pointer on a string, which never moves
