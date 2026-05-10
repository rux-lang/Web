# Interfaces

## Interface Declaration

An interface declares a set of method signatures that a type must satisfy.

```rux
interface Display {
    func ToString() -> String;
}

interface Comparable {
    func CompareTo(other: self) -> int;
}
```

## Interface Implementation

`extend` attaches methods to a type, optionally satisfying one or more interfaces.

```rux
struct Circle {
    radius: float64;
}

extend Circle {
    func Area(self) -> float64 {
        return Pi * self.radius * self.radius;
    }
}

extend Circle: Display {
    func Print(self) -> String {
        return Format("Circle: radius = {}", self.radius);
    }
}
```
