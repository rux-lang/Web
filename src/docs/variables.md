# Variables

## Immutable Variables

Variables are introduced with `let`. Rux infers the type from the initializer when possible. All bindings are **immutable by default**.

```rux
let x = 42;  // type inferred as int
let name: String = "Rux";
```

## Mutable Variables

To allow reassignment the variable use `var`.

```rux
let count = 0;      // immutable
var mut score = 0;  // mutable
score = score + 1;  // OK
```
