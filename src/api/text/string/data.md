# `Data`

Returns the pointer to the underlying bytes.

**Module:** `Text`

## Signature

```rux
func Data(self) -> *char8;
```

## Returns

A pointer to the first byte of the block, or `null` for the empty string.

The block stays the string's to free — this hands out the bytes, not ownership of them. It carries **no null terminator**, so pair it with [`Length`](length) rather than letting anything scan for a terminator that is not there.

The string is immutable, and the pointer stays valid until the string is passed to [`Free`](free).

## Example

```rux
import Text::String;

var text = String::From("Rux");

let bytes = text.Data();
let count = text.Length(); // 3 -- the bytes end here, not at a null

text.Free();               // `bytes` is now dangling
```

## See also

- [`String`](/api/text/string/) — the string type
- [`Length`](length) — how many bytes the pointer covers
- [`At`](at) — read one byte with a bounds check
