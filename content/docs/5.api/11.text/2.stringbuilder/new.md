# New

Creates an empty builder.

**Package:** `Text`

## Signature

```rux
func New() -> StringBuilder;
```

## Returns

An empty `StringBuilder`. It holds no block until the first append, so this allocates nothing: [`Length`](/docs/api/text/stringbuilder/length) and [`Capacity`](/docs/api/text/stringbuilder/capacity) are both `0`, and [`Data`](/docs/api/text/stringbuilder/data) is `null`.

The first [`Append`](/docs/api/text/stringbuilder/append) takes a block of 16 bytes and doubles from there. Reach for [`WithCapacity`](/docs/api/text/stringbuilder/withcapacity) instead when the final size is known up front.

## Example

```rux
import Text::StringBuilder;

func Main() -> int {
    var builder = StringBuilder::New();
    builder.Capacity(); // 0 -- nothing is allocated yet

    builder.Append("Rux");
    builder.Capacity(); // 16 -- the first append takes a block

    builder.Free();
    return 0;
}
```

## See also

- [`StringBuilder`](/docs/api/text/stringbuilder) — the builder type
- [`WithCapacity`](/docs/api/text/stringbuilder/withcapacity) — reserve the room up front
- [`Free`](/docs/api/text/stringbuilder/free) — release the block when the builder is finished with
