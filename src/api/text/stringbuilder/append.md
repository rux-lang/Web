# `Append`

Writes bytes to the end of the builder.

**Module:** `Text`

## Signature

```rux
func Append(self, ch: char8);
func Append(self, str: char8[]);
func Append(self, str: String);
```

## Parameters

| Name         | Type                            | Description             |
| ------------ | ------------------------------- | ----------------------- |
| `ch` / `str` | `char8` / `char8[]` / `String`  | The bytes to write.     |

## Remarks

Writes the bytes at the end of what is already there, growing the block if they do not fit — the growth doubles the capacity, so a run of appends costs an amortized constant rather than a reallocation each time. Appending nothing (an empty slice or an empty string) does nothing at all.

The bytes are **copied**, so an appended [`String`](../string/) is left untouched and is still the caller's to free.

The slice overload lets a literal be appended without wrapping it in a `String` first, and the `char8` overload writes a single byte.

Growing may move the block, so a pointer taken from [`Data`](data) before an append must not be used after one.

## Example

```rux
import Text::{ String, StringBuilder };

var name = String::From("Rux");
var builder = StringBuilder::New();

builder.Append("Hello, "); // a literal
builder.Append(name);      // a String, copied
builder.Append(c8'!');     // a single byte

var greeting = builder.IntoString(); // "Hello, Rux!"

greeting.Free();
name.Free();                         // the append did not take it
```

## See also

- [`StringBuilder`](/api/text/stringbuilder/) — the builder type
- [`Reserve`](reserve) — make room before a run of appends
- [`IntoString`](intostring) — take the result once the appends are done
- [`String::+`](../string/plus) — join two strings, at the cost of an allocation each time
