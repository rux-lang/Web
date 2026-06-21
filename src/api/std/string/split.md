# `Split`

Splits the string into segments on a delimiter.

**Module:** `Std`

## Signature

```rux
func Split(self, delimiter: char8) -> StringArray;
```

## Parameters

| Name        | Type    | Description           |
| ----------- | ------- | --------------------- |
| `delimiter` | `char8` | The byte to split on. |

## Returns

[`StringArray`](/api/std/string/#stringarray) — the segments between each
occurrence of `delimiter`. A string with N delimiters yields N + 1 segments
(some possibly empty).

## Description

`Split` scans the string once and returns each run of bytes between delimiters.

::: warning
The returned segments are **views** into the original string's buffer, not
copies — they share its memory and are only valid while the original `String`
lives. [`Clone`](clone) a segment if you need it to outlive the source.
:::

## Example

```rux
let parts = String::From("a,b,c").Split(c8',');
for i in 0..parts.length {
    PrintLine(parts.data[i]);   // a / b / c
}
```

## See also

- [`String`](/api/std/string/) — the string type
- [`Clone`](clone) — copy a segment to keep it alive
