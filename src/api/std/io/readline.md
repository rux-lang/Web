# `ReadLine`

Reads a line of text from standard input.

**Module:** `Std::Io`

## Signature

```rux
func ReadLine() -> String;
```

## Returns

`String` — the line read from standard input, with the trailing newline removed.
Returns an empty string on end-of-input, on error, or for a blank line.

## Description

`ReadLine` reads from standard input up to a newline and returns the content as a
freshly allocated [`String`](../string/). The trailing `\n` (and a preceding
`\r`, if present) is stripped, so the result holds just the line's text.

::: warning
Input is read into a fixed 4096-byte buffer, so a single line is capped at 4096
bytes; anything beyond that is not returned by the call. An empty return value is
ambiguous — it can mean a blank line, end-of-input, or a read error.
:::

## Example

```rux
import Std::Io::*;

func Main() -> int {
    Print("What is your name? ");
    let name = ReadLine();
    PrintLine(Format("Hello, {}!", name));
    return 0;
}
```

## See also

- [`Print`](print) / [`PrintLine`](printline) — write to standard output
- [`String`](../string/) — the returned text type
