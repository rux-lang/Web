# `Clone`

Returns an independent copy of the string.

**Package:** `Text`

## Signature

```rux
func Clone(self) -> String;
```

## Returns

A `String` holding the same bytes in a block of its own. Cloning the empty string allocates nothing.

Assignment copies the struct, not the block, so two `String` values can name the same allocation — freeing both is a double free. `Clone` is what to reach for when both of them have to be freed, and each copy is then released with its own [`Free`](free).

## Example

```rux
import Text::String;

func Main() -> int {
    var original = String::From("Rux");
    var shared = original;         // same block; free one of them, not both
    var copy = original.Clone();   // its own block

    copy == original; // true -- Equals compares bytes, not addresses

    copy.Free();
    original.Free();
    return 0;
}
```

## See also

- [`String`](/api/text/string/) — the string type
- [`Free`](free) — release the block a copy owns
- [`Equals`](equals) — compare two strings by their contents
