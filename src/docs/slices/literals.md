# String Literals

A string literal is the most common way a slice appears directly in source. Unlike an [array literal](/docs/arrays/overview) `[a, b, c]` — which produces an owning array `T[N]` — a `"..."` literal produces a **slice**: a [`Slice<char8>`](/docs/character/char8) whose `data` pointer addresses the string bytes stored in the read-only data section of the binary.

```rux
let greeting = "Hello";   // Slice<char8>; greeting.length == 5
```

Two details follow from this representation:

- **Length is the byte count.** `length` counts bytes, not characters, and does not include any terminator.
- **Strings are not null-terminated.** Rux strings carry their length in the slice header, so there is no trailing `\0`. When calling C, which expects null-terminated strings, account for this difference explicitly.

Because a string *is* a `Slice<char8>`, it supports the same [indexing and iteration](/docs/slices/access) as any other slice, and it can be passed to any function that takes a `Slice<char8>`.

```rux
func Greet(name: Slice<char8>) {
    Print("Hello, ", name);
}

Greet("Rux");   // the literal is a Slice<char8> slice into rodata
```

## See Also

- [Slices](/docs/slices/overview) — the slice view type and its memory layout
- [Arrays](/docs/arrays/overview) — where the `[a, b, c]` literal form belongs
- [Character Types](/docs/character/char8) — the `char8` element type behind strings
- [Indexing and Iteration](/docs/slices/access) — working with the characters of a string
