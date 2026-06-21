# `UuidV4`

Generates a random version-4 UUID as a string.

**Module:** `Std::UUID`

## Signature

```rux
func UuidV4() -> String;
```

## Returns

`String` — a new random UUID in canonical form,
`xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx` (36 characters), with the version (`4`)
and variant bits set.

## Description

Produces a version-4 UUID with random bytes, lowercase hex, and the standard
hyphen layout.

::: warning
The randomness is **not** cryptographically secure — see the
[module overview](/api/std/uuid/). Use it for identifiers, not secrets.
:::

## Example

```rux
import Std::UUID;
import Std::Io::PrintLine;

func Main() -> int {
    PrintLine(UUID::UuidV4());
    return 0;
}
```

## See also

- [`Std::UUID`](/api/std/uuid/) — module overview
- [`UuidV4Bytes`](uuidv4bytes) — the raw-bytes form
- [`UuidNil`](uuidnil) — the all-zero UUID
