# Functions

## Function Declaration

Functions are declared with the `func` keyword.

```rux
func Greet() {
    Print("Hello!");
}
```

## Parameters and Return Types

```rux
func Add(a: int32, b: int32) -> int32 {
    return a + b;
}

func Clamp(value: float64, min: float64, max: float64) -> float64 {
    if value < min { return min; }
    if value > max { return max; }
    return value;
}

func MinMax(arr: uint64[]) -> (uint64, uint64) {
    var min = arr[0];
    var max = arr[0];
    for val in arr {
        if val < min { min = val; }
        if val > max { max = val; }
    }
    return (min, max);
}
```

## Variadic Functions

A variadic parameter accepts any number of arguments of a given type. It must be the last parameter and is declared by appending `...` to the type. Inside the function the parameter is a slice of that type.

```rux
func Sum(values: int32...) -> int32 {
    var total = 0;
    for v in values {
        total += v;
    }
    return total;
}

Sum(1, 2, 3);       // 6
Sum(10, 20);        // 30
Sum();              // 0 — zero arguments is valid
```

### Spread operator

Pass an existing slice as the variadic argument list with the `...` spread operator:

```rux
let nums = [4, 5, 6];
Sum(nums...);       // 15
```

## Generic Functions

```rux
// Regular function
func Add(x: int, y: int) -> int {
    return x + y;
}

// Generic function
func Min<T>(x: T, y: T) -> T {
    return x < y ? x : y;
}
```

## Assembler Functions

```rux
asm func Greet() {
    mov eax, 4      // 'write' system call
    mov ebx, 1      // file descriptor (stdout)
    mov ecx, msg    // pointer to the string
    mov edx, len    // length of the string
    int 0x80        // call the kernel

    mov eax, 1      // 'exit' system call
    xor ebx, ebx    // return code 0
    int 0x80        // call the kernel
}
```

## The Main Entry Point

Every binary executable package must define a `Main` function with no parameters. By default, this file is called `Main.rux`.

```rux
// Entry point
func Main() -> int {
    return 0;
}
```
