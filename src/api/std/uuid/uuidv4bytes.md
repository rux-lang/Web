# `UuidV4Bytes`

Generates a random version-4 UUID as raw bytes.

**Module:** `Std::UUID`

## Signature

```rux
func UuidV4Bytes() -> String;
```

## Returns

`String` — a 16-byte value holding the raw UUID bytes (with the version and
variant bits set). Read the bytes with [`Data`](../string/data); the
[`Length`](../string/length) is always 16.

## Description

Same generation as [`UuidV4`](uuidv4), but returns the 16 binary bytes instead of
the 36-character string. Convert to canonical text later with
[`UuidToString`](uuidtostring).

::: warning
The randomness is **not** cryptographically secure — see the
[module overview](/api/std/uuid/).
:::

## Example

```rux
import Std::UUID;

let raw = UUID::UuidV4Bytes();          // 16 bytes
let text = UUID::UuidToString(raw.Data() as *const uint8, raw.Length());
```

## See also

- [`Std::UUID`](/api/std/uuid/) — module overview
- [`UuidV4`](uuidv4) — the string form
- [`UuidToString`](uuidtostring) — format the bytes
