# Structures

Structs group related data into a named type.

```rux
struct Point {
    x: float64;
    y: float64;
}

struct Person {
    name: char8[];
    age: uint32;
}
```

Construction:

```rux
let p = Point { x: 1.0, y: 2.0 };
let alice = Person { name: "Alice", age: 30 };
```

Field access:

```rux
Print(p.x)
Print(alice.name)
```

**Methods** are attached via `extend`.
