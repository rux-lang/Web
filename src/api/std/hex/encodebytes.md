# `EncodeBytes`

Encodes raw bytes to a lowercase hex string.

**Module:** `Std::Hex`

## Signature

```rux
func EncodeBytes(bytes: *const char8, length: uint) -> String;
```

## Parameters

| Name     | Type            | Description                   |
| -------- | --------------- | ---------------------------- |
| `bytes`  | `*const char8`  | Pointer to the bytes.        |
| `length` | `uint`          | Number of bytes to encode.   |

## Returns

`String` — the hex text, two lowercase characters per input byte. The pointer
form of [`Encode`](encode), for when you have a raw buffer rather than a slice.

## Example

```rux
import Std::Hex;

let s = Hex::EncodeBytes(buffer, 16u);
```

## See also

- [`Std::Hex`](/api/std/hex/) — module overview
- [`Encode`](encode) — encode from a slice
- [`DecodeBytes`](decodebytes) — the inverse
