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

## Methods with `extend`

The `extend` block attaches methods to a struct. Instance methods take `self` as their first parameter; static methods omit it. `self` is a pointer to the structure.

```rux
struct Vector {
    x: float64;
    y: float64;
    z: float64;
}

extend Vector {
    func New(x: float64, y: float64, z: float64) -> Vector {
        return Vector { x: x, y: y, z: z };
    }

    func Length(self) -> float64 {
        return Sqrt(self.x * self.x + self.y * self.y + self.z * self.z);
    }

    func Scale(self, factor: float64) -> Vector {
        return Vector { x: self.x * factor, y: self.y * factor, z: self.z * factor };
    }

    func *(self, other: Vector) -> float64 {
        return self.x * other.x + self.y * other.y + self.z * other.z;
    }

    func +(self, other: Vector) -> Vector {
        return Vector { x: self.x + other.x, y: self.y + other.y, z: self.z + other.z };
    }
}
```

Usage:

```rux
let a = Vector { x: 1.0, y: 0.0, z: 0.0 };
let b = Vector::New(0.0, 1.0, 0.0);

let len  = a.Length();     // 1.0
let dot  = a * b;          // 0.0
let scaled = a.Scale(3.0); // Vector { x: 3.0, y: 0.0, z: 0.0 }
let sum    = a + b;        // Vector { x: 1.0, y: 1.0, z: 0.0 }
```

Static methods are called with the `::` path separator; instance methods are called with `.` on a value.
