# `ParseFloat64`

Parses a floating-point value from decimal text.

**Package:** `Format`

## Signature

```rux
func ParseFloat64(
    str: Slice<char8>
) -> Result<float64, ParseError>;

func ParseFloat64(
    str: String
) -> Result<float64, ParseError>;
```

## Parameters

| Name  | Type                          | Description        |
| ----- | ----------------------------- | ------------------ |
| `str` | `Slice<char8>` / `String`     | The text to parse. |

## Returns

A [`Result`](/docs/error/result): `Success` holds the parsed `float64`, and
`Error` holds a [`ParseError`](parseerror) saying why the text was rejected.

The accepted grammar is a decimal number with an optional sign, an optional
fraction, and an optional exponent:

```
[+-]? ( digits [ . digits? ]? | . digits ) ( [eE] [+-]? digits )?
```

So `1`, `1.5`, `.5`, `1.`, `+3.14`, `1e10`, and `1.5E-3` all parse, and the
whole string has to fit the grammar — a trailing byte is rejected. Up to
nineteen significant digits are kept, which is more than a `float64` can hold,
so the result is correctly rounded from every digit that matters.

The three failures are:

- **`Empty`** — the input has no bytes.
- **`InvalidCharacter(index)`** — a byte outside the grammar, a sign with no
  number after it, an `e`/`E` with no exponent digits, or trailing text after a
  valid number; `index` is where it sits.
- **`Overflow`** — the magnitude is too large for a `float64` and would parse to
  an infinity. A magnitude too small to represent underflows to `0.0` instead,
  which is not an error.

## Example

```rux
import Format::ParseFloat64;
import Io::PrintLine;

func Main() -> int {
    match ParseFloat64("3.14159") {
        .Success(x) => PrintLine(x),               // 3.14159
        .Error(_) => PrintLine("not a number")
    }

    match ParseFloat64("1.5e-3") {
        .Success(x) => PrintLine(x),               // 0.0015
        .Error(_) => {}
    }
    return 0;
}
```

## See also

- [`Format`](/api/format/) — the package overview
- [`TryParseFloat64`](tryparsefloat64) — the same parse, into an out-parameter, without a `Result`
- [`ParseInt64`](parseint64) — parse a signed integer instead
- [`ParseError`](parseerror) — the reason a parse failed
- [`ToString`](tostring) — the inverse, a value to its text
