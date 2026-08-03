# Indexing and Iteration

The elements of an array are reached the same way as any sequence — by position or in a loop.

## Indexing

Use `[i]` to read or write a single element. The index is zero-based, so valid indices run from `0` to `length - 1`:

```rux
var row = [10, 20, 30];
let first = row[0];   // 10
row[2] = 99;          // row == [10, 20, 99]
```

Writing an element requires the array to be mutable — bound with [`var`](/docs/variables/var). Through a `let` binding the elements are read-only, matching the [deep mutability](/docs/variables/mutability) rule for value types.

## Iteration

`for … in` walks every element in order, binding each to the loop variable:

```rux
let nums = [1, 2, 3, 4, 5];
var sum = 0;
for n in nums {
    sum += n;
}
// sum == 15
```

The loop covers exactly `length` elements — and because an array's [`length`](/docs/arrays/overview#length) is a compile-time constant, the compiler knows the trip count up front. See [`for`](/docs/statements/for) for the full loop syntax.

## Indexing with a Range

Indexing with a [range](/docs/arrays/slicing) instead of a single position produces a **slice** over part of the array rather than one element:

```rux
let data = [1, 2, 3, 4, 5];
let middle = data[1..4];   // Slice<int> viewing 2, 3, 4
```

This is covered in [Arrays as Slices](/docs/arrays/slicing).

## See Also

- [Arrays](/docs/arrays/overview) — the array type and its value semantics
- [Arrays as Slices](/docs/arrays/slicing) — range sub-slicing and passing arrays to functions
- [`for`](/docs/statements/for) — iterating over a sequence
- [Mutability of Structs](/docs/variables/mutability) — why element writes need `var`
