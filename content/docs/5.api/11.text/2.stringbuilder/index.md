---
navigation:
  title: Overview
---

# StringBuilder

A growable buffer for building a string in steps.

**Package:** `Text`

## Struct

```rux
struct StringBuilder {
    data:     *char8;
    length:   uint;
    capacity: uint;
}
```

The mutable counterpart to [`String`](/docs/api/text/string). Appending to a `String` allocates on every step, since each transformation returns a fresh one; accumulation happens here instead. The builder keeps spare capacity and doubles it when it runs out, which is what the third field buys over a `String`, and what makes a run of appends cost an amortized constant rather than a reallocation each time.

The fields are an implementation detail — read them with [`Data`](/docs/api/text/stringbuilder/data), [`Length`](/docs/api/text/stringbuilder/length), and [`Capacity`](/docs/api/text/stringbuilder/capacity).

## Ownership

A builder owns its block and has to be passed to [`Free`](/docs/api/text/stringbuilder/free) exactly once, on the same terms as a `String`. The exception is [`IntoString`](/docs/api/text/stringbuilder/intostring), which hands the block over to the `String` it returns and leaves the builder empty and owning nothing — after that only the `String` has to be freed, and [`Free`](/docs/api/text/stringbuilder/free) on the drained builder is a harmless no-op.

Take the result with [`IntoString`](/docs/api/text/stringbuilder/intostring) once the builder is finished with, and with [`ToString`](/docs/api/text/stringbuilder/tostring) when the builder has to stay usable — that one copies, and leaves both to be freed.

## Methods

### Construction

| Method                                                      | Description                                   |
| ----------------------------------------------------------- | --------------------------------------------- |
| [`New`](/docs/api/text/stringbuilder/new)                   | Creates an empty builder, without allocating. |
| [`WithCapacity`](/docs/api/text/stringbuilder/withcapacity) | Creates an empty builder with room reserved.  |
| [`Free`](/docs/api/text/stringbuilder/free)                 | Releases the block the builder owns.          |

### Accessors

| Method                                              | Description                                |
| --------------------------------------------------- | ------------------------------------------ |
| [`Data`](/docs/api/text/stringbuilder/data)         | The pointer to the bytes written so far.   |
| [`Length`](/docs/api/text/stringbuilder/length)     | How many bytes have been written.          |
| [`Capacity`](/docs/api/text/stringbuilder/capacity) | How many bytes fit before the block grows. |
| [`IsEmpty`](/docs/api/text/stringbuilder/isempty)   | Whether anything has been written.         |

### Building

| Method                                            | Description                                  |
| ------------------------------------------------- | -------------------------------------------- |
| [`Append`](/docs/api/text/stringbuilder/append)   | Writes a byte, a literal, or a string.       |
| [`Reserve`](/docs/api/text/stringbuilder/reserve) | Makes room for N more bytes.                 |
| [`Grow`](/docs/api/text/stringbuilder/grow)       | Grows the block to hold at least N bytes.    |
| [`Shrink`](/docs/api/text/stringbuilder/shrink)   | Drops the capacity the builder is not using. |
| [`Clear`](/docs/api/text/stringbuilder/clear)     | Forgets the contents but keeps the block.    |

### Conversion

| Method                                                  | Description                                         |
| ------------------------------------------------------- | --------------------------------------------------- |
| [`ToString`](/docs/api/text/stringbuilder/tostring)     | Copies the contents out into a `String`.            |
| [`IntoString`](/docs/api/text/stringbuilder/intostring) | Hands the block over to a `String`, without a copy. |

## Example

```rux
import Io::PrintLine;
import Text::{ String, StringBuilder };

func Main() -> int {
    var builder = StringBuilder::New();

    for i in 0..3 {
        builder.Append("ab");
        builder.Append(c8'-');
    }

    PrintLine(builder.Length()); // 9

    var text = builder.IntoString(); // "ab-ab-ab-", and the builder is empty
    text.Free();
    return 0;
}
```

## See also

- [`Text`](/docs/api/text) — the package overview
- [`String`](/docs/api/text/string) — the immutable string a builder produces
