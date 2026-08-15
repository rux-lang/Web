::code-tree{defaultValue="Functions/Src/Main.rux" class="my-0! lg:rounded-r-none lg:border-r-0"}

```toml [Functions/Rux.toml]
[Manifest]
Version = 1

[Package]
Name = "Functions"
Version = "0.1.0"
Type = "Executable"
Description = "Functions and generics"

[Dependencies]
Io = { Namespace = "Rux", Version = "*" }
```

```rux [Functions/Src/Main.rux]
import Io::Print;

func Main() -> int {
    let factorial = Factorial(10);
    let quotient = Div<float>(10.0, 2.0);
    let sum = Sum(1, 2, 3);
    Print("Factorial: {}\n", factorial);
    Print("Quotient: {}\n", quotient);
    Print("Sum: {}\n", sum);
    return 0;
}
```

```rux [Functions/Src/Regular.rux]
// Fixed number of arguments
func Factorial(n: uint) -> uint {
    var result: uint = 1;
    for i in 2..=n {
        result *= i;
    }
    return result;
}
```

```rux [Functions/Src/Variadic.rux]
// An arbitrary number of arguments
func Sum(values: int...) -> int {
    var total = 0;
    for v in values {
        total += v;
    }
    return total;
}
```

```rux [Functions/Src/Generic.rux]
// T is a generic type parameter
func Div<T>(x: T, y: T) -> T {
    return x / y;
}
```

::
