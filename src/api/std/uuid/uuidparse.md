# `UuidParse`

Parses a canonical UUID string into raw bytes.

**Module:** `Std::UUID`

## Signature

```rux
func UuidParse(str: char8[]) -> String;
func UuidParse(str: *const char8, length: uint) -> String;
```

## Parameters

| Name     | Type                       | Description                        |
| -------- | -------------------------- | ---------------------------------- |
| `str`    | `char8[]` / `*const char8` | The canonical UUID text.           |
| `length` | `uint`                     | Length of the text (pointer form). |

## Returns

`String` — the 16 decoded UUID bytes, packed into a `String` of length 16.

## Description

Parses a 36-character canonical UUID (`xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`) into
its raw bytes, accepting upper- or lowercase hex digits.

::: warning
The input must be exactly 36 characters with hyphens in the correct positions and
valid hex elsewhere; otherwise the call aborts via [`Fatal`](../fatal). To check
input safely first, use [`IsValidUuid`](isvaliduuid).
:::

## Example

```rux
import Rux::UUID;

if UUID::IsValidUuid(text) {
    let bytes = UUID::UuidParse(text);   // 16 bytes
}
```

## See also

- [`Std::UUID`](/api/std/uuid/) — module overview
- [`IsValidUuid`](isvaliduuid) — validate before parsing
- [`UuidToString`](uuidtostring) — the inverse (bytes → string)
