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

A `String` owns the block of `length` bytes behind `data` and never writes to it again: every transformation below returns a fresh `String` and leaves the receiver untouched. The fields are an implementation detail — read them with [`Data`](data) and [`Length`](length).

The bytes are not terminated by a null, and `length` counts bytes rather than characters, so a multi-byte UTF-8 sequence counts for more than one.

## Ownership

Assignment copies the struct, not the block, so two `String` values can name the same allocation. Take [`Clone`](clone) when both of them have to be freed, and pass each one to [`Free`](free) exactly once. The empty `String` owns no block, which is why [`New`](new) allocates nothing and [`Free`](free) can be called on anything this package returns.

Because each transformation allocates, `+` in a loop is a chain of allocations. Accumulate with a [`StringBuilder`](../stringbuilder/) instead.

## Methods

### Construction

| Method           | Description                                        |
| ---------------- | -------------------------------------------------- |
| [`New`](new)     | Creates an empty string, without allocating.       |
| [`From`](from)   | Creates a string by copying a literal or a buffer. |
| [`Clone`](clone) | Returns an independent copy, with its own block.   |
| [`Free`](free)   | Releases the block the string owns.                |

### Accessors

| Method               | Description                                 |
| -------------------- | ------------------------------------------- |
| [`Data`](data)       | The pointer to the underlying bytes.        |
| [`Length`](length)   | The length in bytes.                        |
| [`IsEmpty`](isempty) | Whether the string holds no bytes.          |
| [`At`](at)           | The byte at an index.                       |

### Comparison

| Method             | Description                                                 |
| ------------------ | ----------------------------------------------------------- |
| [`Equals`](equals) | Whether two strings hold the same bytes. Also `==` and `!=`. |

### Search

| Method                     | Description                                        |
| -------------------------- | -------------------------------------------------- |
| [`StartsWith`](startswith) | Whether the string opens with a prefix.            |
| [`EndsWith`](endswith)     | Whether the string closes with a suffix.           |
| [`IndexOf`](indexof)       | The offset of the first match, or `-1`.            |
| [`Contains`](contains)     | Whether a substring occurs anywhere.               |

### Transformation

Each returns a **new** `String` and leaves the receiver unchanged.

| Method                   | Description                                   |
| ------------------------ | --------------------------------------------- |
| [`+`](plus)              | Joins two strings, or a string and a literal. |
| [`Substring`](substring) | A copy of the bytes in a range.               |
| [`ToUpper`](toupper)     | A copy with ASCII letters uppercased.         |
| [`ToLower`](tolower)     | A copy with ASCII letters lowercased.         |
| [`Trim`](trim)           | A copy with surrounding whitespace dropped.   |
| [`Repeat`](repeat)       | A copy of the contents laid down N times.     |

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

- [`Text`](/api/text/) — the package overview
- [`StringBuilder`](../stringbuilder/) — build a string without allocating on every step
