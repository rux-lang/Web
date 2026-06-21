# `Md5`

Computes an MD5 digest.

**Module:** `Std::Hash::Md5`

## Signature

```rux
func Hash(message: char8[]) -> String;
```

## Parameters

| Name      | Type      | Description       |
| --------- | --------- | ----------------- |
| `message` | `char8[]` | The data to hash. |

## Returns

`String` — the 16-byte (128-bit) digest as a 32-character lowercase hex string.

## Description

MD5 produces a compact digest and is still common for non-security checksums and
content fingerprints. Call it as `Md5::Hash(...)`.

::: warning
**MD5 is cryptographically broken.** Collisions are easy to construct, so never
use it for signatures, passwords, or tamper detection against an adversary. Use
[`Sha256`](sha256), [`Blake2`](blake2), or [`Blake3`](blake3) for security.
:::

## Example

```rux
import Std::Hash::Md5;
import Std::Io::PrintLine;

func Main() -> int {
    PrintLine(Md5::Hash("hello"));
    // 5d41402abc4b2a76b9719d911017c592
    return 0;
}
```

## See also

- [`Std::Hash`](/api/std/hash/) — all hash algorithms
- [`Sha256`](sha256) — a secure replacement
