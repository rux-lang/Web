# Immutable Variables (`let`)

A variable introduced with `let` is **immutable**: once initialized, it cannot be reassigned. Immutability is the default in Rux — reach for `let` first and switch to [`var`](/docs/variables/var) only when mutation is genuinely needed.

```rux
let x = 42;                 // type inferred as int
let name: char8[] = "Rux";  // explicit type annotation

x = 10;   // error: cannot assign to an immutable binding
```

## Why Prefer `let`

Defaulting to `let` makes the few values that *do* change stand out, and it lets the compiler reject accidental writes. A binding you never intend to reassign should say so, so that readers — and the compiler — can rely on it.

## Immutability Extends to Fields

For a value type such as a [struct](/docs/structs/overview), `let` makes the **whole value** immutable, not just the name. You can neither reassign the variable nor modify its fields:

```rux
let p = Point { x: 1.0, y: 2.0 };

p = Point { x: 0.0, y: 0.0 };  // error: cannot reassign a let binding
p.x = 5.0;                     // error: cannot modify a field of an immutable struct
```

See [Mutability of Structs](/docs/variables/mutability) for the complete rules.

## See Also

- [Mutable Variables (`var`)](/docs/variables/var) — when a value needs to change
- [Mutability of Structs](/docs/variables/mutability) — how `let` propagates into fields
- [Constants](/docs/constants/overview) — immutable values known at compile time
