# `Std::Base64`

Standard Base64 encoding and decoding.

**Module:** `Std::Base64`

Encodes binary data to ASCII text and back using the standard Base64 alphabet
(`A`–`Z`, `a`–`z`, `0`–`9`, `+`, `/`) with `=` padding.

```rux
import Rux::Base64;
import Io::PrintLine;

func Main() -> int {
    let text = "Hello";
    let encoded = Base64::EncodeBase64(text.data, text.length);
    PrintLine(encoded);          // SGVsbG8=
    return 0;
}
```

## Functions

| Function                       | Description                           |
| ------------------------------ | ------------------------------------- |
| [`EncodeBase64`](encodebase64) | Encode bytes to a Base64 string.      |
| [`DecodeBase64`](decodebase64) | Decode a Base64 string back to bytes. |

## See also

- [`Std::Hex`](../hex/) — hexadecimal encoding
