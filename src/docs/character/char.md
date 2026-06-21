# `char`

| Property | Value |
| -------- | ----- |
| Alias of | [`char32`](./char32) |
| Size     | 4 bytes (32 bits) |
| Range    | U+0000 – U+10FFFF |
| Coverage | all Unicode planes |

`char` is a built-in, compiler-provided alias for `char32`, the standard Unicode character type:

```rux
type char = char32;  // compiler intrinsic alias
```

The alias resolves at the type-system level — there is no distinct `char` kind in the compiler — so `char` and `char32` are the same type and fully interchangeable. Because `char32` covers every valid Unicode scalar value without truncation, `char` is the right default for general-purpose text handling.

```rux
let c: char = 'Σ';          // equivalent to char32
let octopus: char = '🐙';   // supplementary-plane emoji fits
```

Code that explicitly needs a narrower or wider representation should use the qualified type names ([`char8`](./char8), [`char16`](./char16), …) to make intent clear.

## Literals, Comparison, and Conversion

`char` behaves identically to [`char32`](./char32) in every respect — literal syntax and escape sequences, equality and code-point ordering, the checked widening/narrowing rules, and conversion to and from integers and strings. See the [`char32`](./char32) page for the full reference.

## See Also

- [`char32`](./char32) — the aliased type: full literal, comparison, and conversion rules
- [`char16`](./char16) — narrower, UTF-16 code unit
