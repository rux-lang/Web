# `From`

Creates a string by copying bytes.

**Module:** `Text`

## Signature

```rux
func From(str: *const char8, length: uint) -> String;
func From(str: char8[]) -> String;
```

## Parameters

| Name     | Type                     | Description                          |
| -------- | ------------------------ | ------------------------------------ |
| `str`    | `*const char8` / `char8[]` | The bytes to copy.                 |
| `length` | `uint`                   | How many bytes to copy, for the raw overload. |

## Returns

A `String` owning a block of its own, holding a copy of the bytes. A `length` of `0`, or an empty slice, allocates nothing and yields the empty string.

The slice overload is how a string literal becomes a `String`: the literal is copied, and the read-only page it lives on is left alone. The raw overload is the entry point for bytes that are already in memory — the caller vouches that `length` of them are really there, and the block behind `str` stays the caller's to keep or release.

The result has to be released with [`Free`](free).

## Example

```rux
import Text::String;

var literal = String::From("Hello, Rux!");
literal.Length(); // 11

var raw = String::From(literal.Data(), 5); // "Hello"

raw.Free();
literal.Free();
```

## See also

- [`String`](/api/text/string/) — the string type
- [`New`](new) — the empty string, without a copy
- [`Clone`](clone) — copy a `String` rather than a buffer
- [`Free`](free) — release the block when the string is finished with
