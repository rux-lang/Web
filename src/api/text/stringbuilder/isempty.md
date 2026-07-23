# `IsEmpty`

Reports whether anything has been written.

**Package:** `Text`

## Signature

```rux
func IsEmpty(self) -> bool;
```

## Returns

`true` when [`Length`](length) is `0`.

It says nothing about the [`Capacity`](capacity): a builder that has been [`Clear`](clear)ed is empty but still holds its block, and so is one built with [`WithCapacity`](withcapacity) that has not been appended to.

## Example

```rux
import Text::StringBuilder;

func Main() -> int {
    var builder = StringBuilder::WithCapacity(64);
    builder.IsEmpty();  // true -- room reserved, nothing written

    builder.Append("Rux");
    builder.IsEmpty();  // false

    builder.Clear();
    builder.IsEmpty();  // true, and the 64 bytes are still there

    builder.Free();
    return 0;
}
```

## See also

- [`StringBuilder`](/api/text/stringbuilder/) — the builder type
- [`Length`](length) — the byte count this tests against zero
- [`Clear`](clear) — empty the builder without releasing the block
