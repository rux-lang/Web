# `IsValidUuid`

Reports whether a string is a well-formed UUID.

**Module:** `Std::UUID`

## Signature

```rux
func IsValidUuid(str: char8[]) -> bool;
func IsValidUuid(str: *const char8, length: uint) -> bool;
```

## Parameters

| Name     | Type                       | Description                        |
| -------- | -------------------------- | ---------------------------------- |
| `str`    | `char8[]` / `*const char8` | The text to check.                 |
| `length` | `uint`                     | Length of the text (pointer form). |

## Returns

`bool` — `true` if `str` is a 36-character canonical UUID with hyphens in the
right places and valid hex digits elsewhere; otherwise `false`.

## Description

The safe, non-aborting counterpart to [`UuidParse`](uuidparse). Use it to
validate untrusted input before parsing, since `UuidParse` aborts on malformed
input.

## Example

```rux
import Rux::UUID;

if UUID::IsValidUuid(text) {
    let bytes = UUID::UuidParse(text);
}
```

## See also

- [`Std::UUID`](/api/std/uuid/) — module overview
- [`UuidParse`](uuidparse) — parse after validating
