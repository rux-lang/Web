# `Std::Hex`

Hexadecimal encoding and decoding.

**Module:** `Std::Hex`

Converts binary data to a lowercase hex string (two characters per byte) and
back. Decoding accepts both uppercase and lowercase digits.

```rux
import Hex;
import Io::PrintLine;

func Main() -> int {
    let encoded = Hex::Encode("Rux");
    PrintLine(encoded);          // 527578
    return 0;
}
```

## Functions

| Function                          | Description                                          |
| --------------------------------- | ---------------------------------------------------- |
| [`Encode`](encode)                | Encode a slice to a hex string.                      |
| [`EncodeBytes`](encodebytes)      | Encode raw bytes (pointer + length) to a hex string. |
| [`Decode`](decode)                | Decode a hex slice back to bytes.                    |
| [`DecodeBytes`](decodebytes)      | Decode raw hex bytes (pointer + length).             |

## See also

- [`Std::Base64`](../base64/) — Base64 encoding
