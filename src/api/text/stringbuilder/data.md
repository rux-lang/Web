# `Data`

Returns the pointer to the bytes written so far.

**Module:** `Text`

## Signature

```rux
func Data(self) -> *char8;
```

## Returns

A pointer to the first byte of the block, or `null` for a builder that has not taken one yet.

Unlike [`String::Data`](../string/data), this points at memory a later append **may move**: growing the block reallocates it. Do not hold the pointer across an [`Append`](append), a [`Reserve`](reserve), a [`Grow`](grow), or a [`Shrink`](shrink) — read it again afterwards.

Only the first [`Length`](length) bytes have been written; the rest of the capacity is uninitialized. There is no null terminator, so pair the pointer with [`Length`](length).

## Example

```rux
import Text::StringBuilder;

var builder = StringBuilder::New();
builder.Append("Rux");

let bytes = builder.Data(); // valid for Length() bytes

builder.Append(" rocks");   // may reallocate -- `bytes` is now suspect

builder.Free();
```

## See also

- [`StringBuilder`](/api/text/stringbuilder/) — the builder type
- [`Length`](length) — how many of the bytes have been written
- [`ToString`](tostring) — take a copy that will not move
- [`String::Data`](../string/data) — the same pointer on a string, which never moves
