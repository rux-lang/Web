# `ToString`

Returns the text of a value, in a `String` the caller owns.

**Package:** `Format`

## Signature

```rux
func ToString(value: int8) -> String;
func ToString(value: int16) -> String;
func ToString(value: int32) -> String;
func ToString(value: int64) -> String;
func ToString(value: int) -> String;

func ToString(value: uint8) -> String;
func ToString(value: uint16) -> String;
func ToString(value: uint32) -> String;
func ToString(value: uint64) -> String;
func ToString(value: uint) -> String;

func ToString(value: float32) -> String;
func ToString(value: float64) -> String;

func ToString(value: bool8) -> String;
func ToString(value: bool16) -> String;
func ToString(value: bool32) -> String;

func ToString(value: char8) -> String;
func ToString(value: char16) -> String;
func ToString(value: char32) -> String;
```

Each type is also extended with [`Stringable`](stringable), so the same conversion is reachable as a method: `42.ToString()` and `ToString(42)` are the same call.

## Parameters

| Name    | Type        | Description             |
| ------- | ----------- | ----------------------- |
| `value` | Any primitive above | The value to convert. |

`bool` is an alias for `bool8`, `char` for `char32`, and `float` for `float64`, so a call on an alias reaches the overload for the sized type it names. `int` and `uint` are types of their own rather than names for `int64` and `uint64`, and have overloads of their own.

## Returns

A `String` holding the text of the value, in a block the caller owns and passes to [`String::Free`](/api/text/string/free) exactly once.

**Integers** come out as decimal digits, with a minus sign on a negative value and no plus sign on a positive one. The most negative value of a type has no positive counterpart, and converts correctly anyway: `-9223372036854775808` prints in full.

**Floats** are rendered to the digits the type actually carries — fifteen for a `float64`, seven for a `float32` — with the trailing zeros dropped, and a fractional part always written, so `1.0` prints as `1.0` rather than `1`. Notation is fixed while the decimal exponent stays in `[-4, digits)` and scientific outside it, which is the printf `%g` rule. A NaN is `NaN`, the infinities are `Inf` and `-Inf`, and a negative zero keeps its sign as `-0.0`.

The digit cutoff is what keeps the noise of the binary representation out of the text: `0.1` is really `0.1000000000000000055`, and printing every digit would say so. The cost is that the text is **not a round trip** — two values that differ only past the last digit print the same.

**Bools** print as `true` or `false`, never as `0` or `1`. The wider bools say the same two words: what a `bool32` has over a `bool8` is room, not vocabulary.

**Characters** come out as UTF-8. A `char32` is one code point and becomes one to four bytes; a `char16` is one UTF-16 code unit and becomes one to three. A value that is not a code point at all — one past U+10FFFF, or a lone half of a surrogate pair, which only means something inside UTF-16 — comes out as the replacement character U+FFFD rather than as an ill-formed sequence.

A `char8` is the exception: it is **one byte of UTF-8, not one character**, and it is passed through as it stands. Nothing is encoded and nothing is validated, so a byte taken out of the middle of a multi-byte sequence yields a one-byte `String` holding a fragment rather than a letter.

## Example

```rux
import Format::ToString;

func Main() -> int {
    var a = ToString(-42);       // "-42"
    var b = ToString(3.5);       // "3.5"
    var c = ToString(1.0e20);    // "1.0e+20"
    var d = ToString(false);     // "false"
    var e = ToString(c32'€');    // "€", three bytes
    var f = 7.ToString();        // "7", through Stringable

    f.Free();
    e.Free();
    d.Free();
    c.Free();
    b.Free();
    a.Free();
    return 0;
}
```

## See also

- [`Format`](/api/format/) — the package overview
- [`Stringable`](stringable) — put a `ToString` on a type of your own
- [`WriteInt`](writeint) / [`WriteFloat`](writefloat) — the same text, appended to a builder, with no `String` allocated
- [`IsNan`](isnan) — ask about a value rather than reading `NaN` back out of its text
