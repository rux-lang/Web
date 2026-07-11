# Text Package

::: warning Unstable API
The package is under active development and its API is **not yet stable**. Names, signatures, and behavior may change between releases, and this documentation will be updated to match.
:::

The package provides strings and fundamental text manipulation — an immutable [`String`](string/), and a [`StringBuilder`](stringbuilder/) to accumulate one.

**Module:** `Text`

**Source:** [github.com/rux-lang/Text](https://github.com/rux-lang/Text)

Both types hold a heap block they own, and every block comes from the [`Memory`](/api/memory/) package, which is what this one is built on. The bytes are whatever was put there — the package reads them as UTF-8 only where it has to, and says so where it does.

```rux
import Std::Io::PrintLine;
import Text::{ String, StringBuilder };

func Main() -> int {
    var name = String::From("  Rux  ").Trim(); // "Rux"

    var builder = StringBuilder::New();
    builder.Append("Hello, ");
    builder.Append(name);
    builder.Append(c8'!');

    var greeting = builder.IntoString(); // "Hello, Rux!"
    PrintLine(greeting.Length());        // 11

    greeting.Free();
    name.Free();
    return 0;
}
```

## Installation

```sh
rux add Text
rux install
```

## Platform support

Every allocation goes through [`Memory`](/api/memory/), so this package runs wherever that one does: illumos, Linux, macOS, and Windows. **BSD is not implemented yet** — [`Memory::Alloc`](/api/memory/alloc) returns `null` there, so a program that builds a string on BSD compiles but does not work.

## Ownership

There are no destructors, so a block is released by hand. Every `String` and `StringBuilder` this package hands out owns its block and has to be passed to `Free` exactly once — [`String::Free`](string/free) or [`StringBuilder::Free`](stringbuilder/free), not [`Memory::Free`](/api/memory/free).

Assignment copies the struct, not the block, so two `String` values can name the same allocation and freeing both is a double free. Take [`Clone`](string/clone) when both have to be freed. `Free` ignores an empty value and leaves an empty value behind, so calling it twice is harmless, and it is safe on anything the package returns.

A `String` never changes once built: every transformation returns a fresh one and leaves the receiver alone. That is what makes the value semantics safe, since a `String` built from a literal would otherwise be written through a read-only page. It also makes `+` in a loop a chain of allocations — build with a [`StringBuilder`](stringbuilder/) instead, and hand the result over with [`IntoString`](stringbuilder/intostring) to avoid a final copy.

## Text encoding

A `String` holds bytes, and [`Length`](string/length) counts bytes rather than characters, so a multi-byte UTF-8 sequence counts for more than one. [`At`](string/at) and [`Substring`](string/substring) index by byte and will happily cut a sequence in half. [`ToUpper`](string/toupper) and [`ToLower`](string/tolower) fold ASCII only and copy everything else through untouched.

The block carries no null terminator. Pair [`Data`](string/data) with [`Length`](string/length) when handing the bytes to something that reads them directly, rather than letting it scan for a terminator that is not there.

## Types

| Type                                | Description                                          |
| ----------------------------------- | ---------------------------------------------------- |
| [`String`](string/)                 | An immutable string, owning the block behind it.     |
| [`StringBuilder`](stringbuilder/)   | A growable buffer, for building a `String` in steps. |

## Functions

| Function              | Description                                    |
| --------------------- | ---------------------------------------------- |
| [`IsSpace`](isspace)  | Whether a byte is one of the whitespace bytes. |
