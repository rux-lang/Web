# `Blake3`

Computes a BLAKE3 digest.

**Module:** `Std::Hash::Blake3`

## Signature

```rux
func Hash(message: char8[]) -> String;
```

## Parameters

| Name      | Type      | Description       |
| --------- | --------- | ----------------- |
| `message` | `char8[]` | The data to hash. |

## Returns

`String` — the 32-byte (256-bit) digest as a 64-character lowercase hex string.

## Description

BLAKE3 is a modern, very fast, secure cryptographic hash. Call it as
`Blake3::Hash(...)`.

## Example

```rux
import Std::Hash::Blake3;
import Std::Io::PrintLine;

func Main() -> int {
    PrintLine(Blake3::Hash("hello"));
    return 0;
}
```

## See also

- [`Std::Hash`](/api/std/hash/) — all hash algorithms
- [`Blake2`](blake2) — the 512-bit predecessor
