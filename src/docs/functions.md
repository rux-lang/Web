# Functions

## Function Declaration

Functions are declared with the `func` keyword.

```rux
func Greet()
{
    Print("Hello!");
}
```

## Parameters and Return Types

```rux
func Add(a: int32, b: int32) -> int32
{
    return a + b;
}

func Clamp(value: float64, min: float64, max: float64) -> float64
{
    if value < min { return min; }
    if value > max { return max; }
    return value;
}

func MinMax(arr: uint64[]) -> (uint64, uint64)
{
    var min = arr[0];
    var max = arr[0];
    for i = 0..arr.Length
    {
        if arr[i] < min
            min = arr[i];
        if arr[i] > max
            max = arr[i];
    }
    return (min, max);
}
```

## Generic Functions

```rux
// Regular function
func Add(x, y: int32) -> int32
{
    return x + y;
}

// Generic function
func Min<T>(x, y: T) -> T
{
    return x < y ? x : y;
}
```

## Assembler Functions

```rux
asm func Greet()
{
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
func Main() -> int
{
    return 0;
}
```
