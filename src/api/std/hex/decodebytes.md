# `DecodeBytes`

Decodes raw hex bytes back to bytes.

**Module:** `Std::Hex`

## Signature

```rux
func DecodeBytes(hex: *const char8, length: uint) -> String;
```

## Parameters

| Name     | Type            | Description                       |
| -------- | --------------- | -------------------------------- |
| `hex`    | `*const char8`  | Pointer to the hex text.         |
| `length` | `uint`          | Length of the hex text in bytes. |

## Returns

`String` — the decoded bytes, packed into a `String`. The pointer form of
[`Decode`](decode), for when you have a raw buffer rather than a slice.

::: warning
The input length must be even, and every character must be a valid hex digit
(`0`–`9`, `a`–`f`, `A`–`F`). Violations abort the program via
[`Fatal`](../fatal).
:::

## Example

```rux
import Std::Hex;

let bytes = Hex::DecodeBytes(hexBuffer, hexLen);
```

## See also

- [`Std::Hex`](/api/std/hex/) — module overview
- [`Decode`](decode) — decode from a slice
- [`EncodeBytes`](encodebytes) — the inverse
