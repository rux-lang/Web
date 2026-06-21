# `Display`

The interface for converting a value to a `String`.

**Module:** `Std`

## Interface

```rux
interface Display {
    func ToString() -> String;
}
```

A type implements `Display` by providing a `ToString` method. Any `Display`
value can be passed to [`Print`](io/print), [`PrintLine`](io/printline), and
[`Format`](format), which is how those functions accept mixed argument types
through the variadic `Display...` parameter.

## Implementing `Display`

Implement the interface with an `extend ... : Display` block:

```rux
import Std::Display;

struct Point {
    x: int;
    y: int;
}

extend Point : Display {
    func ToString(self) -> String {
        return Format("({}, {})", self.x, self.y);
    }
}
```

Once implemented, a `Point` can be printed or formatted directly:

```rux
let p = Point { x: 3, y: 4 };
PrintLine(p);              // (3, 4)
let s = Format("p = {}", p);
```

## Built-in implementations

The standard library implements `Display` for every built-in numeric, boolean,
and character type, as well as for [`String`](string/) and
[`StringBuilder`](stringbuilder/):

| Category    | Types                                              |
| ----------- | -------------------------------------------------- |
| Signed      | `int`, `int8`, `int16`, `int32`, `int64`           |
| Unsigned    | `uint`, `uint8`, `uint16`, `uint32`, `uint64`      |
| Float       | `float32`, `float64`                               |
| Boolean     | `bool`, `bool8`, `bool16`, `bool32` (`"true"`/`"false"`) |
| Character   | `char`, `char8`, `char16`, `char32`                |
| Library     | [`String`](string/), [`StringBuilder`](stringbuilder/) |

Because of these, values like `42`, `true`, and `'x'` can be passed straight to
`Print` and `Format` without manual conversion.

## See also

- [`Format`](format) — build a `String` from a format string and `Display` arguments
- [`Print`](io/print) / [`PrintLine`](io/printline) — write `Display` values to standard output
