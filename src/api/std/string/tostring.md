# `ToString`

Returns the string itself.

**Module:** `Std`

## Signature

```rux
func ToString(self) -> String;
```

## Returns

`String` — a copy of the receiver.

## Description

`ToString` is `String`'s implementation of the `Display` interface. It lets a
`String` be passed anywhere a `Display` value is expected — for example to
`Print`, `PrintLine`, and `Format`.

## See also

- [`String`](/api/std/string/) — the string type
- [`Print`](/api/std/io/print) — write a value to standard output
