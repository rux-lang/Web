# `ToUpperInPlace`

Uppercases ASCII letters in place.

**Module:** `Std`

## Signature

```rux
func ToUpperInPlace(self);
```

## Description

Mutates the receiver's existing buffer, converting each ASCII lowercase letter
(`a`–`z`) to uppercase; all other bytes are left as-is. Unlike
[`ToUpper`](toupper), it allocates nothing and returns nothing.

## See also

- [`String`](/api/std/string/) — the string type
- [`ToUpper`](toupper) — the copying variant
- [`ToLowerInPlace`](tolowerinplace) — the lowercase counterpart
