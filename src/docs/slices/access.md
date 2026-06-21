# Indexing and Iteration

Once you have a slice, these are the everyday ways to reach its elements: by position, in a loop, or by spreading them into a call.

## Indexing

Use `[i]` to read or write a single element. The index is zero-based, so valid indices run from `0` to `length - 1`:

```rux
let colors = ["red", "green", "blue"];
let first  = colors[0];   // "red"
colors[2]  = "cyan";      // write through the slice
```

Indexing goes through the slice's `data` pointer, so a write updates the underlying memory that the slice views.

## Iteration

`for … in` walks every element in order, binding each to the loop variable:

```rux
let nums = [1, 2, 3, 4, 5];
var sum = 0;
for n in nums {
    sum += n;
}
```

This reads `length` from the header, so it always covers exactly the elements the slice describes. See [`for`](/docs/statements/for) for the full loop syntax.

## Spread

Pass all elements of a slice as individual arguments to a variadic function with `…`:

```rux
func Max(values: int32...) -> int32 { /* … */ }

let data = [3, 1, 4, 1, 5, 9];
let m = Max(data...);   // equivalent to Max(3, 1, 4, 1, 5, 9)
```

See [Variadic Functions](/docs/functions/variadic) for how the receiving function declares and reads its arguments.

## See Also

- [Slices](/docs/slices/overview) — the slice overview and memory layout
- [Slice and String Literals](/docs/slices/literals) — creating the slices you index and iterate
- [`for`](/docs/statements/for) — iterating over a slice
- [Variadic Functions](/docs/functions/variadic) — the target of a spread
