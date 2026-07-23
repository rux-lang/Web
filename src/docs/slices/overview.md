# Slices

A slice, written `Slice<T>`, is a **view** over a contiguous sequence of elements. It does not own the elements — it only records *where* they live and *how many* there are. The storage belongs to something else: an [array](/docs/arrays/overview), a heap allocation, or a static in the binary.

```rux
func Sum(values: Slice<int32>) -> int32 {
    var total = 0;
    for v in values { total += v; }
    return total;
}
```

Because a slice is only a view, passing one is cheap regardless of how many elements it spans — the elements are never copied with it.

## Memory Layout

A slice value is a **fat pointer**: a fixed 16-byte header of two fields, whatever the element type or count.

```
Offset  Size  Field
0       8     data:   *T       — pointer to the first element
8       8     length: uint64   — number of elements
```

The header is **8-byte aligned**, since its first field is a pointer. The element data it points at is stored separately and is not part of these 16 bytes. Both fields can be read directly:

```rux
let nums = [10, 20, 30];   // int[3] — an array
let view: Slice<int> = nums;    // a slice viewing it
let p = view.data;         // *int — pointer to the first element
let n = view.length;       // uint64 — 3
```

This is the essential contrast with an [array](/docs/arrays/overview): an array *is* its elements (`N × sizeof(T)` bytes stored inline), while a slice merely *points at* elements owned elsewhere.

## Where Slices Come From

| Source                                                  | Example                              |
| ------------------------------------------------------- | ------------------------------------ |
| Viewing an [array](/docs/arrays/slicing)                | `let v: Slice<int32> = arr;`              |
| [Sub-slicing](/docs/arrays/slicing#sub-slicing-with-a-range) with a range | `let mid = arr[1..4];` |
| A [string literal](/docs/slices/literals)               | `let s = "Hello";  // Slice<char8>`       |
| A `data` pointer and length from native code            | see [Slices and Pointers](/docs/slices/low-level) |

A slice is valid only while the memory it views is alive. A slice into a local array dangles once that array goes out of scope.

## Further Topics

| Topic                                                          | Description                                             |
| ------------------------------------------------------------- | ------------------------------------------------------- |
| [String Literals](/docs/slices/literals)                       | The `Slice<char8>` slice a `"..."` literal produces           |
| [Indexing and Iteration](/docs/slices/access)                  | Reading, writing, looping, and spreading elements        |
| [Slices and Pointers](/docs/slices/low-level)                  | Low-level access through `data`, `sizeof`, and `extern`  |

## See Also

- [Arrays](/docs/arrays/overview) — the owning `T[N]` storage a slice most often views
- [Pointers](/docs/pointers/overview) — the `*T` type behind a slice's `data` field
- [Variadic Functions](/docs/functions/variadic) — functions that accept a variable number of arguments
