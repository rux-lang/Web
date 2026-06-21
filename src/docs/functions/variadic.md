# Variadic Functions

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

## Spread operator

Pass an existing slice as the variadic argument list with the `...` spread operator:

```rux
let nums = [4, 5, 6];
Sum(nums...);       // 15
```

Because the parameter is an ordinary [slice](/docs/slices/overview) inside the function, both forms — a list of arguments and a spread slice — reach the body identically.

## See Also

- [Slices](/docs/slices/overview) — the type a variadic parameter takes
- [Function Declaration](/docs/functions/declaration) — parameters and return types
- [Spread](/docs/slices/access#spread) — passing a slice as individual arguments
