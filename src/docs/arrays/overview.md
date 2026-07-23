# Arrays

An **array** `T[N]` is a fixed-size sequence of `N` values of type `T`, stored **inline**. The count `N` is part of the type and fixed at compile time, so `int32[3]` and `int32[4]` are different types. An array *is* its elements — it owns them directly, with no pointer or header in between.

```rux
let rgb: uint8[3] = [255, 128, 0];
let row: int32[4] = [1, 2, 3, 4];
```

An array literal `[a, b, c]` has type `T[N]`, where `T` is the element type and `N` is the number of elements:

```rux
let primes = [2, 3, 5, 7, 11];   // int[5]
let flags  = [true, false];      // bool[2]
```

Every element must have the same type — an array is a sequence of one element type, unlike a [tuple](/docs/tuples/overview).

## Memory

An `int32[3]` occupies exactly `3 × sizeof(int32)` = 12 bytes: the three integers laid out end to end, with nothing else. In general an array is `N × sizeof(T)` bytes, and it lives wherever its binding lives — on the stack for a local, inside its parent for a field.

```
  int32[3]  — 12 bytes, contiguous
  ┌────────────┬────────────┬────────────┐
  │  elem 0    │  elem 1    │  elem 2    │
  └────────────┴────────────┴────────────┘
```

This is the key difference from a [slice](/docs/slices/overview): a slice is a 16-byte `{data, length}` *view* into memory owned elsewhere, whereas an array *is* the storage.

## Value Semantics

Like a [struct](/docs/structs/overview#value-semantics) or a [tuple](/docs/tuples/overview), an array is a **value type**. Assigning it or passing it to a function copies **every element**:

```rux
var a = [1, 2, 3];
var b = a;        // b is an independent copy of all three elements
b[0] = 99;        // a is unchanged: a == [1, 2, 3], b == [99, 2, 3]
```

Because the whole array is copied, passing a large array by value is expensive. To hand a function a view without copying, pass it as a [slice](/docs/arrays/slicing) (`Slice<T>`) or take a [pointer](/docs/pointers/members) — both are covered in [Arrays as Slices](/docs/arrays/slicing).

Mutability is **deep** and governed by the binding: an array bound with `let` is fully immutable, while `var` allows both element writes and whole-value reassignment. See [Mutability of Structs](/docs/variables/mutability), which applies equally to arrays.

## Length

An array's `length` is a **compile-time constant** — the `N` in its type — with type `uint`:

```rux
let buf: float64[8] = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0];
let n = buf.length;   // 8, known at compile time
```

## Topics in This Chapter

| Topic                                                | Description                                             |
| ---------------------------------------------------- | ------------------------------------------------------- |
| [Indexing and Iteration](/docs/arrays/access)        | Reading, writing, and looping over elements             |
| [Arrays as Slices](/docs/arrays/slicing)             | Viewing an array as a `Slice<T>`, and sub-slicing with a range |

## See Also

- [Slices](/docs/slices/overview) — the `Slice<T>` view type an array can be seen through
- [Mutability of Structs](/docs/variables/mutability) — the value-type rules arrays follow
- [Tuples](/docs/tuples/overview) — fixed-size sequences of *mixed* types
