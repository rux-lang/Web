# `Slice`

A view over a contiguous sequence of elements.

**Package:** `Rux`

## Definition

```rux
struct Slice<T> {
    data: *T;
    length: uint;
}
```

A `Slice<T>` is a fat pointer — a `data` pointer paired with a `length` — that records *where* a run of `T` elements lives and *how many* there are. It does not own the elements; the storage belongs to an array, a heap allocation, or a static in the binary. A string literal is a `Slice<char8>`, and an array coerces to a slice.

The `data` field is a read-only `*T`. Reach for a slice whenever a function needs to take a sequence of elements without caring where they are stored.

## See also

- [`Rux`](/api/rux/) — the package overview
- [Slices](/docs/slices/overview) — the language-reference treatment
- [`Range`](ranges) — indexing a slice with a range produces another slice
