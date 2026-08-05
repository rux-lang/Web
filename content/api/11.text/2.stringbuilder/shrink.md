# Shrink

Drops the capacity the builder is not using.

**Package:** `Text`

## Signature

```rux
func Shrink(self);
```

## Remarks

Resizes the block down to exactly [`Length`](/api/text/stringbuilder/length) bytes, so the builder holds no more memory than its contents need. The contents are kept. A builder that is already exactly full is left alone, and one that is empty releases its block outright, as [`Free`](/api/text/stringbuilder/free) would.

[`IntoString`](/api/text/stringbuilder/intostring) leans on this, which is why the `String` it hands out owns a block sized to its contents rather than to the builder's high-water mark.

The resize may move the block, so a pointer taken from [`Data`](/api/text/stringbuilder/data) beforehand must not be used after.

## Example

```rux
import Text::StringBuilder;

func Main() -> int {
    var builder = StringBuilder::WithCapacity(1024);
    builder.Append("Rux");

    builder.Capacity(); // 1024
    builder.Shrink();
    builder.Capacity(); // 3 -- the 1021 unused bytes are handed back
    builder.Length();   // 3 -- the contents are kept

    builder.Free();
    return 0;
}
```

## See also

- [`StringBuilder`](/api/text/stringbuilder) — the builder type
- [`Grow`](/api/text/stringbuilder/grow) — the way back up
- [`IntoString`](/api/text/stringbuilder/intostring) — shrinks before it hands the block over
- [`Free`](/api/text/stringbuilder/free) — release the block instead of trimming it
