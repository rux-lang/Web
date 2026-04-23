# Interfaces

## Interface Declaration

An interface declares a set of method signatures that a type must satisfy.

```rux
interface Printable {
    func Print();
}

interface Comparable {
    func CompareTo(other: self) -> int32;
}
```

## Interface Implementation

`impl` attaches methods to a type, optionally satisfying one or more interfaces.

```rux
struct Circle {
    radius: float64;
}

impl Circle {
    func Area() -> float64 {
        return PI * self.radius * self.radius;
    }
}

impl Printable for Circle {
    func Print() {
        Print("Circle(radius=", self.radius, ")");
    }
}
```
