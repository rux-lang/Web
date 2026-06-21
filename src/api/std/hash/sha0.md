# `Sha0`

Computes a SHA-0 digest.

**Module:** `Std::Hash::Sha0`

## Signature

```rux
func Hash(message: char8[]) -> String;
```

## Parameters

| Name      | Type      | Description       |
| --------- | --------- | ----------------- |
| `message` | `char8[]` | The data to hash. |

## Returns

`String` — the 20-byte (160-bit) digest as a 40-character lowercase hex string.

## Description

SHA-0 is the original 1993 secure-hash design, withdrawn and replaced by
[SHA-1](sha1) after a flaw was found. It is provided mainly for historical and
interoperability purposes. Call it as `Sha0::Hash(...)`.

::: warning
**SHA-0 is cryptographically broken** and was deprecated decades ago. Never use
it for security. Prefer [`Sha256`](sha256), [`Blake2`](blake2), or
[`Blake3`](blake3).
:::

## Example

```rux
import Std::Hash::Sha0;
import Std::Io::PrintLine;

func Main() -> int {
    PrintLine(Sha0::Hash("hello"));
    return 0;
}
```

## See also

- [`Std::Hash`](/api/std/hash/) — all hash algorithms
- [`Sha1`](sha1) — its successor
