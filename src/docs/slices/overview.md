# Slices

A slice is a **view** over a contiguous sequence of elements. It does not own the elements; it describes where they live and how many there are. Rux has two slice forms:

| Syntax  | Description                                                |
| ------- | --------------------------------------------------------- |
| `T[]`   | Dynamic slice — pointer and length, size known at runtime |
| `T[N]`  | Fixed-size array — `N` elements backed by stack storage   |

Both forms share the same 16-byte runtime representation and the same set of operations, so most code works with either without caring which it was handed.

## Memory Layout

Every slice value occupies exactly **16 bytes** on the stack, regardless of the element type or count:

```
Offset  Size  Field
0       8     data:   *T       — pointer to the first element
8       8     length: uint64   — number of elements
```

The header is **8-byte aligned**, since its first field is a pointer. The element data it points at is stored separately and is not part of these 16 bytes. Because the layout is fixed, the `data` and `length` fields can be read directly in Rux code:

```rux
let nums = [10, 20, 30];
let p = nums.data;    // *int32 — pointer to first element
let n = nums.length;  // uint64 — 3
```

The header is small and cheap to copy; the elements it points at are not copied with it. This is what makes passing a slice to a function inexpensive — see [Dynamic Slices and Fixed-Size Arrays](/docs/slices/kinds).

## Further Topics

| Topic                                                          | Description                                          |
| ------------------------------------------------------------- | --------------------------------------------------- |
| [Dynamic Slices and Fixed-Size Arrays](/docs/slices/kinds)     | The `T[]` and `T[N]` forms and how they relate       |
| [Slice and String Literals](/docs/slices/literals)             | Creating slices from element lists and strings       |
| [Indexing and Iteration](/docs/slices/access)                  | Reading, writing, looping, and spreading elements    |
| [Slices and Pointers](/docs/slices/low-level)                  | Low-level access through `data`, `sizeof`, and `extern` |

## See Also

- [Pointers](/docs/pointers/overview) — the `*T` type behind a slice's `data` field
- [Variadic Functions](/docs/functions/variadic) — functions that accept a variable number of arguments
