# Slice and String Literals

Most slices start life as a literal. Both kinds below produce an ordinary 16-byte slice [header](/docs/slices/overview#memory-layout); they differ only in where the elements are stored.

## Slice Literals

A slice literal `[e1, e2, …]` allocates the elements on the stack and returns a slice header pointing to them. The element type is inferred from the values, and `length` is the number of elements:

```rux
let primes = [2, 3, 5, 7, 11];    // int32[]; primes.length == 5
let flags  = [true, false, true]; // bool8[]; flags.length == 3
```

Every element must have the same type — a slice is a sequence of one element type, unlike a [tuple](/docs/tuples/overview).

## String Literals

A string literal produces a `char8[]` slice whose `data` pointer addresses the string bytes in the `.rodata` section of the binary:

```rux
let greeting = "Hello";   // char8[]; greeting.length == 5
```

Two details follow from this representation:

- **Length is the byte count.** `length` counts bytes, not characters, and does not include any terminator.
- **Strings are not null-terminated.** Rux strings carry their length in the header, so there is no trailing `\0`. When calling C, which expects null-terminated strings, account for this difference explicitly.

Because a string is just a `char8[]`, it supports the same [indexing and iteration](/docs/slices/access) as any other slice.

## See Also

- [Slices](/docs/slices/overview) — the slice overview and memory layout
- [Dynamic Slices and Fixed-Size Arrays](/docs/slices/kinds) — the two slice forms
- [Character Types](/docs/character/char8) — the `char8` element type behind strings
