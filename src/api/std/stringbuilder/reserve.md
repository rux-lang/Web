# `Reserve`

Ensures room for additional bytes.

**Module:** `Std`

## Signature

```rux
func Reserve(self, additional: uint);
```

## Parameters

| Name         | Type   | Description                                            |
| ------------ | ------ | ------------------------------------------------------ |
| `additional` | `uint` | Extra bytes to guarantee on top of the current length. |

## Description

Grows the buffer if needed so it can hold at least `Length() + additional` bytes
without reallocating. If there is already enough room, it does nothing. Reserving
ahead of a batch of appends avoids repeated reallocations.

## Example

```rux
import Rux::StringBuilder;

var sb = StringBuilder::New();
sb.Reserve(256);             // one allocation instead of several
var i = 0;
while i < 256 {
    sb.Append(c8'.');
    i += 1;
}
```

## See also

- [`StringBuilder`](/api/std/stringbuilder/) — the type
- [`Capacity`](capacity) — read the current capacity
- [`Shrink`](shrink) — release capacity you no longer need
