# Variables

A variable binds a name to a value. Every binding is either **immutable** or **mutable**, chosen by the keyword that introduces it:

| Binding                          | Mutability | Description                              |
| -------------------------------- | ---------- | ---------------------------------------- |
| [`let`](/docs/variables/let)     | Immutable  | Cannot be reassigned after initialization |
| [`var`](/docs/variables/var)     | Mutable    | Can be reassigned at any time            |

```rux
let answer = 42;   // immutable
var counter = 0;   // mutable
counter += 1;      // OK
```

Immutability is the default: prefer `let`, and reach for `var` only when a value genuinely needs to change.

## Type Inference and Annotations

When a binding has an initializer, the compiler infers its type. Add an explicit `: Type` annotation to choose a type other than the inferred one — a wider integer, say — or to declare a variable whose type cannot be inferred:

```rux
let pi = 3.14159;            // inferred float64
let name: char8[] = "Rux";   // explicit annotation
var total: int64 = 0;        // explicit — wider than the default int
```

A variable's type is fixed once it is declared. Because Rux performs no implicit conversions, assigning a value of a different type is a compile-time error; convert explicitly with an [`as`](/docs/operations/type-cast) cast.

## Topics in This Chapter

| Topic                                                              | Description                                          |
| ----------------------------------------------------------------- | --------------------------------------------------- |
| [Immutable Variables (`let`)](/docs/variables/let)                | The default binding and why to prefer it             |
| [Mutable Variables (`var`)](/docs/variables/var)                  | Reassignment and compound assignment                 |
| [Mutability of Structs](/docs/variables/mutability)               | How `let` and `var` govern field changes             |

For named values computed at compile time, use [`const`](/docs/constants/overview) instead.

## See Also

- [Constants](/docs/constants/overview) — compile-time named values
- [Type Casts](/docs/operations/type-cast) — converting between types when assigning
