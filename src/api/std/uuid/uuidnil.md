# `UuidNil`

Returns the nil (all-zero) UUID string.

**Module:** `Std::UUID`

## Signature

```rux
func UuidNil() -> String;
```

## Returns

`String` — the canonical nil UUID, `00000000-0000-0000-0000-000000000000`.

## Description

The nil UUID is the conventional "absent" or "uninitialized" value. Use it as a
sentinel where a UUID is expected but none applies.

## Example

```rux
import Std::UUID;
import Std::Io::PrintLine;

func Main() -> int {
    PrintLine(UUID::UuidNil());   // 00000000-0000-0000-0000-000000000000
    return 0;
}
```

## See also

- [`Std::UUID`](/api/std/uuid/) — module overview
- [`UuidV4`](uuidv4) — generate a real UUID
