# `StringBuilder`

A growable buffer for building strings efficiently.

**Module:** `Std`

## Struct

```rux
struct StringBuilder {
    data:     *char8;
    length:   uint;
    capacity: uint;
}
```

A `StringBuilder` accumulates bytes in a buffer that grows as needed, avoiding
the repeated allocations you'd get from concatenating [`String`](../string/)
values in a loop. When the content is complete, convert it to a `String` with
[`ToString`](tostring) (copy) or [`IntoString`](intostring) (hand over the
buffer).

The buffer grows geometrically: when more room is needed, capacity starts at 16
and doubles until it fits, so appending N bytes costs amortized O(N).

## Methods

### Construction

| Method                         | Description                                 |
| ------------------------------ | ------------------------------------------- |
| [`New`](new)                   | Creates an empty builder.                   |
| [`WithCapacity`](withcapacity) | Creates a builder with space pre-allocated. |

### Capacity

| Method                 | Description                          |
| ---------------------- | ------------------------------------ |
| [`Capacity`](capacity) | Current allocated capacity in bytes. |
| [`Reserve`](reserve)   | Ensure room for additional bytes.    |
| [`Shrink`](shrink)     | Release unused capacity.             |

### Appending

| Method             | Description                           |
| ------------------ | ------------------------------------- |
| [`Append`](append) | Append a `char8`, slice, or `String`. |

### Conversion

| Method                     | Description                                   |
| -------------------------- | --------------------------------------------- |
| [`ToString`](tostring)     | Copy the contents into a new `String`.        |
| [`IntoString`](intostring) | Consume the builder, transferring its buffer. |

### Inspection

| Method               | Description                              |
| -------------------- | ---------------------------------------- |
| [`Length`](length)   | Number of bytes written so far.          |
| [`IsEmpty`](isempty) | Whether nothing has been written.        |
| [`Clear`](clear)     | Reset the length to zero, keep capacity. |

## Example

```rux
import Std::Io::*;
import Std::StringBuilder;

func Main() -> int {
    var sb = StringBuilder::New();
    sb.Append("Hello");
    sb.Append(c8',');
    sb.Append(" world");

    let greeting = sb.IntoString();
    PrintLine(greeting);            // Hello, world
    return 0;
}
```
