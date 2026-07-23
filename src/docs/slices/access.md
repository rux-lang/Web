# Indexing and Iteration

A slice reaches its elements exactly as an [array](/docs/arrays/access) does — by position or in a loop — because both share the same element access. What is unique to a slice is that the access goes through its `data` pointer into memory it does not own.

## Indexing

Use `[i]` to read or write a single element. The index is zero-based, so valid indices run from `0` to `length - 1`:

```rux
func Highlight(line: Slice<char8>) -> char8 {
    return line[0];    // first character
}

let s = "cyan";
let c = s[0];          // 'c'
```

A write through a slice updates the underlying memory the slice views — the slice does not hold its own copy, so the change is visible through every other slice or array over the same region.

## Iteration

`for … in` walks every element in order, binding each to the loop variable. It reads `length` from the header, so it always covers exactly the elements the slice describes:

```rux
func Sum(values: Slice<int32>) -> int32 {
    var total = 0;
    for v in values {
        total += v;
    }
    return total;
}
```

See [`for`](/docs/statements/for) for the full loop syntax.

## Spread

Pass all elements of a slice as individual arguments to a [variadic](/docs/functions/variadic) function with `...`:

```rux
func Max(values: int32...) -> int32 { /* ... */ }

let data: Slice<int32> = collect();
let m = Max(data...);   // each element becomes one argument
```

See [Variadic Functions](/docs/functions/variadic) for how the receiving function declares and reads its arguments.

## See Also

- [Slices](/docs/slices/overview) — the slice view type and its memory layout
- [Arrays: Indexing and Iteration](/docs/arrays/access) — the same operations on owning arrays
- [`for`](/docs/statements/for) — iterating over a sequence
- [Variadic Functions](/docs/functions/variadic) — the target of a spread
