# Tuples

A tuple groups a fixed number of values — possibly of different types — into a single value, without declaring a named [`struct`](/docs/structs/overview). Tuples are written as a parenthesized, comma-separated list in both type position and value position.

```rux
let pair: (int, float64) = (1, 2.5);
let triple = ("Rux", 3, true);   // (Slice<char8>, int, bool)
```

When the type can be inferred from the values, the annotation may be omitted, as in `triple` above.

## Type Identity

The number and types of elements are fixed at compile time and are part of the tuple's type. Order is significant, so `(int, float64)` and `(float64, int)` are different, incompatible types:

```rux
let a: (int, float64) = (1, 2.5);
let b: (float64, int) = a;   // error: types do not match
```

A tuple type carries no field names — only positions — which is what distinguishes it from a struct.

## Value Semantics

Like a struct, a tuple is a **value type**. Assigning it, or passing it to a function, copies every element; the copy and the original are independent.

```rux
var p = (1, 2);
var q = p;        // full copy
q = (9, 9);       // reassigns q only — p is still (1, 2)
```

## Nesting

A tuple element may be any type, including another tuple. This lets you build small structured values without a dedicated type:

```rux
let nested: (int, (float64, float64)) = (1, (2.0, 3.0));
```

## Memory Layout

A tuple is laid out like an unnamed [struct](/docs/structs/overview#memory-layout): its elements are stored **in order**, each at the next offset that satisfies its [natural alignment](/docs/appendix/primitives), with **padding** inserted where needed. The tuple's alignment is that of its strictest element, and its size is rounded up to a multiple of that alignment.

```rux
let t: (uint8, uint32) = (1, 2);
// element 0 at offset 0, element 1 at offset 4 (3 padding bytes between)
// alignment 4, size 8
```

The only layout difference from a struct is that the elements are reached by position rather than by name.

## Further Topics

| Topic                                          | Description                                       |
| ---------------------------------------------- | ------------------------------------------------- |
| [Destructuring](/docs/tuples/destructuring)     | Returning several values and unpacking them       |
| [Tuples vs. Structs](/docs/tuples/vs-struct)    | Choosing between positional and named aggregates  |

## See Also

- [Structures](/docs/structs/overview) — named aggregates with typed fields
- [Slices](/docs/slices/overview) — sequences of a single element type
