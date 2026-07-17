# `PrintLine`

Writes a value to standard output, followed by a newline.

**Module:** `Std::Io`

## Signature

`PrintLine` mirrors every [`Print`](print) overload and adds a no-argument form
that writes just a newline:

```rux
// Newline only
func PrintLine();

// Strings
func PrintLine(string: char8[]);
func PrintLine(string: char16[]);
func PrintLine(string: String);

// Raw buffer
func PrintLine(string: *const char8, length: uint);
func PrintLine(string: *const char16, length: uint);

// Formatted (see Std::Format)
func PrintLine(format: char8[], args: Display...);

// Scalars — one overload per built-in type
func PrintLine(value: int);
func PrintLine(value: int8);
func PrintLine(value: int16);
func PrintLine(value: int32);
func PrintLine(value: int64);
func PrintLine(value: uint);
func PrintLine(value: uint8);
func PrintLine(value: uint16);
func PrintLine(value: uint32);
func PrintLine(value: uint64);
func PrintLine(value: float);
func PrintLine(value: float32);
func PrintLine(value: float64);
func PrintLine(value: bool);
func PrintLine(value: bool8);
func PrintLine(value: bool16);
func PrintLine(value: bool32);
func PrintLine(value: char);
func PrintLine(value: char8);
func PrintLine(value: char16);
func PrintLine(value: char32);
```

## Parameters

| Name     | Type         | Description                                                         |
| -------- | ------------ | ------------------------------------------------------------------- |
| `string` | various      | The text to write. UTF-8 (`char8`) or UTF-16 (`char16`).            |
| `length` | `uint`       | Number of code units to write from a raw pointer.                   |
| `format` | `char8[]`    | Format string; each `{}` placeholder is replaced by an argument.    |
| `args`   | `Display...` | Values substituted into `format`, in order.                         |
| `value`  | scalar       | A numeric, boolean, or character value rendered via its `ToString`. |

## Description

`PrintLine` behaves exactly like [`Print`](print) but appends a newline (`\n`)
after the value. Called with no arguments, it writes a single newline, which is
handy for inserting a blank line.

## Example

```rux
import Io::*;

func Main() -> int {
    PrintLine("Hello, World!");
    PrintLine(42);
    PrintLine();                 // blank line
    PrintLine("x = {}, y = {}", 3, 4);
    return 0;
}
```

## See also

- [`Print`](print) — write without a trailing newline
