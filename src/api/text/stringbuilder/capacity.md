# `Capacity`

Returns how many bytes fit before the block has to grow.

**Package:** `Text`

## Signature

```rux
func Capacity(self) -> uint;
```

## Returns

The size of the block in bytes, and `0` for a builder that has not taken one yet. Everything up to this can be written without reallocating; the first byte past it doubles the block.

Capacity only ever grows on its own — [`Clear`](clear) keeps it, and [`Shrink`](shrink) is what hands it back.

## Example

```rux
import Text::StringBuilder;

func Main() -> int {
    var builder = StringBuilder::New();
    builder.Capacity(); // 0

    builder.Append("Rux");
    builder.Capacity(); // 16 -- the floor the first append takes

    builder.Clear();
    builder.Capacity(); // 16 still -- Clear keeps the block

    builder.Free();
    return 0;
}
```

## See also

- [`StringBuilder`](/api/text/stringbuilder/) — the builder type
- [`Length`](length) — how much of the capacity is used
- [`Reserve`](reserve) — ask for more room up front
- [`Shrink`](shrink) — hand back what is unused
