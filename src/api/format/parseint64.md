# `ParseInt64`

Parses a signed integer from decimal text.

**Package:** `Format`

## Signature

```rux
func ParseInt64(
    str: Slice<char8>
) -> Result<int64, ParseError>;

func ParseInt64(
    str: String
) -> Result<int64, ParseError>;
```

## Parameters

| Name  | Type                          | Description             |
| ----- | ----------------------------- | ----------------------- |
| `str` | `Slice<char8>` / `String`     | The text to parse.      |

## Returns

A [`Result`](/docs/error/result): `Success` holds the parsed `int64`, and
`Error` holds a [`ParseError`](parseerror) saying why the text was rejected.

The accepted form is an optional `+` or `-` followed by one or more decimal
digits, and nothing else — the whole string has to be a number. There is no
whitespace to trim, no other base, and no digit separators. The three failures
are:

- **`Empty`** — the input has no bytes.
- **`InvalidCharacter(index)`** — a byte that is not a digit, or a sign with no
  digits after it; `index` is where it sits.
- **`Overflow`** — the value is outside the `int64` range. The negative limit is
  one larger than the positive one, so the most negative `int64`,
  `-9223372036854775808`, parses rather than overflowing.

## Example

```rux
import Format::ParseInt64;
import Io::PrintLine;

func Main() -> int {
    match ParseInt64("42") {
        .Success(n) => PrintLine(n),                // 42
        .Error(_) => PrintLine("not an integer")
    }

    match ParseInt64("-9223372036854775808") {
        .Success(n) => PrintLine(n),                // int64::Min, parsed exactly
        .Error(_) => {}
    }

    match ParseInt64("12x") {
        .Success(_) => {},
        .Error(e) => {}                             // InvalidCharacter(2)
    }
    return 0;
}
```

## See also

- [`Format`](/api/format/) — the package overview
- [`TryParseInt64`](tryparseint64) — the same parse, into an out-parameter, without a `Result`
- [`ParseFloat64`](parsefloat64) — parse a floating-point value instead
- [`ParseError`](parseerror) — the reason a parse failed
- [`ToString`](tostring) — the inverse, a value to its text
