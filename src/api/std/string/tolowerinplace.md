# `ToLowerInPlace`

Lowercases ASCII letters in place.

**Module:** `Std`

## Signature

```rux
func ToLowerInPlace(self);
```

## Description

Mutates the receiver's existing buffer, converting each ASCII uppercase letter
(`A`–`Z`) to lowercase; all other bytes are left as-is. Unlike
[`ToLower`](tolower), it allocates nothing and returns nothing.

## See also

- [`String`](/api/std/string/) — the string type
- [`ToLower`](tolower) — the copying variant
- [`ToUpperInPlace`](toupperinplace) — the uppercase counterpart
