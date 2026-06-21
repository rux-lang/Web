# `Std::Hash`

Cryptographic and general-purpose hash functions.

**Module:** `Std::Hash`

Each algorithm lives in its own submodule (`Std::Hash::Sha256`, etc.) and exposes
a single static `Hash` that takes a message and returns its digest as a
**lowercase hex string**.

```rux
import Std::Hash::Sha256;
import Std::Io::PrintLine;

func Main() -> int {
    PrintLine(Sha256::Hash("hello"));
    // 2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824
    return 0;
}
```

## Algorithms

| Algorithm          | Digest size        | Hex length | Notes                       |
| ------------------ | ------------------ | ---------- | --------------------------- |
| [`Blake2`](blake2) | 64 bytes (512-bit) | 128        | Fast, secure.               |
| [`Blake3`](blake3) | 32 bytes (256-bit) | 64         | Fast, secure.               |
| [`Sha256`](sha256) | 32 bytes (256-bit) | 64         | Secure; widely used.        |
| [`Sha512`](sha512) | 64 bytes (512-bit) | 128        | Secure; widely used.        |
| [`Sha1`](sha1)     | 20 bytes (160-bit) | 40         | ⚠️ Broken — legacy only.    |
| [`Sha0`](sha0)     | 20 bytes (160-bit) | 40         | ⚠️ Broken — historical.     |
| [`Md5`](md5)       | 16 bytes (128-bit) | 32         | ⚠️ Broken — checksums only. |

::: warning
**MD5, SHA-0, and SHA-1 are cryptographically broken.** Do not use them for
signatures, passwords, or integrity against an adversary. For new security work,
choose SHA-256, SHA-512, BLAKE2, or BLAKE3.
:::
