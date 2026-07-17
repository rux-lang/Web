# `Append`

Appends a value to the builder.

**Module:** `Std`

## Signature

```rux
func Append(self, c: char8);
func Append(self, str: char8[]);
func Append(self, str: String);
```

## Parameters

| Name  | Type                               | Description                            |
| ----- | ---------------------------------- | -------------------------------------- |
| `c`   | `char8`                            | A single byte to append.               |
| `str` | `char8[]` / [`String`](../string/) | A literal, slice, or string to append. |

## Description

Appends the argument to the end of the builder, growing the buffer if needed.
The overloads let you mix single characters, string literals, slices, and
[`String`](../string/) values without converting between them. Appending an empty
slice or string is a no-op.

## Example

```rux
import Rux::StringBuilder;
import Rux::String;

var sb = StringBuilder::New();
sb.Append("count: ");        // char8[]
sb.Append(c8'#');            // char8
sb.Append(String::From("42"));// String
// "count: #42"
```

## See also

- [`StringBuilder`](/api/std/stringbuilder/) — the type
- [`Reserve`](reserve) — pre-grow before many appends
- [`IntoString`](intostring) — finish and take the result
