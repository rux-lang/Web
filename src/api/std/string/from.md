# `From`

Creates a string by copying existing character data.

**Module:** `Std`

## Signature

```rux
func From(slice: char8[]) -> String;
func From(str: *const char8, length: uint) -> String;
```

## Parameters

| Name     | Type           | Description                                |
| -------- | -------------- | ------------------------------------------ |
| `slice`  | `char8[]`      | A string literal or `char8` slice to copy. |
| `str`    | `*const char8` | Pointer to the first byte to copy.         |
| `length` | `uint`         | Number of bytes to copy from `str`.        |

## Returns

`String` — a new string that owns a freshly allocated copy of the input bytes.

## Description

`From` always copies its source into a new buffer, so the resulting `String` is
independent of the original data and safe to keep, modify, or return. Use the
slice overload for literals (`String::From("hello")`) and the pointer overload
when working with raw memory.

## See also

- [`String`](/api/std/string/) — the string type
- [`New`](new) — create an empty string
- [`Clone`](clone) — copy an existing `String`
