# `+`

Joins two strings into a new one.

**Package:** `Text`

## Signature

```rux
func +(self, other: String) -> String;
func +(self, other: Slice<char8>) -> String;
```

## Parameters

| Name    | Type                  | Description                    |
| ------- | --------------------- | ------------------------------ |
| `other` | `String` / `Slice<char8>`  | The bytes to append.           |

## Returns

A new `String` holding the bytes of both operands, in a block of its own. Both operands are left as they were, and joining two empty strings allocates nothing.

The slice overload lets a literal be joined on without wrapping it in a `String` first.

The result owns its block and has to be released with [`Free`](free) — including the intermediate results of a chain, which is what makes `a + b + c` three allocations and two leaks if only the last one is freed. In a loop it is a chain of allocations: accumulate with a [`StringBuilder`](../stringbuilder/) instead.

## Example

```rux
import Text::String;

func Main() -> int {
    var greeting = String::From("Hello");
    var name = String::From("Rux");

    var comma = greeting + ", "; // "Hello, "
    var full = comma + name;     // "Hello, Rux"

    full.Free();
    comma.Free();                // the intermediate owns a block too
    name.Free();
    greeting.Free();
    return 0;
}
```

## See also

- [`String`](/api/text/string/) — the string type
- [`StringBuilder::Append`](../stringbuilder/append) — join without allocating on every step
- [`Repeat`](repeat) — join a string to itself N times, in one allocation
- [`Free`](free) — release the block the result owns
