# Tuples

Tuples are fixed-size, anonymous product types. They are useful for grouping together a collection of values of different types without needing to declare a named structure.

## Syntax

A tuple type is written as a parenthesized list of types: `(T1, T2, ...)`. Similarly, a tuple value is constructed as a parenthesized list of expressions: `(value1, value2, ...)`.

```rux
// Declare a tuple containing an integer, a float, and a boolean
let item: (int32, float64, bool) = (42, 3.14159, true);

// Type inference also works for tuples
let coordinates = (10.5, -20.3); // Inferred as (float64, float64)
```

## Accessing Elements

Tuple elements are accessed using compile-time constant indices with the dot operator (`.0`, `.1`, etc.).

```rux
let data = (100, "Rux", false);

let id: int32 = data.0;
let name: char8[] = data.1;
let active: bool = data.2;
```

Tuple indices must be valid compile-time constants and within the bounds of the tuple size. Using an invalid index results in a compilation error.

## Returning Multiple Values

The primary use case for tuples is returning multiple values from a function without declaring a dedicated struct.

```rux
func MinMax(values: int32[]) -> (int32, int32) {
    var min = values[0];
    var max = values[0];
    for v in values {
        if v < min { min = v; }
        if v > max { max = v; }
    }
    return (min, max);
}

func Main() -> int {
    let scores = [85, 92, 78, 99, 64];
    let result = MinMax(scores);
    
    // Access returned values
    let lowest = result.0;
    let highest = result.1;
    
    return 0;
}
```
