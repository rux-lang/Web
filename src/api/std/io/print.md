# `Print`

Writes a value to standard output, without a trailing newline.

**Module:** `Std::Io`

## Signature

`Print` is overloaded for strings, raw buffers, format strings, and every
built-in scalar type:

```rux
// Strings
func Print(string: char8[]);
func Print(string: char16[]);
func Print(string: String);

// Raw buffer
func Print(string: *const char8, length: uint);
func Print(string: *const char16, length: uint);

// Formatted (see Std::Format)
func Print(format: char8[], args: Display...);

// Scalars — one overload per built-in type
func Print(value: int);
func Print(value: int8);
func Print(value: int16);
func Print(value: int32);
func Print(value: int64);
func Print(value: uint);
func Print(value: uint8);
func Print(value: uint16);
func Print(value: uint32);
func Print(value: uint64);
func Print(value: float);
func Print(value: float32);
func Print(value: float64);
func Print(value: bool);
func Print(value: bool8);
func Print(value: bool16);
func Print(value: bool32);
func Print(value: char);
func Print(value: char8);
func Print(value: char16);
func Print(value: char32);
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

`Print` writes its argument to standard output as-is, with no trailing newline.
The scalar overloads format the value through its `Display` implementation, so
`Print(42)` and `Print(true)` work directly. The format-string overload uses
`Format` — use `{}` as the placeholder.

To write a line and move to the next one, use [`PrintLine`](printline).

## Example

```rux
import Std::Io::*;

func Main() -> int {
    Print("Hello, ");
    Print("World!\n");

    Print("x = {}, y = {}\n", 3, 4);

    Print(42);
    Print('\n');
    return 0;
}
```

## See also

- [`PrintLine`](printline) — like `Print`, but appends a newline
