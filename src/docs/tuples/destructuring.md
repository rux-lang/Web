# Destructuring

A tuple is most useful when it is produced in one place and unpacked in another. **Destructuring** binds each element of a tuple to its own name in a single step.

## Returning Multiple Values

The most common use of tuples is returning several values from a function without defining a one-off struct:

```rux
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

The return type is just a tuple type; see [Parameters and Return Types](/docs/functions/declaration#parameters-and-return-types) for where it sits in a declaration.

## Unpacking a Tuple

Unpack a tuple into individual bindings with a parenthesized [`let`](/docs/variables/let) (or [`var`](/docs/variables/var)). Each name on the left receives the element in the matching position:

```rux
let data = [3, 1, 4, 1, 5, 9];

let (lo, hi) = MinMax(data);   // lo == 1, hi == 9
```

Use `var` instead of `let` when the bindings need to change afterwards:

```rux
var (lo, hi) = MinMax(data);
lo = 0;                        // ok — lo is mutable
```

## Discarding Elements

The wildcard `_` ignores an element you do not need, so you only name the parts you intend to use:

```rux
let (min, _) = MinMax(data);   // keep only the minimum
```

## See Also

- [Tuples](/docs/tuples/overview) — the tuple overview
- [Tuples vs. Structs](/docs/tuples/vs-struct) — when to reach for named fields instead
- [`match`](/docs/statements/match) — pattern matching, including tuple patterns
