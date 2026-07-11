# `Stringable`

The interface a type implements to convert itself into a `String`.

**Module:** `Format`

## Interface

```rux
interface Stringable {
    func ToString() -> String;
}
```

A type is `Stringable` when it can hand back its own text. Every primitive already is — the package extends each of them — so the interface is there for the types you write yourself, and for code that wants to take *anything* convertible rather than one type in particular.

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
        WriteInt(&builder, self.x as int64);
        builder.Append(", ");
        WriteInt(&builder, self.y as int64);
        builder.Append(c8')');
        return builder.IntoString();
    }
}
```

Building the text with a [`StringBuilder`](/api/text/stringbuilder/) and the [`Write`](writeint) functions is what keeps the conversion to one allocation. Reaching for [`ToString`](tostring) on each field instead would allocate a `String` per field and throw each one away again.

## Example

```rux
import Std::Io::PrintLine;

var origin = Point{ x: 0, y: 0 };
var text = origin.ToString(); // "(0, 0)"

PrintLine(text);
text.Free();
```

## See also

- [`Format`](/api/format/) — the module overview
- [`ToString`](tostring) — the conversion the primitives already have
- [`WriteInt`](writeint) — append into a builder, without a `String` of its own
- [`Text::StringBuilder`](/api/text/stringbuilder/) — accumulate the text an implementation returns
