# `TrimInPlace`

Removes surrounding whitespace in place.

**Module:** `Std`

## Signature

```rux
func TrimInPlace(self);
```

## Description

Mutates the receiver in place: shifts the trimmed bytes to the front of the
existing buffer and shrinks `length` accordingly. Whitespace is space (` `), tab
(`\t`), newline (`\n`), or carriage return (`\r`). Unlike [`Trim`](trim), it
allocates nothing and returns nothing.

## See also

- [`String`](/api/std/string/) — the string type
- [`Trim`](trim) — the copying variant
