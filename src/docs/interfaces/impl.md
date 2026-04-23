# impl

`impl` attaches methods to a type, optionally satisfying one or more interfaces.

```rux
struct Circle {
    radius: float64;
}

impl Circle {
    func Area(): float64 {
        return PI * self.radius * self.radius;
    }
}

impl Printable for Circle {
    func Print() {
        Print("Circle(radius=", self.radius, ")");
    }
}
```
