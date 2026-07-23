# `TryParseFloat64`

Parses a floating-point value into an out-parameter, reporting only success or failure.

**Package:** `Format`

## Signature

```rux
func TryParseFloat64(
    str: Slice<char8>,
    value: *var float64
) -> bool;

func TryParseFloat64(
    str: String,
    value: *var float64
) -> bool;
```

## Parameters

| Name    | Type                          | Description                          |
| ------- | ----------------------------- | ------------------------------------ |
| `str`   | `Slice<char8>` / `String`     | The text to parse.                   |
| `value` | `*var float64`                | Where the parsed value is written.   |

## Returns

`true` when `str` parsed, with the value written through `value`; `false`
otherwise, leaving `value` untouched. A `null` `value` pointer also returns
`false`.

This is the same parse as [`ParseFloat64`](parsefloat64) — the same grammar and
the same rounding — with the outcome flattened to a `bool` for a caller that
only wants the value and a yes-or-no, and does not need to know which
[`ParseError`](parseerror) a failure was.

## Example

```rux
import Format::TryParseFloat64;
import Io::PrintLine;

func Main() -> int {
    var x: float64 = 0.0;
    if TryParseFloat64("2.5", @x) {
        PrintLine(x);           // 2.5
    }
    return 0;
}
```

## See also

- [`Format`](/api/format/) — the package overview
- [`ParseFloat64`](parsefloat64) — the same parse, returning a `Result` with the reason for a failure
- [`TryParseInt64`](tryparseint64) — the integer counterpart
