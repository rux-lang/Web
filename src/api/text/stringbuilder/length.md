# `Length`

Returns how many bytes have been written.

**Package:** `Text`

## Signature

```rux
func Length(self) -> uint;
```

## Returns

The number of bytes written so far, which is **not** the [`Capacity`](capacity) — a builder holds a block that is usually bigger than what has been put in it.

The count is in bytes, so a multi-byte UTF-8 sequence counts once per byte.

## Example

```rux
import Text::StringBuilder;

func Main() -> int {
    var builder = StringBuilder::WithCapacity(64);
    builder.Append("Rux");

    builder.Length();   // 3
    builder.Capacity(); // 64

    builder.Free();
    return 0;
}
```

## See also

- [`StringBuilder`](/api/text/stringbuilder/) — the builder type
- [`Capacity`](capacity) — how much room the block has
- [`IsEmpty`](isempty) — the `Length() == 0` case
