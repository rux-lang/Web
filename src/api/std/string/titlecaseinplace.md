# `TitleCaseInPlace`

Title-cases the string in place.

**Module:** `Std`

## Signature

```rux
func TitleCaseInPlace(self);
```

## Description

Mutates the receiver's existing buffer, uppercasing the first letter of each
space-separated word and lowercasing the rest. Unlike [`TitleCase`](titlecase),
it allocates nothing and returns nothing.

## See also

- [`String`](/api/std/string/) — the string type
- [`TitleCase`](titlecase) — the copying variant
- [`CapitalizeInPlace`](capitalizeinplace) — capitalize only the first word in place
