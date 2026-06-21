# Interface Implementation

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
    func ToString(self) -> String {
        return Format("Circle: radius = {}", self.radius);
    }
}
```

The compiler verifies that the `extend` block provides every method the interface declares, with matching signatures. A type may satisfy any number of interfaces.

Once implemented, interface methods are called like any other method:

```rux
let c = Circle { radius: 2.0 };
Print(c.ToString());  // Circle: radius = 2
```

## See Also

- [Interface Declaration](/docs/interfaces/declaration) — the signatures an `extend` block must satisfy
- [Methods](/docs/structs/methods) — the `extend` block and method syntax
- [Structures](/docs/structs/overview) — the types being extended
