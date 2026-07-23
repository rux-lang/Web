# `WithCapacity`

Creates an empty builder with room reserved up front.

**Package:** `Text`

## Signature

```rux
func WithCapacity(
    capacity: uint
) -> StringBuilder;
```

## Parameters

| Name       | Type   | Description                   |
| ---------- | ------ | ----------------------------- |
| `capacity` | `uint` | How many bytes to reserve.    |

## Returns

An empty `StringBuilder` holding a block of `capacity` bytes. It is empty — [`Length`](length) is `0` — but [`Capacity`](capacity) is what was asked for, and appends that stay within it do not reallocate.

A `capacity` of `0` allocates nothing, which is [`New`](new).

This is worth reaching for when the final size is known: [`String::Repeat`](../string/repeat) sizes its builder this way, which is what makes it one allocation rather than one per round.

## Example

```rux
import Text::StringBuilder;

func Main() -> int {
    var builder = StringBuilder::WithCapacity(64);
    builder.Length();   // 0
    builder.Capacity(); // 64

    builder.Append("Rux");
    builder.Capacity(); // 64 still -- the append fit

    builder.Free();
    return 0;
}
```

## See also

- [`StringBuilder`](/api/text/stringbuilder/) — the builder type
- [`New`](new) — an empty builder that allocates nothing
- [`Reserve`](reserve) — reserve more room on a builder that already exists
- [`Shrink`](shrink) — hand back the capacity that went unused
