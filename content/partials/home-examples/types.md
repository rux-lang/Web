::code-tree{defaultValue="Struct/Src/Main.rux" class="my-0! lg:rounded-r-none lg:border-r-0"}

```toml [Struct/Rux.toml]
[Package]
Name = "Struct"
Version = "0.1.0"
Type = "Program"
Description = "Structure and methods"

[Dependencies]
Io = { Namespace = "Rux", Version = "*" }
Math = { Namespace = "Rux", Version = "*" }
```

```rux [Struct/Src/Main.rux]
import Io::PrintLine;

func Main() -> int {
    let v1 = Vector{ x: 1.0, y: 2.0, z: 3.0 };
    let v2 = Vector::New(10.0, 20.0, 30.0);
    let sum = v1 + v2;
    let prod = v1 * v2;
    PrintLine("Sum: [{}, {}, {}]", sum.x, sum.y, sum.z);
    PrintLine("Length: {}", sum.Length());
    PrintLine("Product: {}", prod);
    return 0;
}
```

```rux [Struct/Src/Vector.rux]
import Math::Sqrt;

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

    func *(self, other: Vector) -> float64 {
        return self.x * other.x + self.y * other.y + self.z * other.z;
    }

    func +(self, other: Vector) -> Vector {
        return Vector { x: self.x + other.x, y: self.y + other.y, z: self.z + other.z };
    }
}
```

```toml [Interface/Rux.toml]
[Package]
Name = "Interface"
Version = "0.1.0"
Type = "Program"
Description = "Interface implementation"

[Dependencies]
Format = { Namespace = "Rux", Version = "*" }
Io = { Namespace = "Rux", Version = "*" }
Math = { Namespace = "Rux", Version = "*" }
Text = { Namespace = "Rux", Version = "*" }
```

```rux [Interface/Src/Circle.rux]
import Format::Format;
import Math::Pi;
import Text::String;

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

```rux [Interface/Src/Display.rux]
import Text::String;

interface Display {
    func ToString() -> String;
}
```

```rux [Interface/Src/Main.rux]
import Io::PrintLine;

func Main() -> int {
    let circle = Circle { radius: 2.0 };
    PrintLine("{}; area = {}", circle.ToString(), circle.Area());
    return 0;
}
```

::
