# `Clear`

Forgets the contents but keeps the block.

**Package:** `Text`

## Signature

```rux
func Clear(self);
```

## Remarks

Sets [`Length`](length) back to `0` while leaving the block and its [`Capacity`](capacity) alone, so the builder can be filled again without a fresh allocation. This is what to reach for when a builder is reused in a loop.

The bytes are not erased, only forgotten — they sit in the block until they are overwritten, and no method will read them back. Use [`Free`](free) to release the block itself.

## Example

```rux
import Text::StringBuilder;

func Main() -> int {
    var builder = StringBuilder::New();

    for i in 0..3 {
        builder.Append("line");
        // ... use builder.Data() and builder.Length() here
        builder.Clear(); // ready for the next round, same block
    }

    builder.Free();
    return 0;
}
```

## See also

- [`StringBuilder`](/api/text/stringbuilder/) — the builder type
- [`Free`](free) — release the block rather than reuse it
- [`Capacity`](capacity) — the room this keeps hold of
