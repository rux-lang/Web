# Module Declaration

Modules organize code into named namespaces. A module is declared with the `module` keyword and can appear anywhere in a source file. Multiple modules can exist in one file, and modules can be nested.

```rux
module Math {
    pub func Sqrt(x: float64) -> float64 {
        // Code here
    }

    pub func Abs(x: float64) -> float64 {
        // Code here
    }
}
```

Nested modules can be declared inline or using path notation:

```rux
module Std::Io {
    pub func Print(s: String) {
        // Code here
    }
}
```

The `::` separator names a path through nested modules, both when declaring (`module Std::Io`) and when referring to an item (`Std::Io::Print`).

## See Also

- [Items Visibility](/docs/modules/visibility) — exporting items with `pub`
- [Import](/docs/modules/import) — bringing module items into scope
