# Using Ranges

Ranges have two everyday jobs: driving a counted loop and carving a sub-slice out of a sequence.

## Iteration

A [`for`](/docs/statements/for) loop over a range walks its values in order, binding each to the loop variable. Use `..` for a half-open count and `..=` when the last value should be included:

```rux
for i in 0..5 {
    Print(i);    // 0, 1, 2, 3, 4
}

for i in 1..=5 {
    Print(i);    // 1, 2, 3, 4, 5
}
```

Only ranges that have a **start** can be iterated — `a..b`, `a..=b`, and `a..`. A range with no start (`..b`, `..=b`, `..`) has no first value, so iterating one is a compile-time error; those forms exist for [slicing](#slicing). A `a..` range with no end is unbounded, so a loop over it must [`break`](/docs/statements/break-continue) out itself.

The loop variable takes the range's bound type — `for i in 0..n` gives `i` of type `int`.

## Slicing

Indexing an [array](/docs/arrays/slicing) or [slice](/docs/slices/overview) with a range — rather than a single position — produces a **[slice](/docs/slices/overview)** over that sub-interval. Here *every* range form is allowed: an omitted start defaults to `0`, and an omitted end defaults to the sequence's `length`.

```rux
let data = [10, 20, 30, 40, 50];   // int[5]

let a = data[1..4];    // 20, 30, 40   — explicit bounds
let b = data[2..];     // 30, 40, 50   — from index 2 to the end
let c = data[..3];     // 10, 20, 30   — start through index 2
let d = data[..];      // 10, 20, 30, 40, 50 — the whole thing
```

The result is a `Slice<T>` view into the original storage — no elements are copied, and writing through it writes back to the source (when that source is a [`var`](/docs/variables/var)). See [Arrays as Slices](/docs/arrays/slicing#sub-slicing-with-a-range) for more.

## See Also

- [Ranges](/docs/ranges/overview) — the range forms and their bounds
- [`for` / `in`](/docs/statements/for) — the loop that iterates a range
- [Arrays as Slices](/docs/arrays/slicing) — sub-slicing in the context of arrays
- [`break` / `continue`](/docs/statements/break-continue) — leaving an unbounded loop
