# `Substring`

Returns a copy of the bytes in a range.

**Package:** `Text`

## Signature

```rux
func Substring(
    self,
    start: uint,
    length: uint
) -> String;
```

## Parameters

| Name     | Type   | Description                            |
| -------- | ------ | -------------------------------------- |
| `start`  | `uint` | The byte offset to copy from.          |
| `length` | `uint` | How many bytes to copy.                |

## Returns

A new `String` holding `length` bytes from `start`, in a block of its own. The receiver is left untouched.

A range that runs past the end is **clamped** to what is there, so the result is never longer than the receiver and a length past the end is not an error. A `start` at or past the end yields the empty string, and so does a `length` of `0`.

Both arguments are in **bytes**, so a range that begins or ends inside a multi-byte UTF-8 sequence cuts it in half.

## Example

```rux
import Text::String;

func Main() -> int {
    var text = String::From("Hello, Rux!");

    var hello = text.Substring(0, 5);  // "Hello"
    var rux = text.Substring(7, 3);    // "Rux"
    var tail = text.Substring(7, 999); // "Rux!" -- clamped to what is there
    var none = text.Substring(99, 3);  // "" -- start is past the end

    none.Free();
    tail.Free();
    rux.Free();
    hello.Free();
    text.Free();
    return 0;
}
```

## See also

- [`String`](/api/text/string/) — the string type
- [`IndexOf`](indexof) — find the offset to copy from
- [`At`](at) — read one byte instead of copying a range
- [`Trim`](trim) — the common case of dropping the ends
