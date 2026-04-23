# interface

An interface declares a set of method signatures that a type must satisfy.

```rux
interface Printable {
    func Print();
}

interface Comparable {
    func CompareTo(other: self): int32;
}
```
