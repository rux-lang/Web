# Generic Functions

Type parameters are declared in angle brackets after the function name and stand for a concrete type supplied at the call site. One generic definition replaces a family of identical overloads:

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

The type parameter `T` is bound to a concrete type for each call. It is usually inferred from the arguments, so the call site looks like any other:

```rux
let a = Min(3, 7);       // T = int
let b = Min(2.5, 1.0);   // T = float64
```

A single generic definition therefore replaces the family of near-identical overloads you would otherwise write by hand.

## See Also

- [Function Declaration](/docs/functions/declaration) — the non-generic form
- [Type Aliases](/docs/aliases/overview) — naming the types a generic is instantiated with
