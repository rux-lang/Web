# Methods

The `extend` block attaches methods to a struct. **Instance methods** take `self` as their first parameter; **static methods** omit it. `self` is a [pointer](/docs/pointers/members) to the structure, so a method reads and writes fields through it with `.`.

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

## Static vs Instance Calls

Static methods are called with the `::` path separator on the type; instance methods are called with `.` on a value.

```rux
let a = Vector { x: 1.0, y: 0.0, z: 0.0 };
let b = Vector::New(0.0, 1.0, 0.0);   // static — constructs a Vector

let len    = a.Length();    // instance — 1.0
let scaled = a.Scale(3.0);  // Vector { x: 3.0, y: 0.0, z: 0.0 }
```

Because `self` is a pointer, an instance method may also modify the value it is called on. The receiver must be mutable (`var`) for the write to be allowed:

```rux
extend Vector {
    func Negate(self) {
        self.x = -self.x;
        self.y = -self.y;
        self.z = -self.z;
    }
}

var v = Vector { x: 1.0, y: 2.0, z: 3.0 };
v.Negate();   // v == Vector { x: -1.0, y: -2.0, z: -3.0 }
```

## Operator Overloading

An `extend` block can define operators by naming the method after the operator symbol. The operator then works on values of the struct type:

```rux
let dot = a * b;   // calls func *(self, other) — 0.0
let sum = a + b;   // calls func +(self, other) — Vector { x: 1.0, y: 1.0, z: 0.0 }
```

## See Also

- [Construction and Field Access](/docs/structs/overview#construction-and-field-access) — creating and reading values
- [Pointers to Fields and Members](/docs/pointers/members) — how `self` is passed
