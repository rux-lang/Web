# `StringBuilder`

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

The mutable counterpart to [`String`](../string/). Appending to a `String` allocates on every step, since each transformation returns a fresh one; accumulation happens here instead. The builder keeps spare capacity and doubles it when it runs out, which is what the third field buys over a `String`, and what makes a run of appends cost an amortized constant rather than a reallocation each time.

The fields are an implementation detail — read them with [`Data`](data), [`Length`](length), and [`Capacity`](capacity).

## Ownership

A builder owns its block and has to be passed to [`Free`](free) exactly once, on the same terms as a `String`. The exception is [`IntoString`](intostring), which hands the block over to the `String` it returns and leaves the builder empty and owning nothing — after that only the `String` has to be freed, and [`Free`](free) on the drained builder is a harmless no-op.

Take the result with [`IntoString`](intostring) once the builder is finished with, and with [`ToString`](tostring) when the builder has to stay usable — that one copies, and leaves both to be freed.

## Methods

### Construction

| Method                         | Description                                       |
| ------------------------------ | ------------------------------------------------- |
| [`New`](new)                   | Creates an empty builder, without allocating.     |
| [`WithCapacity`](withcapacity) | Creates an empty builder with room reserved.      |
| [`Free`](free)                 | Releases the block the builder owns.              |

### Accessors

| Method                 | Description                                  |
| ---------------------- | -------------------------------------------- |
| [`Data`](data)         | The pointer to the bytes written so far.     |
| [`Length`](length)     | How many bytes have been written.            |
| [`Capacity`](capacity) | How many bytes fit before the block grows.   |
| [`IsEmpty`](isempty)   | Whether anything has been written.           |

### Building

| Method                 | Description                                     |
| ---------------------- | ----------------------------------------------- |
| [`Append`](append)     | Writes a byte, a literal, or a string.          |
| [`Reserve`](reserve)   | Makes room for N more bytes.                    |
| [`Grow`](grow)         | Grows the block to hold at least N bytes.       |
| [`Shrink`](shrink)     | Drops the capacity the builder is not using.    |
| [`Clear`](clear)       | Forgets the contents but keeps the block.       |

### Conversion

| Method                     | Description                                        |
| -------------------------- | -------------------------------------------------- |
| [`ToString`](tostring)     | Copies the contents out into a `String`.           |
| [`IntoString`](intostring) | Hands the block over to a `String`, without a copy. |

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

- [`Text`](/api/text/) — the package overview
- [`String`](../string/) — the immutable string a builder produces
