# `+`

Concatenates two strings, returning a new string.

**Module:** `Std`

## Signature

```rux
func +(self, other: String) -> String;
func +(self, slice: char8[]) -> String;
```

## Parameters

| Name    | Type      | Description                         |
| ------- | --------- | ----------------------------------- |
| `other` | `String`  | A string to append to the receiver. |
| `slice` | `char8[]` | A literal or slice to append.       |

## Returns

`String` — a new string containing the receiver's bytes followed by the
argument's bytes.

## Description

The `+` operator allocates a new buffer and copies both operands into it; neither
operand is modified. Because the right-hand side may be a `char8` slice, string
literals can be appended directly.

## Example

```rux
let greeting = String::From("Hello, ") + name + "!";
```

## See also

- [`String`](/api/std/string/) — the string type
- [`From`](from) — create a string from raw data
