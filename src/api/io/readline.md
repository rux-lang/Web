# `ReadLine`

Reads standard input through the next newline, and returns it as a `String`.

**Module:** `Io`

## Signature

```rux
func ReadLine() -> String;
```

## Returns

A `String` holding the bytes read, without the line ending, in a block the caller owns and passes to [`String::Free`](/api/text/string/free) exactly once — an empty line included, since an empty `String` is still a value to free.

The line ending is removed: the LF that terminated the line, and a CR immediately before it, so a CRLF-terminated line comes back the same as an LF-terminated one. A CR anywhere else is data and is kept, which is what makes a lone `\r` in the middle of a line survive the round trip.

There is no length limit — the line is accumulated in a [`StringBuilder`](/api/text/stringbuilder/) that grows as it goes.

An empty `String` comes back from two different things: an empty line, and standard input that was already at EOF. The call does not distinguish them. If EOF arrives partway through a line, whatever had been read is returned as if the line had ended there.

The bytes are returned as they were read. Nothing is validated as UTF-8, so input that is not UTF-8 comes back intact rather than being replaced or rejected.

## Remarks

Input is read a byte at a time, straight from the stream, with nothing buffered between calls. The read is blocking: the call does not return until a newline arrives or the stream ends.

## Example

```rux
import Io::{ Print, PrintLine, ReadLine };

func Main() -> int {
    Print("Name: ");

    var name = ReadLine();
    if name.IsEmpty() {
        PrintLine("Nothing to greet.");
    } else {
        PrintLine("Hello, {}!", name);
    }

    name.Free();
    return 0;
}
```

Read until the input runs out, one line per iteration:

```rux
import Io::{ PrintLine, ReadLine };

func Main() -> int {
    var count = 0;
    while true {
        var line = ReadLine();
        let empty = line.IsEmpty();
        line.Free();

        if empty { break; } // an empty line, or EOF
        count += 1;
    }

    PrintLine("{} lines", count);
    return 0;
}
```

## See also

- [`Io`](/api/io/) — the module overview
- [`Print`](print) — write a prompt before reading
- [`Text::String`](/api/text/string/) — the type returned, and how to free it
- [`Text::StringBuilder`](/api/text/stringbuilder/) — what the line is accumulated in
