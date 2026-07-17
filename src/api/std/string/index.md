# `String`

A heap-allocated UTF-8 string.

**Module:** `Std`

## Struct

```rux
struct String {
    data:   *char8;
    length: uint;
}
```

A `String` owns a buffer of `length` bytes pointed to by `data`. The fields are
implementation detail — use [`Data`](data) and [`Length`](length) to read them.
Most methods that transform a string allocate a **new** buffer and return a new
`String`, leaving the original untouched; the `*InPlace` variants mutate the
receiver instead.

## Methods

### Construction

| Method           | Description                                                  |
| ---------------- | ------------------------------------------------------------ |
| [`New`](new)     | Creates an empty string.                                     |
| [`From`](from)   | Creates a string by copying a literal, slice, or raw buffer. |
| [`Clone`](clone) | Returns an independent copy.                                 |

### Operators

| Method      | Description               |
| ----------- | ------------------------- |
| [`+`](plus) | Concatenates two strings. |

### Accessors

| Method               | Description                            |
| -------------------- | -------------------------------------- |
| [`Data`](data)       | Pointer to the underlying byte buffer. |
| [`Length`](length)   | Length in bytes.                       |
| [`IsEmpty`](isempty) | Whether the string has zero length.    |

### Transformations

Each returns a **new** `String`, leaving the receiver unchanged.

| Method                     | Description                                         |
| -------------------------- | --------------------------------------------------- |
| [`ToUpper`](toupper)       | Copy with ASCII letters uppercased.                 |
| [`ToLower`](tolower)       | Copy with ASCII letters lowercased.                 |
| [`Capitalize`](capitalize) | Copy with the first character uppercased.           |
| [`TitleCase`](titlecase)   | Copy with the first letter of each word uppercased. |
| [`Trim`](trim)             | Copy with surrounding whitespace removed.           |
| [`Repeat`](repeat)         | Copy of the string repeated N times.                |

### In-place transformations

These mutate the receiver's existing buffer instead of allocating a new one.

| Method                                   | Description                       |
| ---------------------------------------- | --------------------------------- |
| [`ToUpperInPlace`](toupperinplace)       | Uppercase ASCII letters in place. |
| [`ToLowerInPlace`](tolowerinplace)       | Lowercase ASCII letters in place. |
| [`CapitalizeInPlace`](capitalizeinplace) | Capitalize in place.              |
| [`TitleCaseInPlace`](titlecaseinplace)   | Title-case in place.              |
| [`TrimInPlace`](triminplace)             | Trim whitespace in place.         |

### Queries

| Method                     | Description                              |
| -------------------------- | ---------------------------------------- |
| [`StartsWith`](startswith) | Whether the string begins with a prefix. |
| [`EndsWith`](endswith)     | Whether the string ends with a suffix.   |
| [`Split`](split)           | Split into segments on a delimiter.      |

### Display

| Method                 | Description                            |
| ---------------------- | -------------------------------------- |
| [`ToString`](tostring) | Returns the string itself (`Display`). |

`String` implements the `Display` interface, so it can be passed to `Print`,
`PrintLine`, and `Format`.

## `StringArray`

The value returned by [`Split`](split).

```rux
struct StringArray {
    data:   *String;
    length: uint;
}
```

A contiguous array of `length` `String` values. Index it like a slice to read
each segment.

## Example

```rux
import Io::*;
import Text::String;

func Main() -> int {
    let title = String::From("  the rux language  ").Trim().TitleCase();
    PrintLine(title);                       // "The Rux Language"

    let parts = String::From("a,b,c").Split(c8',');
    for i in 0..parts.length {
        PrintLine(parts.data[i]);           // a / b / c
    }
    return 0;
}
```
