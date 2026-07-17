# `Encode`

Encodes a slice to a lowercase hex string.

**Module:** `Std::Hex`

## Signature

```rux
func Encode(bytes: char8[]) -> String;
```

## Parameters

| Name    | Type       | Description                |
| ------- | ---------- | ------------------------- |
| `bytes` | `char8[]`  | The bytes to encode.      |

## Returns

`String` — the hex text, two lowercase characters (`0`–`9`, `a`–`f`) per input
byte. Encoding an empty slice returns an empty string.

## Example

```rux
import Rux::Hex;

let s = Hex::Encode("AB");       // "4142"
```

## See also

- [`Std::Hex`](/api/std/hex/) — module overview
- [`EncodeBytes`](encodebytes) — encode from a raw pointer
- [`Decode`](decode) — the inverse
