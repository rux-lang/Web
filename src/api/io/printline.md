# `PrintLine`

Writes a value to standard output, followed by a newline.

**Module:** `Io`

## Signature

`PrintLine` mirrors every [`Print`](print) overload and adds a form that takes nothing and writes only the newline:

```rux
// Newline only
func PrintLine();

// Text
func PrintLine(value: String);
func PrintLine(value: char8[]);

// Formatted
func PrintLine(format: char8[], args: Stringable...);

// Signed integers
func PrintLine(value: int8);
func PrintLine(value: int16);
func PrintLine(value: int32);
func PrintLine(value: int64);
func PrintLine(value: int);

// Unsigned integers
func PrintLine(value: uint8);
func PrintLine(value: uint16);
func PrintLine(value: uint32);
func PrintLine(value: uint64);
func PrintLine(value: uint);

// Floating-point
func PrintLine(value: float32);
func PrintLine(value: float64);

// Booleans
func PrintLine(value: bool8);
func PrintLine(value: bool16);
func PrintLine(value: bool32);

// Characters
func PrintLine(value: char8);
func PrintLine(value: char16);
func PrintLine(value: char32);
```

## Parameters

| Name     | Type            | Description                                        |
| -------- | --------------- | -------------------------------------------------- |
| `value`  | Any type above  | The value to write.                                |
| `format` | `char8[]`       | Format string; each `{}` takes the next argument.  |
| `args`   | `Stringable...` | The values substituted into `format`, in order.    |

`bool` is an alias for `bool8`, `char` for `char32`, and `float` for `float64`, so a call on an alias reaches the overload for the sized type it names.

## Remarks

Each overload is its [`Print`](print) counterpart followed by a newline, and everything that page says about the text of a value, about `{}` substitution, and about a `String` argument staying yours to [`Free`](/api/text/string/free) holds here unchanged.

The newline written is a single LF (`\n`), on every platform, including Windows. Nothing translates it to CRLF on the way out.

`PrintLine()` with no argument writes that newline by itself, which is how you leave a blank line.

## Example

```rux
import Io::PrintLine;

func Main() -> int {
    PrintLine("Report");
    PrintLine();                     // blank line
    PrintLine("{} items, {} failed", 12, 0);
    PrintLine(true);                 // true
    PrintLine(1.0 / 3.0);            // 0.333333333333333
    return 0;
}
```

## See also

- [`Io`](/api/io/) — the module overview
- [`Print`](print) — the same overloads, with no newline after the value
- [`ReadLine`](readline) — read a line back from standard input
- [`Format::ToString`](/api/format/tostring) — the text every non-text overload prints
