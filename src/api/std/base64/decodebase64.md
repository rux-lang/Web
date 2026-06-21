# `DecodeBase64`

Decodes a Base64 string back to bytes.

**Module:** `Std::Base64`

## Signature

```rux
func DecodeBase64(data: *const char8, length: uint) -> String;
```

## Parameters

| Name     | Type           | Description                         |
| -------- | -------------- | ----------------------------------- |
| `data`   | `*const char8` | Pointer to the Base64 text.         |
| `length` | `uint`         | Length of the Base64 text in bytes. |

## Returns

`String` — the decoded bytes, packed into a `String`. Decoding an empty input
returns an empty string.

## Description

Reverses [`EncodeBase64`](encodebase64), accounting for `=` padding. The returned
`String` holds raw bytes (which may include zeros), not necessarily printable
text — use [`Length`](../string/length) and [`Data`](../string/data) to read it.

::: warning
The input length must be a multiple of 4, and every character must be in the
Base64 alphabet (or `=`). Violations abort the program via [`Fatal`](../fatal).
Validate untrusted input before decoding.
:::

## Example

```rux
import Std::Base64;

let b64 = "UnV4";
let decoded = Base64::DecodeBase64(b64.data, b64.length);   // "Rux"
```

## See also

- [`Std::Base64`](/api/std/base64/) — module overview
- [`EncodeBase64`](encodebase64) — the inverse
