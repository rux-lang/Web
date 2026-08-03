::code-group

```rux [Hello.rux]
import Io::Print;

// Entry point of the program
func Main() -> int {
	Print("Hello, Rux!");
	return 0;
}
```

```rux [Greet.rux]
import Io::PrintLine;

// Entry point of the program
func Main() -> int {
	let greetings = [
		"Hello World",
		"你好，世界",
		"नमस्ते दुनिया",
		"Hola Mundo",
		"Bonjour le monde",
		"مرحبا يا عالم",
		"হ্যালো বিশ্ব",
		"Привет мир",
		"Olá Mundo",
		"سلام دنیا",
		"Привіт світ",
		"🐯🐶🐱🐭"
	];
	for greeting in greetings {
		PrintLine(greeting);
	}
	return 0;
}
```

```rux [Factorial.rux]
import Io::Print;

/// Computes the factorial of a number using an iterative approach
func Factorial(n: uint) -> uint {
    var result: uint = 1;
    for i in 2..=n {
        result *= i;
    }
    return result;
}

/// Entry point of the program
func Main() -> int {
    let number = 10u;
    let fact = Factorial(number);
    Print("Factorial of {} is {}\n", number, fact);
    return 0;
}
```

```rux [Func.rux]
import Io::Print;

// Regular function
func Max(a: int32, b: int32) -> int32 {
    return a > b ? a : b;
}

// Generic function
func Div<T>(x: T, y: T) -> T {
    return x / y;
}

func Main() -> int {
    let quotient = Div<float>(10.0, 2.0);
    let max = Max(5, 10);
    Print("Max: {}, Quotient: {}", max, quotient);
    return 0;
}
```

```rux [Variadic.rux]
import Io::Print;

// Function with an arbitrary number of arguments
func Sum(values: int...) -> int {
    var total = 0;
    for v in values {
        total += v;
    }
    return total;
}

func Main() -> int {
    Print("Sum of 1, 2, 3 is {}\n", Sum(1, 2, 3)); // 6
    Print("Sum of 10, 20 is {}\n", Sum(10, 20));   // 30
    Print("Sum with no arguments is {}\n", Sum()); // 0
    return 0;
}
```

```rux [Struct.rux]
import Io::PrintLine;
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

```rux [Mut.rux]
func Main() -> int {
    // Compile-time constant
    const Size: uint = 1024;
    // Not allowed and will cause a compile-time error
    Size = 35;      

    // Immutable variable
    let value = 20;
    // Not allowed, as 'let' is immutable
    // This will cause a compile-time error
    value = 25;     

    // Variable
    var steps = 10;
    // Allowed, as 'var' is mutable
    steps = 15;
 
    return 0;
}
```

```rux [Pointer.rux]
func Main() -> int {    
    let x: int = 100;        // Immutable binding
    let ptrX: *int = @x;     // Immutable pointer to immutable value
    x = 10;                  // Compilation error
    *ptrX = 15;              // Compilation error
    ptrX = null;             // Compilation error
        
    var y: int = 200;        // Mutable binding    
    let ptrY: *var int = @y; // Immutable pointer to mutable value
    y = 20;                  // OK
    *ptrY = 25;              // OK
    ptrY = null;             // Compilation error
    
    let z: int = 300;        // Immutable binding    
    var ptrZ: *int = @z;     // Mutable pointer to immutable value
    z = 30;                  // Compilation error
    *ptrZ = 35;              // Compilation error
    ptrZ = null;             // OK

    var t: int = 400;        // Mutable binding    
    var ptrT: *var int = @t; // Mutable pointer to mutable value
    t = 40;                  // OK
    *ptrT = 45;              // OK
    ptrT = null;             // OK
    
    var data = 3.1415;      // Simplified syntax
    let pointer = @data;
    
    // Mutable pointer-to-pointer
    var buf: **int64 = null;
    return 0;
}
```

```rux [Interface.rux]
import Format::Format;
import Text::String;

interface Display {
    func ToString() -> String;
}

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

```rux [Import.rux]
// Import package
import Math;

// Import a package with an alias
import Math as Calc;

// Import all items from a package
import Math::*;

// Import specific items from a package
import Math::Sin;

// Import multiple specific items from a package
import Math::{ Sin, Cos };

// Import specific item from a package with an alias
import Math::Cos as Cosine;
```

::
