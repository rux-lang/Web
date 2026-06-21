# `Repeat`

Returns the string repeated a number of times.

**Module:** `Std`

## Signature

```rux
func Repeat(self, count: uint) -> String;
```

## Parameters

| Name    | Type   | Description                           |
| ------- | ------ | ------------------------------------- |
| `count` | `uint` | Number of times to repeat the string. |

## Returns

`String` — a new string consisting of the receiver repeated `count` times.
Returns an empty string when `count` is `0` or the receiver is empty.

## Description

Builds the result with a single allocation sized for the full output. A `count`
of `1` returns a plain copy of the receiver.

## See also

- [`String`](/api/std/string/) — the string type
- [`Clone`](clone) — copy the string once
