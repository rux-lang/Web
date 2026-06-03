# Attributes

Attributes annotate declarations with compiler directives. They appear immediately before the item they annotate, using the `@[Attribute(...)]` syntax.

```rux
@[Target("Windows")]
import Windows::HeapAlloc;
```

```rux
@[Warn("Use Boo function instead")]
func Foo();
```

Multiple attributes may be stacked before a single declaration:

```rux
@[Target("Windows")]
@[Import(lib: "User32.dll")]
extern func MessageBoxA(hwnd: *opaque, text: *char8, caption: *char8, type: uint32) -> int32;
```
