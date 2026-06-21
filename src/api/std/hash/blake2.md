# `Blake2`

Computes a BLAKE2 digest.

**Module:** `Std::Hash::Blake2`

## Signature

```rux
func Hash(message: char8[]) -> String;
```

## Parameters

| Name      | Type      | Description       |
| --------- | --------- | ----------------- |
| `message` | `char8[]` | The data to hash. |

## Returns

`String` — the 64-byte (512-bit) digest as a 128-character lowercase hex string.

## Description

BLAKE2 is a fast, secure cryptographic hash — typically faster than SHA-2 while
offering comparable security. Call it as `Blake2::Hash(...)`.

## Example

```rux
import Std::Hash::Blake2;
import Std::Io::PrintLine;

func Main() -> int {
    PrintLine(Blake2::Hash("hello"));
    return 0;
}
```

## See also

- [`Std::Hash`](/api/std/hash/) — all hash algorithms
- [`Blake3`](blake3) — the newer, 256-bit variant
