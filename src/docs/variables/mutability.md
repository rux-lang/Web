# Mutability of Structs

For a simple value like an `int`, the choice between [`let`](/docs/variables/let) and [`var`](/docs/variables/var) only decides whether the variable can be reassigned. For a [struct](/docs/structs/overview) it decides more: because a struct is a [value type](/docs/structs/overview#value-semantics), the binding that holds it governs **every field**. Mutability is *deep* — there is no way to have an immutable struct with mutable fields, or the reverse.

```rux
struct Point {
    x: float64;
    y: float64;
}
```

## `let` — Fully Immutable

A struct bound with `let` cannot be reassigned, and none of its fields can be modified:

```rux
let a = Point { x: 1.0, y: 1.0 };

a = Point { x: 0.0, y: 0.0 };  // error: cannot reassign a let binding
a.x = 2.0;                     // error: cannot modify a field of an immutable struct
```

## `var` — Fields and Whole Value Both Mutable

A struct bound with `var` allows both field-level writes and whole-value reassignment:

```rux
var b = Point { x: 0.0, y: 0.0 };

b.x = 3.0;                     // modify one field
b.y = 4.0;
b = Point { x: 1.0, y: 1.0 };  // or replace the entire value
```

## Nested Structs

The rule applies through nesting: a field that is itself a struct is mutable only when the top-level binding is `var`. There is no per-field opt-in or opt-out.

```rux
struct Line {
    start: Point;
    end: Point;
}

var line = Line {
    start: Point { x: 0.0, y: 0.0 },
    end:   Point { x: 1.0, y: 1.0 },
};

line.start.x = 5.0;   // OK — reached through a var binding
```

If `line` were a `let`, `line.start.x = 5.0` would be rejected just like a direct field write.

## Mutating Through a Pointer

A [pointer](/docs/pointers/members) does not bypass immutability. Only a writable [`*var T`](/docs/pointers/types) pointer can write through to the pointee, and `@` produces one only when the addressed value is itself a `var`. Taking `@` of a `let` yields a read-only `*T`:

```rux
var p = Point { x: 0.0, y: 0.0 };
let ptr = @p;         // *var Point — p is var
ptr.x = 5.0;          // OK

let q = Point { x: 0.0, y: 0.0 };
let qp = @q;          // *Point — q is let, so read-only
qp.x = 5.0;           // error: cannot assign through a pointer to immutable data
```

This is also why an instance method that mutates `self` can only be called on a `var` receiver — see [Methods](/docs/structs/methods).

## Other Composite Types

The same deep rule covers the other [value types](/docs/structs/overview#value-semantics): a [tuple](/docs/tuples/overview) or a fixed-size array (`T[N]`) is mutable only when bound with `var`.

A dynamic [slice](/docs/slices/overview) (`Slice<T>`) is the exception, because it is a **view** rather than a value: a `let` slice fixes the header (its `data` pointer and `length`) while the elements it refers to may still be written through it. Bind the slice with `let` to keep it pointing at the same region; the mutability of the elements depends on the storage they live in.

## See Also

- [Immutable Variables (`let`)](/docs/variables/let) — the default binding
- [Mutable Variables (`var`)](/docs/variables/var) — enabling field changes
- [Structures](/docs/structs/overview) — value semantics and field access
- [Pointers to Fields and Members](/docs/pointers/members) — writing through a pointer
