# `WriteBool`

Appends `true` or `false` to a builder.

**Module:** `Format`

## Signature

```rux
func WriteBool(builder: *StringBuilder, value: bool8);
```

## Parameters

| Name      | Type             | Description               |
| --------- | ---------------- | ------------------------- |
| `builder` | `*StringBuilder` | The builder to append to. |
| `value`   | `bool8`          | The value to write.       |

`bool` is an alias for `bool8`, so an ordinary `bool` reaches this directly. A `bool16` or a `bool32` has to be narrowed to `bool8` on the way in — the wider bools say the same two words, and there is only this one function to say them.

## Remarks

Writes the word `true` or the word `false`, never `1` or `0`. Nothing else is appended around it, and nothing is allocated beyond whatever growth the builder needs.

## Example

```rux
import Format::WriteBool;
import Text::StringBuilder;

var builder = StringBuilder::New();
builder.Append("cached: ");
WriteBool(&builder, true);

var line = builder.IntoString(); // "cached: true"

line.Free();
```

## See also

- [`Format`](/api/format/) — the module overview
- [`ToString`](tostring) — the word in a `String` of its own
- [`Text::StringBuilder`](/api/text/stringbuilder/) — the builder being appended to
