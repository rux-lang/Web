# `Print`

Writes a value to standard output.

**Package:** `Io`

## Signature

```rux
// Text
func Print(value: String);
func Print(value: Slice<char8>);

// Formatted
func Print(format: Slice<char8>, args: Stringable...);

// Signed integers
func Print(value: int8);
func Print(value: int16);
func Print(value: int32);
func Print(value: int64);
func Print(value: int);

// Unsigned integers
func Print(value: uint8);
func Print(value: uint16);
func Print(value: uint32);
func Print(value: uint64);
func Print(value: uint);

// Floating-point
func Print(value: float32);
func Print(value: float64);

// Booleans
func Print(value: bool8);
func Print(value: bool16);
func Print(value: bool32);

// Characters
func Print(value: char8);
func Print(value: char16);
func Print(value: char32);
```

## Parameters

| Name     | Type            | Description                                                       |
| -------- | --------------- | ----------------------------------------------------------------- |
| `value`  | Any type above  | The value to write.                                               |
| `format` | `Slice<char8>`       | Format string; each `{}` takes the next argument.                 |
| `args`   | `Stringable...` | The values substituted into `format`, in order.                   |

`bool` is an alias for `bool8`, `char` for `char32`, and `float` for `float64`, so a call on an alias reaches the overload for the sized type it names.

## Remarks

Nothing is appended — the next `Print` continues on the same line. Use [`PrintLine`](printline) to end one.

A value that is not already text is rendered by [`Format::ToString`](/api/format/tostring), so it prints exactly as that function describes: a bool as `true` or `false`, a character as its UTF-8 bytes, a float to the digits its type carries with the trailing zeros dropped and `NaN`, `Inf`, and `-Inf` for the values that have no digits. The `String` this costs is allocated and freed inside the call.

The format overload substitutes each `{}` with the next argument, and writes a literal brace for <code v-pre>{{</code> and <code v-pre>}}</code>. The substitution is [`Format`](/api/format/)'s, and the arguments are [`Stringable`](/api/format/stringable), so a type of your own can go into a `{}` as soon as it implements that interface.

A `String` argument is only read. It stays yours, and you still [`Free`](/api/text/string/free) it.

Output is unbuffered and goes straight to the stream, and a write that the platform cuts short is retried until the whole value is out. Nothing is reported back: if the stream is closed or fails outright, the call gives up quietly rather than returning an error.

## Example

```rux
import Io::Print;
import Text::String;

func Main() -> int {
    Print("Loading");
    Print(c8'.');
    Print(3);            // Loading.3

    var name = String::From("Rux");
    Print(" {} {}\n", name, 1.5); // " Rux 1.5"

    name.Free();
    return 0;
}
```

## See also

- [`Io`](/api/io/) — the package overview
- [`PrintLine`](printline) — the same overloads, with a newline after the value
- [`ReadLine`](readline) — read a line back from standard input
- [`Format::ToString`](/api/format/tostring) — the text every non-text overload prints
