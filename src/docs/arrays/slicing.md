# Arrays as Slices

An array owns its storage; a [slice](/docs/slices/overview) (`Slice<T>`) is a lightweight **view** into storage owned elsewhere. Because an array *is* contiguous elements with a known length, it can always be viewed as a slice — and this is how you hand an array to code without copying it.

## Passing an Array to a Slice Parameter

A `T[N]` value is accepted anywhere a `Slice<T>` is expected. The compiler passes the array's address and length as a 16-byte slice header; the elements are **not** copied:

```rux
func Sum(values: Slice<int>) -> int {
    var total = 0;
    for v in values {
        total += v;
    }
    return total;
}

let row = [10, 20, 30];   // int[3]
let s = Sum(row);         // viewed as Slice<int> — no copy of the elements
```

Writing the parameter as `Slice<T>` also lets one function accept arrays of **any** length, since the length travels in the slice header rather than the type. This is the idiomatic way to pass an array by reference; passing the array itself by value would copy every element (see [Value Semantics](/docs/arrays/overview#value-semantics)).

## Binding a View

Assigning an array to a slice-typed binding produces a view over the same elements:

```rux
let nums = [1, 2, 3];      // int[3]
let view: Slice<int> = nums;    // same data and length, seen as Slice<int>
```

The view borrows the array's storage, so it is only valid while the array is alive. Returning a `Slice<T>` that points into a local array leaves it **dangling** once the function returns — return the array by value, or an allocation that outlives the call, instead.

## Sub-Slicing with a Range

Indexing with a [range](/docs/ranges/overview) rather than a single index produces a slice over **part** of the array. The range bounds follow the usual form — `a..b` excludes `b`, and `a..=b` includes it:

```rux
let data = [1, 2, 3, 4, 5];   // int[5]

let head = data[0..2];    // Slice<int> → 1, 2
let mid  = data[1..=3];   // Slice<int> → 2, 3, 4
let tail = data[2..];     // Slice<int> → 3, 4, 5
```

The result is always a `Slice<T>` view into the original array — no elements are copied, and writing through the sub-slice writes back to the array (when the array is a [`var`](/docs/variables/var)).

## See Also

- [Slices](/docs/slices/overview) — the `Slice<T>` view type in full
- [Arrays](/docs/arrays/overview) — the owning array type and its value semantics
- [Pointers to Fields and Members](/docs/pointers/members) — passing by pointer as an alternative to a slice
- [Slices and Pointers](/docs/slices/low-level) — reaching the backing memory through `data`
