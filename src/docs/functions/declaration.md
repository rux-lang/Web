# Function Declaration

Functions are declared with the `func` keyword.

```rux
func Greet() {
    Print("Hello!");
}
```

## Parameters and Return Types

Each parameter is written `name: Type`; the return type follows `->`. A function without `->` returns nothing. Multiple values can be returned as a [tuple](/docs/tuples/overview):

```rux
func Add(a: int32, b: int32) -> int32 {
    return a + b;
}

func Clamp(value: float64, min: float64, max: float64) -> float64 {
    if value < min { return min; }
    if value > max { return max; }
    return value;
}

func MinMax(arr: Slice<uint64>) -> (uint64, uint64) {
    var min = arr[0];
    var max = arr[0];
    for val in arr {
        if val < min { min = val; }
        if val > max { max = val; }
    }
    return (min, max);
}
```

By convention function names use PascalCase (see [Identifiers](/docs/lexical/identifiers)).

## Mutable Parameters

Like a [`let`](/docs/variables/let) binding, a parameter is **immutable** by default — the body may read it but not reassign it. Prefix the parameter with `var` to make it a mutable local the body can reassign:

```rux
func Countdown(var n: int32) {
    while n > 0 {
        Print(n);
        n -= 1;        // OK — n is a var parameter
    }
}
```

The `var` governs only the parameter binding inside the function. Arguments are passed by value, so reassigning a `var` parameter never affects the caller's value. To modify the caller's value, take a [pointer parameter](/docs/pointers/members) instead.

## Default Arguments

A parameter may declare a default value with `=`. A caller can then omit that argument and the default is used in its place. Parameters with defaults come after those without:

```rux
func Connect(host: Slice<char8>, port: uint16 = 443) {
    // Code here
}

Connect("example.com");        // port defaults to 443
Connect("example.com", 8080);  // port given explicitly
```

A default may be a [compile-time intrinsic](/docs/comptime/context#source) such as `#source.file` or `#source.line`, which the compiler substitutes at each call site — the pattern the standard library uses to capture a caller's location.

## See Also

- [Variadic Functions](/docs/functions/variadic) — accepting any number of arguments
- [Generic Functions](/docs/functions/generic) — parameterising over types
- [Tuples](/docs/tuples/overview) — returning several values at once
