# `IsSpace`

Reports whether a byte is whitespace.

**Package:** `Text`

## Signature

```rux
func IsSpace(ch: char8) -> bool;
```

## Parameters

| Name | Type    | Description        |
| ---- | ------- | ------------------ |
| `ch` | `char8` | The byte to test.  |

## Returns

`true` for space (`' '`), tab (`'\t'`), newline (`'\n'`), and carriage return (`'\r'`), and `false` for every other byte. These four are exactly the bytes [`String::Trim`](string/trim) removes.

The test is on one byte, so it says nothing about the whitespace characters that UTF-8 encodes in more than one — a non-breaking space is not whitespace here.

## Example

```rux
import Text::IsSpace;

func Main() -> int {
    IsSpace(c8' ');  // true
    IsSpace(c8'\n'); // true
    IsSpace(c8'a');  // false
    return 0;
}
```

## See also

- [`Text`](/api/text/) — the package overview
- [`String::Trim`](string/trim) — drop the whitespace at both ends of a string
