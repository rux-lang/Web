# `UuidToString`

Formats 16 raw bytes as a canonical UUID string.

**Module:** `Std::UUID`

## Signature

```rux
func UuidToString(bytes: *const uint8, length: uint) -> String;
```

## Parameters

| Name     | Type           | Description                              |
| -------- | -------------- | ---------------------------------------- |
| `bytes`  | `*const uint8` | Pointer to the 16 UUID bytes.            |
| `length` | `uint`         | Number of bytes available; must be ≥ 16. |

## Returns

`String` — the canonical 36-character representation
(`xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`), or an empty string if `length` is less
than 16.

## Description

Renders raw UUID bytes as lowercase hex with hyphens. It does not interpret or
validate the version/variant bits — it formats whatever bytes you pass.

## Example

```rux
import Std::UUID;

let raw = UUID::UuidV4Bytes();
let text = UUID::UuidToString(raw.Data() as *const uint8, raw.Length());
```

## See also

- [`Std::UUID`](/api/std/uuid/) — module overview
- [`UuidParse`](uuidparse) — the inverse (string → bytes)
- [`UuidV4Bytes`](uuidv4bytes) — produce raw bytes to format
