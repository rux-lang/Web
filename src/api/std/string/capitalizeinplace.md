# `CapitalizeInPlace`

Capitalizes the string in place.

**Module:** `Std`

## Signature

```rux
func CapitalizeInPlace(self);
```

## Description

Mutates the receiver's existing buffer, uppercasing the first character and
lowercasing the remaining ASCII letters. An empty string is left unchanged.
Unlike [`Capitalize`](capitalize), it allocates nothing and returns nothing.

## See also

- [`String`](/api/std/string/) — the string type
- [`Capitalize`](capitalize) — the copying variant
- [`TitleCaseInPlace`](titlecaseinplace) — capitalize every word in place
