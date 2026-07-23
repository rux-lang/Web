# `IntoString`

Hands the block over to a string, without copying it.

**Package:** `Text`

## Signature

```rux
func IntoString(self) -> String;
```

## Returns

A [`String`](../string/) owning the builder's block, which costs no copy. The block is [`Shrink`](shrink)ed first, so the `String` owns one sized to its contents rather than to the builder's high-water mark.

The builder is left **empty and owning nothing**, so only the `String` has to be freed — a [`Free`](free) on the drained builder releases nothing and is not a double free. The builder stays usable and will take a fresh block on the next append.

Draining an empty builder yields the empty string.

This is how to take the result once the builder is finished with. Use [`ToString`](tostring) when the builder has to keep its contents.

## Example

```rux
import Text::{ String, StringBuilder };

func Main() -> int {
    var builder = StringBuilder::WithCapacity(1024);
    builder.Append("Hello, ");
    builder.Append("Rux!");

    var greeting = builder.IntoString(); // "Hello, Rux!", the block handed over
    greeting.Length();                   // 11 -- and the block is 11 bytes, not 1024

    builder.IsEmpty();                   // true -- it owns nothing now
    greeting.Free();                     // the only Free needed
    return 0;
}
```

## See also

- [`StringBuilder`](/api/text/stringbuilder/) — the builder type
- [`ToString`](tostring) — copy the contents out and keep the builder's block
- [`Shrink`](shrink) — the trim this does first
- [`String::Free`](../string/free) — release the block the string now owns
