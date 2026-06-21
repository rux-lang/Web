# Dynamic Slices and Fixed-Size Arrays

Both slice forms use the same 16-byte `{data, length}` [header](/docs/slices/overview#memory-layout). They differ only in where the element data lives and how it is created.

## Dynamic Slices (`T[]`)

A dynamic slice (`T[]`) does not own any memory. It is a **fat pointer**: a pair of `{data, length}` that describes a region owned by someone else — a stack buffer, a heap allocation, or a static.

```rux
func Sum(values: int32[]) -> int32 {
    var total = 0;
    for v in values {
        total += v;
    }
    return total;
}
```

Passing a slice to a function does not copy the elements — the 16-byte header is passed by pointer, so the callee reads the same underlying memory. A function that takes `T[]` therefore works with data from any source without knowing how it was allocated.

## Fixed-Size Arrays (`T[N]`)

When you declare a variable with a fixed-size type, the compiler allocates `N × sizeof(T)` bytes on the stack for the element data and initialises the slice header to point at it:

```rux
let buf: char8[1024];   // 1024 bytes on the stack; buf.length == 1024
let rgb: uint8[3];      // 3 bytes on the stack; rgb.length == 3
```

The resulting value is still a 16-byte `{data, length}` header — `T[N]` is **syntactic sugar for a stack-backed slice**, not a distinct type.

## Assigning `T[N]` to `T[]`

Because both forms share one representation, a `T[N]` value is assignable anywhere a `T[]` is expected. The fixed-size array supplies the storage; the dynamic slice borrows a view of it:

```rux
let rgb: uint8[3];
let view: uint8[] = rgb;   // same data and length, viewed as T[]
```

Keep in mind that the view is only valid while the backing array is alive. Returning a `T[]` that points into a local `T[N]` leaves it dangling once the function returns.

## See Also

- [Slices](/docs/slices/overview) — the slice overview and memory layout
- [Slice and String Literals](/docs/slices/literals) — another way to obtain a slice
- [Slices and Pointers](/docs/slices/low-level) — reaching the backing memory directly
