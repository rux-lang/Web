# `Format`

Builds a `String` from a format string and a list of values.

**Module:** `Std`

## Signature

```rux
func Format(fmt: char8[], args: Display...) -> String;
```

## Parameters

| Name   | Type         | Description                                                |
| ------ | ------------ | ---------------------------------------------------------- |
| `fmt`  | `char8[]`    | The format string. Each `{}` is replaced by an argument.  |
| `args` | `Display...` | Values to substitute, in order. Any [`Display`](display) type. |

## Returns

`String` — a new string with each `{}` placeholder in `fmt` replaced by the
corresponding argument's `ToString()` value.

## Description

`Format` walks the format string and replaces each `{}` placeholder, in order,
with the next argument rendered through its [`Display`](display) implementation.
Text outside placeholders is copied verbatim. Arguments beyond the number of
placeholders are ignored; placeholders beyond the number of arguments are left
empty.

::: warning
`Format` writes into a fixed 1024-byte buffer, so output longer than 1024 bytes
is truncated. For building large strings incrementally, use
[`StringBuilder`](stringbuilder/).
:::

## Example

```rux
import Rux::Format;
import Io::PrintLine;

func Main() -> int {
    let x = 3;
    let y = 4;
    let s = Format("point = ({}, {})", x, y);
    PrintLine(s);                 // point = (3, 4)
    return 0;
}
```

## See also

- [`Display`](display) — the interface that makes a type formattable
- [`Print`](io/print) — format and write to standard output in one call
- [`StringBuilder`](stringbuilder/) — assemble large strings without the size limit
