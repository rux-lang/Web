# `ToLower`

Returns a copy with ASCII letters converted to lowercase.

**Module:** `Std`

## Signature

```rux
func ToLower(self) -> String;
```

## Returns

`String` — a new string with every ASCII uppercase letter (`A`–`Z`) lowercased.

## Description

Only ASCII letters are affected; all other bytes are copied unchanged. The
receiver is left untouched. To modify the string in place, use
[`ToLowerInPlace`](tolowerinplace).

## See also

- [`String`](/api/std/string/) — the string type
- [`ToUpper`](toupper) — the uppercase counterpart
- [`ToLowerInPlace`](tolowerinplace) — the in-place variant
