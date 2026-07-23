# Format Package

::: warning Unstable API
The package is under active development and its API is **not yet stable**. Names, signatures, and behavior may change between releases, and this documentation will be updated to match.
:::

The package converts between values and text — a [`ToString`](tostring) for every primitive type, a [`Stringable`](stringable) interface for the types you write yourself, a family of [`Write`](writeint) functions that append into a builder instead of allocating, and a set of [`Parse`](parseint64) functions that read a value back out of text.

**Package:** `Format`

**Source:** [github.com/rux-lang/Rux/tree/main/Packages/Format](https://github.com/rux-lang/Rux/tree/main/Packages/Format)

A conversion to text produces a [`Text::String`](/api/text/string/), which is what this package is built on. The [`Parse`](parseint64) functions go the other way, reading a value out of a `Slice<char8>` or a `String` and allocating nothing.

```rux
import Format::ToString;
import Io::PrintLine;

func Main() -> int {
    var count = ToString(42);    // "42"
    var ratio = ToString(0.1);   // "0.1"
    var flag = ToString(true);   // "true"

    PrintLine(count);
    ratio.Free();
    count.Free();
    flag.Free();
    return 0;
}
```

## Installation

```sh
rux add Format
rux install
```

## Platform support

The package is pure computation over strings, so it runs wherever [`Text`](/api/text/) does: FreeBSD, Linux, macOS, and Windows.

## Ownership

Every `ToString` returns a `String` the caller owns and passes to [`String::Free`](/api/text/string/free) exactly once, on the terms [`Text`](/api/text/#ownership) sets out. That is one allocation per conversion, so converting several values only to join them allocates a `String` that is thrown away again for each one.

The `Write` functions are the way around that. They allocate nothing of their own — they append into a [`StringBuilder`](/api/text/stringbuilder/) the caller supplies, and the caller frees the builder, or takes its contents with [`IntoString`](/api/text/stringbuilder/intostring):

```rux
import Format::{ WriteInt, WriteFloat };
import Text::StringBuilder;

var builder = StringBuilder::New();
builder.Append("point ");
WriteInt(@builder, 3);       // no String allocated
builder.Append(", ");
WriteFloat(@builder, 4.5);
var line = builder.IntoString(); // "point 3, 4.5"

line.Free();
```

## Widths and aliases

`bool` is an alias for `bool8`, `char` for `char32`, and `float` for `float64`, so a call on an alias reaches the overload for the sized type it names.

The `Write` functions take the widest type of their family — an `int64` for the signed integers, a `uint64` for the unsigned ones — and a narrower value widens on the way in, which loses nothing. That is why there is one [`WriteInt`](writeint) rather than one per width, while [`ToString`](tostring) has an overload for each.

## Floating-point text

A float is rendered to the digits its type actually carries — fifteen for a `float64`, seven for a `float32` — with the trailing zeros dropped, so `0.1` prints as `0.1` rather than as the `0.1000000000000000055` it really is. The cost is that the text is **not a round trip**: two values that differ only past the last digit print the same.

Notation follows the printf `%g` rule. Fixed while the decimal exponent stays in `[-4, digits)`, scientific outside it, where fixed notation would spend its width on zeros. A NaN prints as `NaN`, the infinities as `Inf` and `-Inf`, and a negative zero keeps its sign.

## Interfaces

| Interface                    | Description                                        |
| ---------------------------- | -------------------------------------------------- |
| [`Stringable`](stringable)   | What a type implements to convert itself to a `String`. |

## Errors

| Type                       | Description                                                     |
| -------------------------- | -------------------------------------------------------------- |
| [`ParseError`](parseerror) | Why a parse failed: empty input, an invalid byte, or overflow. |

## Functions

### Conversion

| Function                | Description                                              |
| ----------------------- | -------------------------------------------------------- |
| [`ToString`](tostring)  | The text of a value, in a `String` the caller owns.      |

### Appending

Each appends into a [`StringBuilder`](/api/text/stringbuilder/) and allocates no `String` of its own.

| Function                    | Description                                     |
| --------------------------- | ----------------------------------------------- |
| [`WriteInt`](writeint)      | The decimal digits of a signed integer.         |
| [`WriteUint`](writeuint)    | The decimal digits of an unsigned integer.      |
| [`WriteFloat`](writefloat)  | The decimal text of a floating-point value.     |
| [`WriteBool`](writebool)    | `true` or `false`.                              |
| [`WriteChar`](writechar)    | The UTF-8 bytes of a character.                 |

### Classification

| Function                    | Description                                          |
| --------------------------- | ---------------------------------------------------- |
| [`IsNan`](isnan)            | Whether a value is a NaN.                            |
| [`IsInfinite`](isinfinite)  | Whether a value is one of the two infinities.        |
| [`IsFinite`](isfinite)      | Whether a value is an ordinary number.               |

### Parsing

Each reads a value out of a `Slice<char8>` or a `String`, allocating nothing. The `Parse` forms return a [`Result`](/docs/error/result); the `TryParse` forms write through a pointer and return whether it worked.

| Function                             | Description                                          |
| ------------------------------------ | ---------------------------------------------------- |
| [`ParseInt64`](parseint64)           | Parse a signed integer, as a `Result`.               |
| [`ParseFloat64`](parsefloat64)       | Parse a floating-point value, as a `Result`.         |
| [`TryParseInt64`](tryparseint64)     | Parse a signed integer into an out-parameter.        |
| [`TryParseFloat64`](tryparsefloat64) | Parse a floating-point value into an out-parameter.  |

## See also

- [`Text`](/api/text/) — the `String` and `StringBuilder` every conversion here produces
