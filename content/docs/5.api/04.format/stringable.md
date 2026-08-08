# Stringable

The interface a type implements to convert itself into a `String`.

**Package:** `Format`

## Interface

```rux
interface Stringable {
    func ToString() -> String;
}
```

A type is `Stringable` when it can hand back its own text. Every primitive already is — the package extends each of them — so the interface is there for the types you write yourself, and for code that wants to take _anything_ convertible rather than one type in particular.

The `String` a `ToString` returns is the caller's, and the caller frees it exactly once. An implementation that breaks that rule — handing back a `String` it still holds, or one it frees itself — hands the caller a double free.

## Implementing

Implement it with an `extend ... : Stringable` block. The primitives do the same, which is what puts a `ToString` method on `42` as well as behind `ToString(42)`:

```rux
import Format::{ Stringable, WriteInt };
import Text::{ String, StringBuilder };

struct Point {
    x: int;
    y: int;
}

extend Point : Stringable {
    func ToString(self) -> String {
        var builder = StringBuilder::New();
        builder.Append(c8'(');
        WriteInt(@builder, self.x as int64);
        builder.Append(", ");
        WriteInt(@builder, self.y as int64);
        builder.Append(c8')');
        return builder.IntoString();
    }
}
```

Building the text with a [`StringBuilder`](/docs/api/text/stringbuilder) and the [`Write`](/docs/api/format/writeint) functions is what keeps the conversion to one allocation. Reaching for [`ToString`](/docs/api/format/tostring) on each field instead would allocate a `String` per field and throw each one away again.

## Example

```rux
import Format::{ Stringable, WriteInt };
import Text::{ String, StringBuilder };
import Io::PrintLine;

struct Point {
    x: int;
    y: int;
}

extend Point : Stringable {
    func ToString(self) -> String {
        var builder = StringBuilder::New();
        builder.Append(c8'(');
        WriteInt(@builder, self.x as int64);
        builder.Append(", ");
        WriteInt(@builder, self.y as int64);
        builder.Append(c8')');
        return builder.IntoString();
    }
}

func Main() -> int {
    var origin = Point{ x: 0, y: 0 };
    var text = origin.ToString(); // "(0, 0)"

    PrintLine(text);
    text.Free();
    return 0;
}
```

## See also

- [`Format`](/docs/api/format) — the package overview
- [`ToString`](/docs/api/format/tostring) — the conversion the primitives already have
- [`WriteInt`](/docs/api/format/writeint) — append into a builder, without a `String` of its own
- [`Text::StringBuilder`](/docs/api/text/stringbuilder) — accumulate the text an implementation returns
