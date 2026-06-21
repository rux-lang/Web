# `ToUpper`

Returns a copy with ASCII letters converted to uppercase.

**Module:** `Std`

## Signature

```rux
func ToUpper(self) -> String;
```

## Returns

`String` — a new string with every ASCII lowercase letter (`a`–`z`) uppercased.

## Description

Only ASCII letters are affected; all other bytes are copied unchanged. The
receiver is left untouched. To modify the string in place, use
[`ToUpperInPlace`](toupperinplace).

## See also

- [`String`](/api/std/string/) — the string type
- [`ToLower`](tolower) — the lowercase counterpart
- [`ToUpperInPlace`](toupperinplace) — the in-place variant
