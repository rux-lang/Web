# `TryParseInt64`

Parses a signed integer into an out-parameter, reporting only success or failure.

**Package:** `Format`

## Signature

```rux
func TryParseInt64(
    str: Slice<char8>,
    value: *var int64
) -> bool;

func TryParseInt64(
    str: String,
    value: *var int64
) -> bool;
```

## Parameters

| Name    | Type                          | Description                          |
| ------- | ----------------------------- | ------------------------------------ |
| `str`   | `Slice<char8>` / `String`     | The text to parse.                   |
| `value` | `*var int64`                  | Where the parsed value is written.   |

## Returns

`true` when `str` parsed, with the value written through `value`; `false`
otherwise, leaving `value` untouched. A `null` `value` pointer also returns
`false`.

This is the same parse as [`ParseInt64`](parseint64) — the same accepted form
and the same limits — with the outcome flattened to a `bool` for a caller that
only wants the value and a yes-or-no, and does not need to know which
[`ParseError`](parseerror) a failure was.

## Example

```rux
import Format::TryParseInt64;
import Io::PrintLine;

func Main() -> int {
    var n: int64 = 0;
    if TryParseInt64("100", @n) {
        PrintLine(n);           // 100
    }

    if !TryParseInt64("12x", @n) {
        PrintLine(n);           // still 100 -- left unchanged on failure
    }
    return 0;
}
```

## See also

- [`Format`](/api/format/) — the package overview
- [`ParseInt64`](parseint64) — the same parse, returning a `Result` with the reason for a failure
- [`TryParseFloat64`](tryparsefloat64) — the floating-point counterpart
