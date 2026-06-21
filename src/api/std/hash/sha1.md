# `Sha1`

Computes a SHA-1 digest.

**Module:** `Std::Hash::Sha1`

## Signature

```rux
func Hash(message: char8[]) -> String;
func HashSha0(message: char8[]) -> String;
```

## Parameters

| Name      | Type      | Description       |
| --------- | --------- | ----------------- |
| `message` | `char8[]` | The data to hash. |

## Returns

`String` — the 20-byte (160-bit) digest as a 40-character lowercase hex string.

## Description

SHA-1 produces a 160-bit digest. Call it as `Sha1::Hash(...)`. The module also
exposes `HashSha0`, which computes the older [SHA-0](sha0) variant (SHA-1 without
the message-schedule rotation).

::: warning
**SHA-1 is cryptographically broken** — practical collisions exist. Use it only
for compatibility with legacy systems, never for new security work. Prefer
[`Sha256`](sha256), [`Blake2`](blake2), or [`Blake3`](blake3).
:::

## Example

```rux
import Std::Hash::Sha1;
import Std::Io::PrintLine;

func Main() -> int {
    PrintLine(Sha1::Hash("hello"));
    // aaf4c61ddcc5e8a2dabede0f3b482cd9aea9434d
    return 0;
}
```

## See also

- [`Std::Hash`](/api/std/hash/) — all hash algorithms
- [`Sha0`](sha0) — the predecessor
- [`Sha256`](sha256) — a secure replacement
