# `WriteChar`

Appends the UTF-8 bytes of a character to a builder.

**Module:** `Format`

## Signature

```rux
func WriteChar(builder: *StringBuilder, value: char32);
func WriteChar(builder: *StringBuilder, value: char16);
```

## Parameters

| Name      | Type                | Description               |
| --------- | ------------------- | ------------------------- |
| `builder` | `*StringBuilder`    | The builder to append to. |
| `value`   | `char32` / `char16` | The character to write.   |

`char` is an alias for `char32`, so an ordinary `char` reaches that overload.

There is no `char8` overload, and none is needed: a `char8` is already one byte of UTF-8, so [`StringBuilder::Append`](/api/text/stringbuilder/append) takes it as it stands, with nothing to encode.

## Remarks

Encodes the character as UTF-8 and appends the bytes. A `char32` holds one code point and becomes one to four bytes; a `char16` holds one UTF-16 code unit and becomes one to three. A `String` holds bytes and its contents are UTF-8, which is why a character has to be encoded on the way in rather than copied.

A value that is not a code point comes out as the **replacement character** U+FFFD (three bytes, `EF BF BD`) rather than as an ill-formed sequence. Two things fail that test: a value past U+10FFFF, which is beyond the last code point there is, and a lone half of a surrogate pair, which only means something inside UTF-16 — the character it belongs to is spread across two code units, and this conversion sees one. The compiler rejects a surrogate as a constant, so one can only arrive through a cast at run time.

## Example

```rux
import Format::WriteChar;
import Text::StringBuilder;

var builder = StringBuilder::New();
WriteChar(&builder, c32'R');  // one byte
WriteChar(&builder, c32'é');  // two
WriteChar(&builder, c32'€');  // three
builder.Append(c8'!');        // a char8 needs no encoding

var text = builder.IntoString(); // "Ré€!"
text.Length();                   // 7 bytes, 4 characters

text.Free();
```

## See also

- [`Format`](/api/format/) — the module overview
- [`ToString`](tostring) — the character in a `String` of its own, and what a `char8` does instead
- [`Text::StringBuilder::Append`](/api/text/stringbuilder/append) — append bytes that are already UTF-8
- [`Text::String::Length`](/api/text/string/length) — bytes, not characters
