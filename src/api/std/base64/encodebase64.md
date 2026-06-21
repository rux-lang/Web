# `EncodeBase64`

Encodes bytes to a Base64 string.

**Module:** `Std::Base64`

## Signature

```rux
func EncodeBase64(data: *const char8, length: uint) -> String;
```

## Parameters

| Name     | Type           | Description                     |
| -------- | -------------- | ------------------------------- |
| `data`   | `*const char8` | Pointer to the bytes to encode. |
| `length` | `uint`         | Number of bytes to encode.      |

## Returns

`String` — the Base64 text. The output length is always a multiple of 4, padded
with `=` as needed. Encoding zero bytes returns an empty string.

## Example

```rux
import Std::Base64;

let s = "Rux";
let encoded = Base64::EncodeBase64(s.data, s.length);   // "UnV4"
```

## See also

- [`Std::Base64`](/api/std/base64/) — module overview
- [`DecodeBase64`](decodebase64) — the inverse
