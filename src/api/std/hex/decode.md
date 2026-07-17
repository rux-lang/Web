# `Decode`

Decodes a hex slice back to bytes.

**Module:** `Std::Hex`

## Signature

```rux
func Decode(hex: char8[]) -> String;
```

## Parameters

| Name  | Type       | Description                |
| ----- | ---------- | ------------------------- |
| `hex` | `char8[]`  | The hex text to decode.   |

## Returns

`String` — the decoded bytes, packed into a `String`. Decoding an empty slice
returns an empty string.

## Description

Reverses [`Encode`](encode). Accepts both uppercase and lowercase hex digits. The
returned `String` holds raw bytes, which may include zeros and need not be
printable text.

::: warning
The input must have an even length, and every character must be a valid hex digit
(`0`–`9`, `a`–`f`, `A`–`F`). Violations abort the program via
[`Fatal`](../fatal). Validate untrusted input before decoding.
:::

## Example

```rux
import Rux::Hex;

let bytes = Hex::Decode("527578");   // "Rux"
```

## See also

- [`Std::Hex`](/api/std/hex/) — module overview
- [`Encode`](encode) — the inverse
- [`DecodeBytes`](decodebytes) — decode from a raw pointer
