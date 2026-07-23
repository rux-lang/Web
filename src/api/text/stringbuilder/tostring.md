# `ToString`

Copies the contents out into a string.

**Package:** `Text`

## Signature

```rux
func ToString(self) -> String;
```

## Returns

A [`String`](../string/) holding a copy of the bytes written so far, in a block of its own. An empty builder yields the empty string.

The builder keeps its own block and stays usable, so **both** it and the `String` own a block and both have to be freed. Reach for [`IntoString`](intostring) instead once the builder is finished with: that one hands the block over rather than copying it.

Taking a snapshot mid-build is what this is for — the `String` will not follow the builder's later appends.

## Example

```rux
import Text::StringBuilder;

func Main() -> int {
    var builder = StringBuilder::New();
    builder.Append("Rux");

    var snapshot = builder.ToString(); // "Rux", its own block

    builder.Append(" rocks");          // the snapshot does not change
    snapshot.Length();                 // 3

    snapshot.Free();
    builder.Free();                    // both own a block
    return 0;
}
```

## See also

- [`StringBuilder`](/api/text/stringbuilder/) — the builder type
- [`IntoString`](intostring) — hand the block over instead of copying it
- [`String::Clone`](../string/clone) — the same copy, from a string
