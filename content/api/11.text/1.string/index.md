---
navigation:
  title: Overview
---

# `String`

An immutable, heap-allocated string.

**Package:** `Text`

## Struct

```rux
struct String {
    data:   *char8;
    length: uint;
}
```

A `String` owns the block of `length` bytes behind `data` and never writes to it again: every transformation below returns a fresh `String` and leaves the receiver untouched. The fields are an implementation detail — read them with [`Data`](/api/text/string/data) and [`Length`](/api/text/string/length).

The bytes are not terminated by a null, and `length` counts bytes rather than characters, so a multi-byte UTF-8 sequence counts for more than one.

## Ownership

Assignment copies the struct, not the block, so two `String` values can name the same allocation. Take [`Clone`](/api/text/string/clone) when both of them have to be freed, and pass each one to [`Free`](/api/text/string/free) exactly once. The empty `String` owns no block, which is why [`New`](/api/text/string/new) allocates nothing and [`Free`](/api/text/string/free) can be called on anything this package returns.

Because each transformation allocates, `+` in a loop is a chain of allocations. Accumulate with a [`StringBuilder`](/api/text/stringbuilder) instead.

## Methods

### Construction

| Method                            | Description                                        |
| --------------------------------- | -------------------------------------------------- |
| [`New`](/api/text/string/new)     | Creates an empty string, without allocating.       |
| [`From`](/api/text/string/from)   | Creates a string by copying a literal or a buffer. |
| [`Clone`](/api/text/string/clone) | Returns an independent copy, with its own block.   |
| [`Free`](/api/text/string/free)   | Releases the block the string owns.                |

### Accessors

| Method                                | Description                          |
| ------------------------------------- | ------------------------------------ |
| [`Data`](/api/text/string/data)       | The pointer to the underlying bytes. |
| [`Length`](/api/text/string/length)   | The length in bytes.                 |
| [`IsEmpty`](/api/text/string/isempty) | Whether the string holds no bytes.   |
| [`At`](/api/text/string/at)           | The byte at an index.                |

### Comparison

| Method                              | Description                                                  |
| ----------------------------------- | ------------------------------------------------------------ |
| [`Equals`](/api/text/string/equals) | Whether two strings hold the same bytes. Also `==` and `!=`. |

### Search

| Method                                      | Description                              |
| ------------------------------------------- | ---------------------------------------- |
| [`StartsWith`](/api/text/string/startswith) | Whether the string opens with a prefix.  |
| [`EndsWith`](/api/text/string/endswith)     | Whether the string closes with a suffix. |
| [`IndexOf`](/api/text/string/indexof)       | The offset of the first match, or `-1`.  |
| [`Contains`](/api/text/string/contains)     | Whether a substring occurs anywhere.     |

### Transformation

Each returns a **new** `String` and leaves the receiver unchanged.

| Method                                    | Description                                   |
| ----------------------------------------- | --------------------------------------------- |
| [`+`](/api/text/string/plus)              | Joins two strings, or a string and a literal. |
| [`Substring`](/api/text/string/substring) | A copy of the bytes in a range.               |
| [`ToUpper`](/api/text/string/toupper)     | A copy with ASCII letters uppercased.         |
| [`ToLower`](/api/text/string/tolower)     | A copy with ASCII letters lowercased.         |
| [`Trim`](/api/text/string/trim)           | A copy with surrounding whitespace dropped.   |
| [`Repeat`](/api/text/string/repeat)       | A copy of the contents laid down N times.     |

## Example

```rux
import Io::PrintLine;
import Text::String;

func Main() -> int {
    var greeting = String::From("Hello, Rux!");
    var needle = String::From("Rux");

    PrintLine(greeting.Length());        // 11
    PrintLine(greeting.Contains(needle)); // true
    PrintLine(greeting.IndexOf(needle));  // 7

    var shout = greeting.ToUpper(); // "HELLO, RUX!"

    shout.Free();
    needle.Free();
    greeting.Free();
    return 0;
}
```

## See also

- [`Text`](/api/text) — the package overview
- [`StringBuilder`](/api/text/stringbuilder) — build a string without allocating on every step
