# Io Package

::: warning Unstable API
The package is under active development and its API is **not yet stable**. Names, signatures, and behavior may change between releases, and this documentation will be updated to match.
:::

The package provides standard input and output — a [`Print`](print) and a [`PrintLine`](printline) for every primitive type and for text, and a [`ReadLine`](readline) that reads a line back.

**Module:** `Io`

**Source:** [github.com/rux-lang/Io](https://github.com/rux-lang/Io)

Every function talks to the process's own standard streams: the standard handles on Windows and macOS, and the standard file descriptors on Linux and illumos. Nothing is buffered on the way — a `Print` is a write.

```rux
import Io::{ Print, PrintLine, ReadLine };

func Main() -> int {
    Print("What is your name? ");

    var name = ReadLine();
    PrintLine("Hello, {}!", name);

    name.Free();
    return 0;
}
```

## Installation

```sh
rux add Io
rux install
```

## Platform support

Implemented on illumos, Linux, macOS, and Windows. **BSD is not implemented yet** — the package has no BSD backend, so a program that prints or reads there does not build for that target.

## Values as text

A value is turned into text by [`Format`](/api/format/), which this package is built on, and it is the same text you would get from [`ToString`](/api/format/tostring): a `bool` prints as `true` or `false` rather than as `0` or `1`, a `char` prints as its UTF-8 bytes, and a float is rendered to the digits its type carries with the trailing zeros dropped, so `0.1` prints as `0.1`.

Both `Print` and `PrintLine` also take a format string, where each `{}` takes the next argument in order and <code v-pre>{{</code> and <code v-pre>}}</code> write a literal brace:

```rux
PrintLine("{} of {} done", 3, 10);  // 3 of 10 done
PrintLine("{{{}}}", "braced");      // {braced}
```

The arguments are [`Stringable`](/api/format/stringable), so a type of your own goes into a `{}` the moment it implements that interface. Any `String` a placeholder allocates on the way is freed for you.

## Widths and aliases

`bool` is an alias for `bool8`, `char` for `char32`, and `float` for `float64`, so a call on an alias reaches the overload for the sized type it names. `int` and `uint` are types of their own rather than names for `int64` and `uint64`, and have overloads of their own.

## Ownership

`Print` and `PrintLine` own nothing: a [`String`](/api/text/string/) passed to either is only read, and it is still yours to [`Free`](/api/text/string/free) afterwards.

[`ReadLine`](readline) is the other way around. The `String` it returns is a fresh allocation the caller owns and passes to [`String::Free`](/api/text/string/free) exactly once, on the terms [`Text`](/api/text/#ownership) sets out — including the line that came back empty.

## Functions

### Output

| Function                  | Description                                     |
| ------------------------- | ----------------------------------------------- |
| [`Print`](print)          | Write a value to standard output.               |
| [`PrintLine`](printline)  | The same, followed by a newline.                |

### Input

| Function                | Description                                                    |
| ----------------------- | -------------------------------------------------------------- |
| [`ReadLine`](readline)  | Read standard input through the next newline, as a `String`.   |

## See also

- [`Format`](/api/format/) — the conversions and the `{}` substitution behind every call here
- [`Text`](/api/text/) — the `String` these functions print and return
- [`Std::Io`](/api/std/io/print) — the console I/O that ships inside `Std`
