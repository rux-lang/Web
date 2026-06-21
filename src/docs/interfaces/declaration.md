# Interface Declaration

An interface declares a set of method signatures that a type must satisfy. It lists method headers — names, parameters, and return types — but no bodies; the implementing type supplies those.

```rux
interface Display {
    func ToString() -> String;
}

interface Comparable {
    func CompareTo(other: self) -> int;
}
```

The keyword `self` stands for the implementing type, so `Comparable` above requires a `CompareTo` that takes another value of whatever type implements it. An interface may declare any number of methods.

## See Also

- [Interface Implementation](/docs/interfaces/implementation) — satisfying these signatures with `extend`
- [Methods](/docs/structs/methods) — how `self` works in a method
