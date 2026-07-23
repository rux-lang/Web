# `ParseError`

Why a string could not be parsed into a value.

**Package:** `Format`

## Definition

```rux
enum ParseError {
    Empty,
    InvalidCharacter(uint),
    Overflow
}
```

The error half of the [`Result`](/docs/error/result) that
[`ParseInt64`](parseint64) and [`ParseFloat64`](parsefloat64) return. The
[`TryParse`](tryparseint64) functions collapse it to a `bool`, so it only
surfaces from the `Parse` functions.

## Variants

| Variant                   | Meaning                                                        |
| ------------------------- | ------------------------------------------------------------- |
| `Empty`                   | The input had no bytes.                                        |
| `InvalidCharacter(uint)`  | A byte that does not fit the grammar; the payload is its index. |
| `Overflow`                | The value is outside the range the target type can hold.       |

The index carried by `InvalidCharacter` points at the offending byte — the
first non-digit, a lone sign, or an exponent marker with no digits after it —
which is enough to report where the input went wrong.

## Example

```rux
import Format::{ ParseInt64, ParseError };
import Io::PrintLine;

func Main() -> int {
    match ParseInt64("12x4") {
        .Success(n) => PrintLine(n),
        .Error(e) => match e {
            .Empty => PrintLine("empty"),
            .InvalidCharacter(i) => PrintLine(i),   // 2 -- the 'x'
            .Overflow => PrintLine("overflow")
        }
    }
    return 0;
}
```

## See also

- [`Format`](/api/format/) — the package overview
- [`ParseInt64`](parseint64) / [`ParseFloat64`](parsefloat64) — the functions that return it
- [`Result`](/docs/error/result) — the success-or-error type it is the error half of
